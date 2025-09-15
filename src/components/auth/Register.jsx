import { useState } from "react";
import Swal from "sweetalert2";
import "../styles/Registrasi.css";

const API = "http://localhost:4000";

export default function Registrasi() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    full_name: "",
    phone: "",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      Swal.fire({
        icon: "error",
        title: "Password tidak cocok",
        text: "Konfirmasi password harus sama",
      });
      return;
    }

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("📦 Response register:", data);

      if (!res.ok) throw new Error(data.message || "Gagal registrasi");

      if (data.ok && data.user_id) {
        Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil",
          text: "Cek WhatsApp kamu untuk OTP",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = `/verify-otp?userId=${data.user_id}`;
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (e) {
      console.error("❌ Error register:", e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: e.message || "Terjadi kesalahan",
      });
    }
  };

  return (
    <div className="registrasi-container">
      <div className="registrasi-container-kanan">
        <form onSubmit={onSubmit} className="kotak-form">
          <h1 className="judul-form-registrasi">Register</h1>
          <p className="deskripsi-registrasi">
            Daftarkan dirimu, dan jadi bagian dari kemajuan digital Nusantara
          </p>

          <span>Nama Lengkap</span>
          <input
            type="text"
            name="full_name"
            placeholder="Masukkan nama lengkap anda"
            className="input-registrasi"
            onChange={onChange}
          />

          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="Masukkan email anda"
            className="input-registrasi"
            required
            onChange={onChange}
          />

          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Masukkan password anda"
            className="input-registrasi"
            required
            onChange={onChange}
          />

          <span>Konfirmasi Password</span>
          <input
            type="password"
            name="confirm_password"
            placeholder="Ulangi password anda"
            className="input-registrasi"
            required
            onChange={onChange}
          />

          <div className="phone-input">
            <span className="prefix">Nomor Whatsapp</span>
            <div className="container-phone">
              <span className="country-code">+62</span>
              <input
                type="text"
                name="phone"
                placeholder="8xxxxxxx"
                className="input-registrasi"
                required
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: "62" + e.target.value }))
                }
              />
            </div>
          </div>`




          <button className="button-registrasi" type="submit">
            Sign Up
          </button>

          <div className="divider">Or</div>
          <div className="social-registrasi">
            <div className="google">
              <img className="img-google" src="google-icon.png" alt="Google" />
              <a href="">Sign up with Google</a>
            </div>
            <div className="apple">
              <img className="img-apple" src="apple-icon.png" alt="Apple" />
              <a href="">Sign up with Apple</a>
            </div>
          </div>
          <div className="masuk">
            <p>Sudah punya akun?</p>
            <a href="/login">Masuk disini</a>
          </div>
        </form>
      </div>

      <div className="registrasi-container-kiri">
        <div className="kotak-biru">
          <h1>
            Menuju kawasan Solo Technopark yang inovatif dan berdaya saing
            internasional.
          </h1>
          <img src="./img-daftar.png" alt="" />
        </div>
      </div>
    </div>
  );
}
