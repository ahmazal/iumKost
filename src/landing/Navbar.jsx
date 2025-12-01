import React from "react";
import logokost from "../assets/picture/logokost.png";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 h-20 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logokost} className="w-40 h-30" alt="Logo Kost" />
      </div>

      {/* Navbar */}
      <div className="flex items-center px-13 py-3 gap-15 bg-white/20 backdrop-blur-sm border border-zinc-500 rounded-full shadow-md">
        <button
          className="relative flex flex-col uppercase text-xs font-bold tracking-wider group overflow-hidden"
          onClick={() => scrollToSection("Home")}
        >
          <span className="cursor-pointer block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 group-hover:text-blue-500">
            Home
          </span>
          <span className="cursor-pointer absolute left-0 top-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 group-hover:text-blue-500">
            Home
          </span>
        </button>

        <button
          className="relative flex flex-col uppercase text-xs font-bold tracking-wider group overflow-hidden"
          onClick={() => scrollToSection("Fasilitas")}
        >
          <span className="cursor-pointer block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 group-hover:text-blue-500">
            Fasilitas
          </span>
          <span className="cursor-pointer absolute left-0 top-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 group-hover:text-blue-500">
            Fasilitas
          </span>
        </button>
        <button
          className="relative flex flex-col uppercase text-xs font-bold tracking-wider group overflow-hidden"
          onClick={() => scrollToSection("About")}
        >
          <span className="cursor-pointer block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 group-hover:text-blue-500">
            About
          </span>
          <span className="cursor-pointer absolute left-0 top-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 group-hover:text-blue-500">
            About
          </span>
        </button>
        <button
          className="relative flex flex-col uppercase text-xs font-bold tracking-wider group overflow-hidden"
          onClick={() => scrollToSection("Review")}
        >
          <span className="cursor-pointer block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 group-hover:text-blue-500">
            Review
          </span>
          <span className="cursor-pointer absolute left-0 top-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 group-hover:text-blue-500">
            Review
          </span>
        </button>
      </div>

      <button>
        <span
          onClick={() => Navigate("/Login")}
          className="cursor-pointer border-2 border-black px-7 py-2 rounded-full font-semibold hover:bg-blue-400 hover:text-white transition duration-300 hover:shadow-lg hover:scale-105"
        >
          Login
        </span>
      </button>
    </nav>
  );
}
