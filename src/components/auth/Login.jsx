import { useState } from "react";
import Swal from "sweetalert2";
import "../styles/Login.css"; // 👈 pakai css yang sama dengan UI awal

const API = "http://localhost:4000";

export default function Login() {
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Login gagal");

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => (window.location.href = "/"));
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: e.message,
      });
      setErr(e.message);
    }
  };

  return (
    <div className="container">
      {/* Bagian kanan */}
      <div className="container-kanan">
        <div className="kotak-gambar-kuning">
          <p className="judul-kotak-kuning">
            Menuju kawasan Solo Technopark yang inovatif dan berdaya saing internasional.
          </p>
          <img src="./gambar.png" alt="" />
        </div>
      </div>

      {/* Bagian kiri */}
      <div className="container-kiri">
        <form onSubmit={onSubmit} className="kotak-form">
          <h1 className="judul-login">Log In</h1>
          <p className="deskripsi-login">
            Akses lebih dalam fitur - fitur IDT Point dengan masuk menggunakan akun
          </p>

          <span>Username / Email</span>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Masukkan username atau email anda"
            value={form.emailOrUsername}
            onChange={onChange}
            required
          />

          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Masukkan password anda"
            value={form.password}
            onChange={onChange}
            required
          />

          <button type="submit">Sign In</button>

          <div className="divider">Or</div>
          <div className="social-login">
            <div className="google">
              <img className="img-google" src="google-icon.png" alt="Google" />
              <a href="">Sign in with Google</a>
            </div>
            <div className="apple">
              <img className="img-apple" src="apple-icon.png" alt="Apple" />
              <a href="">Sign in with Apple</a>
            </div>
          </div>

          <div className="daftar">
            <p>Belum punya akun?</p>
            <a href="/register">Daftar sekarang</a>
          </div>

          {err && <p style={{ color: "red" }}>{err}</p>}
        </form>
      </div>
    </div>
  );
}
