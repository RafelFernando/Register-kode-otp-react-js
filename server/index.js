require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();

/* ENV */
const {
  PORT = 4000,
  CLIENT_URL = 'http://localhost:5173',
  JWT_SECRET = 'dev_secret_change_me',
  DB_HOST = '127.0.0.1',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'db_idt',
  EMAIL_USER,
  EMAIL_PASS,
  FONNTE_API_KEY,
} = process.env;

/* DB */
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

/* Middleware */
app.use(cookie());
app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

/* JWT Helpers */
function signUser(user, roles = []) {
  const payload = {
    sub: user.user_id,
    full_name: user.full_name,
    email: user.email,
    roles,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const raw = req.cookies?.token || (req.headers.authorization || '').replace('Bearer ', '');
  if (!raw) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(raw, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/* Email Transporter (opsional) */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/* REGISTER USER + OTP */
app.post("/auth/register", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    let { email, password, confirm_password, phone, full_name } = req.body;
    if (!email || !password || !confirm_password || !phone) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Password dan konfirmasi tidak sama" });
    }

    // format nomor: ubah 08xxxx jadi 628xxxx
    phone = phone.replace(/^0/, "62");

    // cek email
    const [rows] = await conn.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user pending
    const [result] = await conn.query(
      `INSERT INTO users (email, password_hash, full_name, phone, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, full_name || "", phone, "pending"]
    );

    const userId = result.insertId;
    const otp = Math.floor(100000 + Math.random() * 900000);

    // simpan otp
    await conn.query(
      "UPDATE users SET otp_code=?, otp_expires_at=DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE user_id=?",
      [otp, userId]
    );

    const qs = require("querystring");

    // kirim OTP via Fonnte
    try {
      const payload = qs.stringify({
        target: phone,
        message: `Halo ${full_name || "User"}, kode OTP kamu adalah: ${otp}`,
      });

      console.log("📨 Payload ke Fonnte:", payload);

      const waRes = await axios.post("https://api.fonnte.com/send", payload, {
        headers: {
          Authorization: FONNTE_API_KEY.trim(),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("✅ Response Fonnte:", waRes.data);
    } catch (err) {
      console.error("❌ Gagal kirim OTP WA:", err.response?.data || err.message);
    }

    res.json({ ok: true, user_id: userId, message: "Registrasi berhasil, cek WhatsApp untuk OTP" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
});


/* VERIFY OTP */
app.post('/auth/verify-otp', async (req, res) => {
  const { user_id, otp } = req.body;
  if (!user_id || !otp) return res.status(400).json({ message: "user_id dan otp wajib" });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT otp_code, otp_expires_at FROM users WHERE user_id=? LIMIT 1`,
      [user_id]
    );
    if (!rows.length) return res.status(404).json({ message: "User tidak ditemukan" });

    const user = rows[0];
    if (user.otp_code !== otp) return res.status(400).json({ message: "OTP salah" });
    if (new Date(user.otp_expires_at) < new Date()) return res.status(400).json({ message: "OTP kadaluarsa" });

    await conn.query(
      `UPDATE users SET status='active', otp_code=NULL, otp_expires_at=NULL WHERE user_id=?`,
      [user_id]
    );

    res.json({ ok: true, message: "Verifikasi berhasil, akun aktif!" });
  } finally {
    conn.release();
  }
});

/* LOGIN */
app.post('/auth/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'email/username dan password wajib' });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT * FROM users WHERE email=? OR username=? LIMIT 1`,
      [emailOrUsername, emailOrUsername]
    );
    if (!rows.length) return res.status(401).json({ message: 'User tidak ditemukan' });

    const user = rows[0];

    if (user.status !== "active") {
      return res.status(403).json({ message: "Akun belum diverifikasi. Silakan cek WhatsApp untuk OTP." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Password salah' });

    const [rolesRows] = await conn.query(
      `SELECT module_type, role_type FROM user_roles WHERE user_id=?`,
      [user.user_id]
    );
    const roles = rolesRows.map(r => ({ module: r.module_type, role: r.role_type }));
    const token = signUser(user, roles);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      ok: true,
      user: { user_id: user.user_id, username: user.username, email: user.email, roles }
    });
  } finally {
    conn.release();
  }
});

/* PROFIL LOGIN */
app.get('/auth/me', authMiddleware, (req, res) => {
  res.json({
    user_id: req.user.sub,
    full_name: req.user.full_name,
    email: req.user.email,
    roles: req.user.roles,
  });
});

/* LOGOUT */
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`✅ API jalan di http://localhost:${PORT}`));
