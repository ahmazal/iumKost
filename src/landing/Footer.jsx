import React from "react";
import { Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react";
import logokost from "../assets/picture/logokost.png";

export default function Footer() {
  return (
    <footer
      id="Footer"
      className="w-full bg-white border-t mt-20 rounded-t-[50px] shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo */}
        <div className="flex flex-col items-start">
          <img src={logokost} alt="Logo Kost" className="w-40 mb-6" />
        </div>

        {/* Tentang */}
        <div>
          <h3 className="font-semibold mb-3">Kost P3 Saudara</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:underline">Tentang Kami</li>
            <li className="cursor-pointer hover:underline">Pusat Bantuan</li>
          </ul>
        </div>

        {/* Kebijakan */}
        <div>
          <h3 className="font-semibold mb-3">KEBIJAKAN</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:underline">
              Kebijakan Privasi
            </li>
            <li className="cursor-pointer hover:underline">
              Syarat dan Ketentuan Umum
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="font-semibold mb-3">HUBUNGI KAMI</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} /> admin@kostP3saudara.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +62 88868934521
            </li>
            <li className="flex items-center gap-4 mt-2">
              <Facebook
                size={18}
                className="cursor-pointer hover:text-blue-600"
              />
              <Twitter
                size={18}
                className="cursor-pointer hover:text-blue-400"
              />
              <Instagram
                size={18}
                className="cursor-pointer hover:text-pink-500"
              />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
