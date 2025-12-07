import React from "react";
import gambarkost from "../assets/picture/gambarkost.png";

export default function Hero() {
  return (
    <section id="Hero" className="relative min-h-full px-8 md:px-28 py-5 pt-23">
      <div className="bg-linear-to-r w-full h-[480px] from-blue-300 to-blue-500 rounded-4xl p-36.5 flex flex-col md:flex-row items-center gap-10 text-white">
        {/* Text */}
        <div className="flex-1" data-aos="fade-right">
          <h1 className="text-2xl md:text-5xl font-bold leading-tight">
            Kost Putra 3 Saudara – <br /> Nyaman & Strategis
          </h1>

          <p className="mt-4 text-lg text-white/90">
            Kamar rapi, lingkungan tenang, <br />
            dekat kampus & akses transportasi.
          </p>

          {/* Buttons */}
          <div
            className="flex gap-4 mt-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <a
              href="https://www.google.com/maps?q=-6.78068363884325,110.84942761601535"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-400 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-500 transition"
            >
              Lihat Lokasi
            </a>
            
            <a
              href="https://wa.me/6288228675019"
              className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>

        {/* Gambar */}
        <img
          src={gambarkost}
          alt="Kost"
          className="w-[400px] md:w-[510px] absolute right-0 bottom-5 drop-shadow-xl"
          data-aos="fade-left"
        />
      </div>
    </section>
  );
}
