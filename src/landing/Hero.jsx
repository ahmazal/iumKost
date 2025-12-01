import React from "react";
import gambarkost from "../assets/picture/gambarkost.png";

export default function Hero() {
  return (
    <section className="relative min-h-full px-8 md:px-28 py-5">
      <div className="bg-gradient-to-r w-full h-[480px] from-blue-300 to-blue-500 rounded-4xl p-36.5 flex flex-col md:flex-row items-center gap-10 text-white">
        
        {/* Text */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-5xl font-bold leading-tight">
            Kost Putra 3 Saudara – <br /> Nyaman & Strategis
          </h1>

          <p className="mt-4 text-lg text-white/90">
            Kamar rapi, lingkungan tenang, <br />
            dekat kampus & akses transportasi.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <a
              href="#lokasi"
              className="bg-blue-400 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-200 transition"
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

      </div>
        {/* Gambar */}
        <img
          src={gambarkost}
          alt="Kost"
          className="w-[400px] md:w-[510px] absolute right-0 bottom-[20px] drop-shadow-xl"
        />
    </section>
  );
}
