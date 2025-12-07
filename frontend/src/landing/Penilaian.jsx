import React from "react";
import { FaStar } from "react-icons/fa";

export default function Penilaian() {
  return (
    <section
      id="Penilaian"
      className="relative px-6 md:px-20 py-20 overflow-hidden"
    >
      {/* Background Segitiga */}
      <div className="absolute right-0 top-10 opacity-90 hidden md:block">
        <svg width="460" height="380" viewBox="0 0 460 380">
          <polygon points="300,60 420,140 300,220" fill="#d9d9d9" />
          <polygon points="120,80 220,140 120,200" fill="#f3f3f3" />
          <polygon points="420,140 460,180 420,220" fill="#d9d9d9" />
          <polygon points="320,160 380,200 320,240" fill="#39A7FF" />
        </svg>
      </div>

      {/* JUDUL */}
      <div data-aos="fade-up">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Penilaian Penghuni
        </h1>
        <p className="text-gray-600 max-w-xl mt-3 text-sm md:text-base">
          Lokasi strategis! Dekat kampus, minimarket, dan tempat makan. Berada
          di area ramai, namun tetap tenang untuk beristirahat.
        </p>
      </div>

      {/* RATING BESAR  */}
      <div
        className="flex items-center mt-12 gap-6"
        data-aos="fade-right"
        data-aos-delay="150"
      >
        <h1 className="text-6xl font-bold">4,5</h1>
        <div>
          <p className="text-gray-600 font-medium">Dari 5 Bintang</p>
          <div className="flex text-yellow-400 text-2xl mt-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar className="text-gray-300" />
          </div>
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-2" data-aos="fade-up">
        (50 Review baru)
      </p>

      {/* BAR */}
      <div
        className="mt-10 space-y-3 w-full max-w-lg"
        data-aos="fade-left"
        data-aos-delay="200"
      >
        {[5, 4, 3, 2, 1].map((star, index) => {
          const widths = ["90%", "70%", "40%", "20%", "10%"];
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="w-12 text-sm">{star} ★</span>

              <div className="bg-gray-300 h-3 w-full rounded-full overflow-hidden">
                <div
                  className="bg-yellow-400 h-3 rounded-full"
                  style={{ width: widths[index] }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* REVIEW CARDS */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
        data-aos="fade-up"
        data-aos-delay="250"
      >
        {/* CARD 1 */}
        <div
          className="p-6 border border-gray-200 rounded-2xl bg-white shadow-md transition"
          data-aos="zoom-in"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Bigmo</h2>
            <p className="text-gray-400 text-sm">26 Oktober 2025</p>
          </div>

          <div className="flex text-yellow-400 text-lg mt-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar className="text-gray-300" />
          </div>

          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Kos Putra 3 Saudara benar-benar memberikan kenyamanan dan
            ketenangan. Fasilitas bersih, lingkungan aman, dan pengelola sangat
            responsif.
          </p>

          <img
            src="https://i.pravatar.cc/40?img=7"
            className="w-10 h-10 rounded-full mt-4"
            alt="user"
          />
        </div>

        {/* CARD 2 */}
        <div
          className="p-6 border border-gray-200 rounded-2xl bg-white shadow-md transition"
          data-aos="zoom-in"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Mas Rusdi</h2>
            <p className="text-gray-400 text-sm">28 Oktober 2025</p>
          </div>

          <div className="flex text-yellow-400 text-lg mt-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Lingkungannya nyaman dan dekat dengan fasilitas umum. Rekomendasi
            banget buat mahasiswa perantau.
          </p>

          <img
            src="https://i.pravatar.cc/40?img=7"
            className="w-10 h-10 rounded-full mt-4"
            alt="user"
          />
        </div>

        {/* CARD 3 */}
        <div
          className="p-6 border border-gray-200 rounded-2xl bg-white shadow-md transition"
          data-aos="zoom-in"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Mas Amba</h2>
            <p className="text-gray-400 text-sm">30 Oktober 2025</p>
          </div>

          <div className="flex text-yellow-400 text-lg mt-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Pengurus kosnya ramah, air lancar, dan suasana kamar nyaman banget.
            Cocok untuk yang ingin tempat tenang.
          </p>

          <img
            src="https://i.pravatar.cc/40?img=7"
            className="w-10 h-10 rounded-full mt-4"
            alt="user"
          />
        </div>

        {/* CARD 4 */}
        <div
          className="p-6 border border-gray-200 rounded-2xl bg-white shadow-md transition"
          data-aos="zoom-in"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Halo Mok</h2>
            <p className="text-gray-400 text-sm">31 Oktober 2025</p>
          </div>

          <div className="flex text-yellow-400 text-lg mt-1">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar className="text-gray-300" />
          </div>

          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Harga terjangkau dengan fasilitas yang memadai. Tempatnya bersih dan
            nyaman untuk dihuni jangka panjang.
          </p>

          <img
            src="https://i.pravatar.cc/40?img=7"
            className="w-10 h-10 rounded-full mt-4"
            alt="user"
          />
        </div>
      </div>
    </section>
  );
}
