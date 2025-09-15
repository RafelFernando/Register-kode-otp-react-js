export default function Footer () {
    return (
        <footer className="footer-section">
            <div className="container-footer">
                <div className="footer-kanan">
                    <div className="logo">
                        <img src="./stp.png" alt="" />
                        <p>Menuju kawasan Solo Technopark yang inovatif dan berdaya saing internasional.</p>
                    </div>
                    <div className="sosial-media">
                        <a href=""><i class="fa-brands fa-instagram"></i></a>
                        <a href=""><i class="fa-brands fa-youtube"></i></a>
                        <a href=""><i class="fa-brands fa-linkedin"></i></a>
                        <a href=""><i class="fa-brands fa-tiktok"></i></a>
                    </div>
                </div>
                <div className="footer-tengah">
                    <p className="judul">Hubungi Kami</p>
                    <div className="informasi">
                        <div className="lokasi">
                            <i class="fa-solid fa-location-dot"></i>
                            <p>Kawasan Sains dan Teknologi – Solo Technopark, Jl. Ki Hajar Dewantara No.19, Jebres, Kec. Jebres, Kota Surakarta, Jawa Tengah 57126</p>
                        </div>
                        <div className="telp">
                            <i class="fa-solid fa-phone"></i>
                            <p> (+62) 271 666662</p>
                        </div>
                        <div className="email">
                            <i class="fa-solid fa-envelope"></i>
                            <p>info.solotechnopark@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="footer-kiri">
                    <p className="judul">Location</p>
                    <div className="maps">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.1733991958076!2d110.8512915735762!3d-7.556063874608794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a16e2b5ffa643%3A0xa0bf36ec85b94dfb!2sSolo%20Techno%20Park!5e0!3m2!1sen!2sid!4v1756085992087!5m2!1sen!2sid" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
            <hr />
            <div className="copyright">
                <div className="kanan">
                    <p>Copyright © 2025 | Solo Technopark</p>
                </div>
                <div className="kiri">
                    <p>Design & Developed by IT Solo Technopark</p>
                </div>
            </div>
        </footer>
    )
}