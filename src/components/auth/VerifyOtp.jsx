import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";
import '../styles/VerifyOtp.css'

const API = "http://localhost:4000";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputs = useRef([]);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto focus next
      if (value && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      Swal.fire("Lengkapi OTP terlebih dahulu!");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, otp: otpCode }),
      });
      const data = await res.json();
      if (data.ok) {
        Swal.fire("Akun berhasil diverifikasi!").then(() => {
          window.location.href = "/login";
        });
      } else {
        Swal.fire("OTP salah atau kadaluarsa");
      }
    } catch {
      Swal.fire("Terjadi kesalahan");
    }
  };

  return (
    <div className="verify-container">
      <h1>Verifikasi OTP</h1>
      <p>Masukkan 6 digit kode OTP yang dikirim ke WhatsApp Anda.</p>

      <div className="otp-boxes">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            className="otp-input"
          />
        ))}
      </div>

      <button onClick={verifyOtp} className="button-otp">
        Verifikasi
      </button>
    </div>
  );
}
