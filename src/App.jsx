import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Menu from "./components/Menu";
import About from "./components/About";
import Ulasan from "./components/Ulasan";
import Qna from "./components/Qna";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyOtp from "./components/auth/VerifyOtp";

const API = "http://localhost:4000";

function App() {
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: "include" });
        if (res.ok) setMe(await res.json());
      } catch {}
      setReady(true);
    })();
  }, []);

  const doLogout = async () => {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
    window.location.reload();
  };

  if (!ready) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Halaman utama */}
        <Route
          path="/"
          element={
            <div className="min-h-screen">
              <Navbar me={me} onLogout={doLogout} />
              <Header />
              <Menu />
              <About />
              <Ulasan />
              <Qna />
              <Contact />
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
