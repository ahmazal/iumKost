import React from "react";
import kosImage from "../assets/picture/Fasilitas.jpg";

export default function Fasilitas() {
  return (
    <section className="px-6 md:px-20 py-27">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-20">
        Fasilitas di Kos Putra 3 Saudara
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* LEFT TEXT */}
        <div className="space-y-15 pl-14">
          {/* ITEM 1 */}
          <div className="flex gap-4">
            <span className="bg-blue-300 text-white px-4 py-2 rounded-xl font-bold">
              01
            </span>
            <div>
              <h3 className="font-bold text-lg mb-1">Kondisi Kos</h3>
              <p className="text-gray-600">
                Lingkungan aman, cocok untuk mahasiswa dan pekerja. Dilengkapi
                perabot dasar.
              </p>
            </div>
          </div>

          {/* ITEM 2 */}
          <div className="flex gap-4">
            <span className="bg-blue-300 text-white px-4 py-2 rounded-xl font-bold">
              02
            </span>
            <div>
              <h3 className="font-bold text-lg mb-1">Fasilitas Kamar</h3>
              <p className="text-gray-600">
                WiFi stabil, cocok untuk WFH dan kuliah online. Sudah dilengkapi
                tempat tidur dan lemari pakaian.
              </p>
            </div>
          </div>

          {/* ITEM 3 */}
          <div className="flex gap-4">
            <span className="bg-blue-300 text-white px-4 py-2 rounded-xl font-bold">
              03
            </span>
            <div>
              <h3 className="font-bold text-lg mb-1">Lokasi</h3>
              <p className="text-gray-600">
                Dekat kampus, minimarket, dan tempat makan. Berada di area
                ramai, namun tetap tenang.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative md:w-svh flex justify-center">
          <img
            src={kosImage}
            alt="kos"
            className="rounded-3xl w-[400px] h-[560px] object-cover shadow-xl"
          />

          {/* FLOATING CARDS */}
          <div className="absolute top-7 left-6 bg-white/60 backdrop-blur-md border border-gray/40 shadow-2xl px-4 py-2 rounded-2xl flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40?img=7"
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">Arsya Ganteng</p>
              <p className="text-xs text-gray-600">⭐ 5,0</p>
            </div>
          </div>

          <div className="absolute bottom-40 left-6 bg-white/60 backdrop-blur-md border border-gray/40 shadow-2xl px-4 py-2 rounded-2xl flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40?img=7"
              alt="user"
              className="w-10 h-10 rounded-full shadow-xl 
             bg-white/40 backdrop-blur-sm 
             border border-white/30 p-0.5"
            />
            <div>
              <p className="text-sm font-semibold">Rizal Musang</p>
              <p className="text-xs text-gray-600">⭐ 4,8</p>
            </div>
          </div>

          <div className="absolute bottom-60 right-2 bg-white/60 backdrop-blur-md border border-gray/40 shadow-2xl px-4 py-2 rounded-2xl flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40?img=7"
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">Wardani Musang</p>
              <p className="text-xs text-gray-600">⭐ 4,5</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
