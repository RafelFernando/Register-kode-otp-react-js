export default function Header() {
  return (
    <header className="header">
      {/* Background */}
      <div className="header-bg">
        <img src="/header.png" alt="Background" />
      </div>

      {/* Overlay Content */}
      <div className="header-content">
        <div className="judul-header">
            <h1>Indonesia Digital <br /> <span>Technopark</span></h1>
            <p>Titik Pusat Inovasi Digital & <br />Talenta di Kota Surakarta</p>
        </div>
        
        {/* Maket Image */}
        <img src="/kawasanstp.png" alt="IDT Map" className="map-img" />

        {/* Box Keterangan */}
        <div className="info-box">
            <div className="box-penjelasan">
                <p>
                    IDT Point menghubungkan pelatihan, pekerjaan, perdagangan, dan
                    eksplorasi digital dalam satu platform terintegrasi.
                </p>
                <a href="#" className="btn-knowmore">
                    Know More <span>→</span>
                </a>
            </div>
            
        </div>
      </div>
    </header>
  );
}

