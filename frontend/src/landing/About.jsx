import React from "react";
import gambarkost from "../assets/picture/gambarkost.png";
import right from "../assets/picture/right.png";
import left from "../assets/picture/left.png";
import { FaFulcrum } from "react-icons/fa";

export default function About() {
  return (
    <section
      id="About"
      className="w-full py-20 px-6 md:px-20 flex justify-center"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 items-center w-full max-w-7xl relative">
        {/* LEFT IMAGE */}
        <div
          className="flex justify-start md:-ml-20 -mt-50"
          data-aos="fade-right"
        >
          <img
            src={left}
            alt="left"
            className="rounded-l-none rounded-r-3xl w-[330px] h-[300px] object-cover shadow-md"
          />
        </div>

        {/* CENTER TEXT */}
        <div
          className="flex flex-col items-center px-3"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span>
            <FaFulcrum 
            className="text-6xl"
            />
            </span>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            About
          </h1>
          <p className="text-gray-700 mt-4 max-w-md text-sm md:text-base text-center">
            Kos Putra 3 Saudara adalah hunian nyaman dan aman yang dirancang
            khusus untuk mahasiswa, pekerja, dan perantau yang membutuhkan
            tempat tinggal strategis dengan harga terjangkau. Kami berkomitmen
            menyediakan lingkungan ramah, bersih, dan tertata rapi sehingga
            penghuni dapat tinggal dengan tenang dan fokus pada aktivitas
            sehari-hari.
          </p>
          
        </div>

        {/* RIGHT IMAGE */}
        <div
          className="flex justify-end md:-mr-20 mt-50"
          data-aos="fade-left"
          data-aos-delay="400"
        >
          <img
            src={right}
            alt="right"
            className="rounded-r-none rounded-l-3xl w-[260px] h-[300px] shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
