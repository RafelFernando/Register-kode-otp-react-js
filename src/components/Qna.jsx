"use client"; // kalau pakai Next.js
import { useState } from "react";

export default function Qna() {
  const [activeIndexes, setActiveIndexes] = useState([]); // array of opened items

  const toggleQna = (index) => {
    if (activeIndexes.includes(index)) {
      // kalau sudah terbuka → tutup
      setActiveIndexes(activeIndexes.filter((i) => i !== index));
    } else {
      // kalau belum terbuka → tambahkan
      setActiveIndexes([...activeIndexes, index]);
    }
  };

  const data = [
    {
      q: "Apa itu Talent Hub?",
      a: "Talent Hub adalah platform untuk mengembangkan skill dan karir melalui pelatihan online."
    },
    {
      q: "Apakah pelatihan gratis?",
      a: "Sebagian pelatihan gratis, sebagian lainnya premium dengan harga terjangkau."
    },
    {
      q: "Apakah pelatihan gratis?",
      a: "Sebagian pelatihan gratis, sebagian lainnya premium dengan harga terjangkau."
    },
    {
      q: "Apakah pelatihan gratis?",
      a: "Sebagian pelatihan gratis, sebagian lainnya premium dengan harga terjangkau."
    },
    {
      q: "Apakah pelatihan gratis?",
      a: "Sebagian pelatihan gratis, sebagian lainnya premium dengan harga terjangkau."
    }
  ];

  return (
    <section className="qna-section">
      < h1 className="judul-qna">Pertanyaan sering ditanyakan</h1>
      {data.map((item, index) => (
        <div
          key={index}
          className={`qna-item ${
            activeIndexes.includes(index) ? "active" : ""
          }`}
        >
          <button className="qna-question" onClick={() => toggleQna(index)}>
            {item.q}
            <span className="arrow">^</span>
          </button>
          <div className="qna-answer">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
