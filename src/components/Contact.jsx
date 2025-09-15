export default function Contact () {
    return (
        <section className="contact-section">
            <div className="contact-kotak-kanan">
                <h1 className="judul-contact">Ada yang ingin kamu tanyakan ?</h1>
                <div className="deskripsi-contact">
                    <p>Punya pertanyaan atau butuh bantuan? Kirimkan pesan kepada kami, dan tim kami akan segera menghubungi Anda.</p>
                </div>
            </div>
            <div className="contact-kotak-kiri">
                <div className="form-contact">
                    <h1>Hubungi Kami</h1>
                    <p>Kami siap membantu menjawab pertanyaan dan memberi dukungan terbaik untuk Anda.</p>
                    <form action="">
                        <span>Nama</span>
                        <input type="text" placeholder="Masukkan nama disini"/>
                        <span>Username</span>
                        <input type="text" placeholder="Masukkan username disini"/>
                        <span>Pertanyaan</span>
                        <input type="text" className="pertanyaan" placeholder="Tulis pertanyaan disini"/>
                        <button className="contact-button">Submit</button>
                    </form>
                </div>
            </div>
        </section>
    )
}