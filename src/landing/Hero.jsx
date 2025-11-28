import React from "react";
import gambarkost from "../assets/picture/gambarkost.png";

export default function Hero() {
  return (
    <section className="px-6 md:px-20 py-5 relative">
      
      {/* BOX BIRU */}
      <div className="relative bg-gradient-to-r from-blue-400 to-blue-600 rounded-[40px] p-10 md:p-20 overflow-visible flex flex-col md:flex-row items-center">
        
        {/* TEKS */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Kost Putra 3 Saudara – <br /> Nyaman & Strategis
          </h1>

          <p className="mt-4 text-lg text-white/90">
            Kamar rapi, lingkungan tenang, <br />
            dekat kampus & akses transportasi.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <a 
              href="#lokasi"
              className="bg-blue-300 text-black px-6 py-3 rounded-md font-medium hover:bg-blue-200 transition"
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

      {/* GAMBAR — KELUAR DARI BOX (SEPERTI GAMBAR) */}
      <img 
        src={gambarkost}
        alt="Kost"
        className="
          w-[300px] md:w-[560px] 
          absolute 
          right-0
          bottom-[-40px] md:bottom-[-70px]
          drop-shadow-xl
          rounded-xl
        "
      />

    </section>
  );
}
