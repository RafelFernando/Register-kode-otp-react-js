// src/hooks/useAuth.js
import { useEffect, useState } from "react";

const API = "http://localhost:4000";

export default function useAuth() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then(data => setMe(data))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  return { me, setMe, loading };
}
