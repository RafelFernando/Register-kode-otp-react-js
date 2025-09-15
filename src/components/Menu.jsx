import React, { useState, useEffect, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const services = [ 
  {
    id: 1,
    title: "E-Training",
    subtitle: "",
    description:
      "E-Training menyediakan berbagai modul pembelajaran digital yang relevan dengan kebutuhan industri saat ini. Dengan pendekatan yang fleksibel dan materi yang terus diperbarui, kamu bisa belajar sesuai ritme sendiri — sambil mempersiapkan diri untuk tantangan karier di masa depan.",
    image:
      "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800",
    background: "/bgetraining.jpg",
  },
  {
    id: 2,
    title: "E-Commerce",
    subtitle: "",
    description:
      "E-Commerce membantu UMKM Go Digital dengan solusi marketplace, payment gateway, dan tools bisnis modern untuk memperluas jangkauan usaha.",
    image:
      "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800",
    background: "/bgecommerce.jpg",
  },
  {
    id: 3,
    title: "TalentHub",
    subtitle: "",
    description:
      "TalentHub mempertemukan talenta digital dengan perusahaan yang membutuhkan, sehingga menciptakan peluang kerja nyata.",
    image:
      "https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg?auto=compress&cs=tinysrgb&w=800",
    background: "/bgtalenthub.png",
  },
  {
    id: 4,
    title: "Metaverse",
    subtitle: "",
    description:
      "Metaverse membuka ruang kolaborasi baru berbasis virtual reality yang interaktif, inovatif, dan menyatukan pengalaman digital.",
    image: "metaversecard.jpg",
    background: "/bgetraining.jpg",
  },
];

export default function Menu() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false); // biar nggak dobel2

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Scroll handler
  const handleWheel = useCallback(
    (e) => {
      if (isScrolling) return; // cegah spam scroll
      setIsScrolling(true);

      if (e.deltaY > 0) {
        // scroll ke bawah → next
        setCurrentIndex((prev) => (prev + 1) % services.length);
      } else {
        // scroll ke atas → prev
        setCurrentIndex(
          (prev) => (prev - 1 + services.length) % services.length
        );
      }

      setTimeout(() => setIsScrolling(false), 800); // kasih delay 800ms
    },
    [isScrolling]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const currentService = services[currentIndex];

  // Refresh AOS setiap kali slide ganti
  useEffect(() => {
    AOS.refreshHard();
  }, [currentIndex]);

  return (
    <section id="services" className="services-section">
      <div
        className="carousel"
        style={{
          backgroundImage: `url(${currentService.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="carousel-content">
          {/* Left Content */}
          <div className="carousel-text">
            <div
              className="carousel-header"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <h3>{currentService.title}</h3>
              <p className="subtitle">{currentService.subtitle}</p>
            </div>

            <p
              className="description"
              data-aos="fade-right"
              data-aos-delay="700"
            >
              {currentService.description}
            </p>

            <button className="learn-more">Explore Now</button>
          </div>

          {/* Right Image Slider */}
          <div className="carousel-slider">
            {services.map((service, index) => {
              let position = "nextSlide";
              if (index === currentIndex) {
                position = "activeSlide";
              } else if (
                index === (currentIndex - 1 + services.length) % services.length
              ) {
                position = "lastSlide";
              }

              return (
                <div key={service.id} className={`slide ${position}`}>
                  <img src={service.image} alt={service.title} />
                  <div className="overlay"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="dots">
          {services.map((_, index) => (
            <button
              key={index}
              className={`dot-btn ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
