import React from "react";
import logokost from "../assets/picture/logokost.png";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 h-20 bg-white">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logokost} className="w-30 h-25" alt="Logo Kost" />
      </div>

      {/* Navbar */}
      <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        <li>
          <a href="#home" className="text-gray-700">Home</a></li>
        <li><a href="#fasilitas" className="text-gray-700">Fasilitas</a></li>
        <li><a href="#about" className="text-gray-700">About</a></li>
        <li><a href="#review" className="text-gray-700">Review</a></li>
      </ul>

      {/* kiri-kanan */}
      <div className="w-10"></div>

    </nav>
  );
}
