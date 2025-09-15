export default function About() {
    return (
        <div className="about-container">
            <div className="about-kanan">
                <h1>Perubahan Nyata</h1>
                <div className="deskripsi">
                    <p className="angka">15000 +</p>
                    <p className="teks">Talenta Digital</p>
                </div>
                <div className="deskripsi">
                    <p className="angka">1000 +</p>
                    <p className="teks">UMKM Go Digital</p>
                </div>
                <div className="deskripsi">
                    <p className="angka">150 +</p>
                    <p className="teks">Mitra Perusahaan</p>
                </div>
                <a href="" className="button-about"></a>
            </div>
            <div className="about-kiri">
                <div className="gambar">
                    <img src="/about.png" alt="" />
                </div>
            </div>
        </div>
    );
}