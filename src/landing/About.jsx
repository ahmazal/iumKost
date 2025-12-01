import React from "react";
import gambarkost from "../assets/picture/gambarkost.png";
import foto from "../assets/picture/foto.jpg";

export default function About() {
  return (
    <section className="w-full py-20 flex flex-col items-center text-center px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center w-full max-w-6xl">
        <div className="flex justify-start -ml-10">
          <img
            src={gambarkost}
            alt="gambarkost"
            className="rounded-3xl w-[330px] h-[350px] object-cover shadow-md"
          />
        </div>

        {/* CENTER TEXT */}
        <div className="flex flex-col items-center px-4">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            About
          </h1>
          <p className="text-gray-700 mt-4 max-w-md text-sm md:text-base">
            Kos Putra 3 Saudara adalah hunian nyaman dan aman yang dirancang
            khusus untuk mahasiswa, pekerja, dan perantau yang membutuhkan
            tempat tinggal strategis dengan harga terjangkau. Kami berkomitmen
            menyediakan lingkungan ramah, bersih, dan tertata rapi sehingga
            penghuni dapat tinggal dengan tenang dan fokus pada aktivitas
            sehari-hari.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center md:justify-start">
          <img
            src={foto}
            alt="foto"
            className="rounded-3xl w-[330px] h-[350px] object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
