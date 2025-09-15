import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth"; // 👈 hook auth

const API = "http://localhost:4000";

export default function Navbar() {
  const { me, setMe, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null); // 👈 ref mobile menu
  const [mobileOpen, setMobileOpen] = useState(false);

  const doLogout = async () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Sesi kamu akan berakhir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        actions: "swal2-actions-row",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${API}/auth/logout`, {
            method: "POST",
            credentials: "include",
          });
          setMe(null);
          Swal.fire({
            icon: "success",
            title: "Logout Berhasil",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "/login";
          });
        } catch (e) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Gagal logout!",
          });
        }
      }
    });
  };

  // ✅ Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Tutup mobile menu jika klik di luar
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.classList.contains("hamburger") // biar kalau klik hamburger tidak langsung nutup
      ) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [mobileOpen]);

  if (loading) return null;

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <img src="/pemkot.png" alt="Logo 1" className="logo" />
        <img src="/stp.png" alt="Logo 2" className="logo" />
        <img src="/livin.png" alt="Logo 3" className="logo" />
      </div>

      {/* Tombol hamburger hanya muncul di mobile */}
      <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
        ☰
      </div>

      {/* Desktop menu tetap tampil */}
      <ul className="navbar-menu desktop-only">
        <li><a href="#beranda">Beranda</a></li>
        <li><a href="https://etraining.solodigitaltechnopark.co.id/">E-Training</a></li>
        <li><a href="https://talenthub.solodigitaltechnopark.co.id/">Talent Hub</a></li>
        <li><a href="https://ecommerce.solodigitaltechnopark.co.id/">e-Commerce</a></li>
        <li><a href="https://virtual.solodigitaltechnopark.co.id/">Metaverse</a></li>
      </ul>

      <div className="navbar-right desktop-only" ref={dropdownRef}>
        {me ? (
          <div className="user-menu">
            <div className="user-icon" onClick={() => setOpen(!open)}>
              {me?.username?.[0]?.toUpperCase() || "U"}
            </div>
            {open && (
              <div className="dropdown">
                <div className="dropdown-header">
                  <strong>{me.full_name}</strong>
                  <p>{me.email}</p>
                </div>
                <hr />
                <button onClick={doLogout} className="logout-btn">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="signup-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Sign in
          </button>
        )}
      </div>

      {/* Mobile menu (hidden default, muncul saat hamburger ditekan) */}
      <div
        className={`mobile-menu ${mobileOpen ? "open" : ""}`}
        ref={mobileMenuRef} // 👈 kasih ref
      >
        <ul className="navbar-menu">
          <li><a href="#beranda">Beranda</a></li>
          <li><a href="https://etraining.solodigitaltechnopark.co.id/">E-Training</a></li>
          <li><a href="https://talenthub.solodigitaltechnopark.co.id/">Talent Hub</a></li>
          <li><a href="https://ecommerce.solodigitaltechnopark.co.id/">e-Commerce</a></li>
          <li><a href="https://virtual.solodigitaltechnopark.co.id/">Metaverse</a></li>
        </ul>

        <div className="navbar-right">
  {me ? (
    <div className="mobile-user">
      <div className="user-text">
        <strong>{me.full_name}</strong>
        <p>{me.email}</p>
      </div>
      <button onClick={doLogout} className="logout-btn">
        Logout
      </button>
    </div>
  ) : (
    <button
      className="signup-btn"
      onClick={() => (window.location.href = "/login")}
    >
      Sign in
    </button>
  )}
</div>

      </div>
    </nav>
  );
}
