import React, { useState, useEffect, useRef } from "react";
import logokost from "../assets/picture/logokost.png";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      
      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      try {
        const res = await api.get('/auth/me');
        if (mounted && res.data && res.data.success) {
          const me = res.data.payload || null;
          if (me && me.role === 'penghuni') {
            try {
              const pRes = await api.get(`/penghuni/${me.id}`);
              if (pRes.data && pRes.data.success) {
                const p = pRes.data.payload || pRes.data || null;
                setUser({ nama: p.Nama || p.nama || '', email: p.Email || p.email || '', role: 'penghuni', id: me.id });
              } else {
                setUser({ nama: me.username || '', email: me.email || '', role: me.role || null, id: me.id || null });
              }
            } catch (err) {
              setUser({ nama: me.username || '', email: me.email || '', role: me.role || null, id: me.id || null });
            }
          } else {
            setUser(me || null);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    fetchMe();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowProfilePopup(false);
      }
    };
    if (showProfilePopup) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showProfilePopup]);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getInitial = () => {
    const name = user?.nama || user?.username || user?.email || '';
    const trimmed = String(name).trim();
    return trimmed.length > 0 ? trimmed[0].toUpperCase() : 'U';
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300
      ${showNav ? "translate-y-0" : "-translate-y-full"} py 7
    `}
    >
      <div className="flex items-center justify-between px-8 py-4 h-20">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logokost} className="w-40 h-30" alt="Logo Kost" />
        </div>

        {/* Navbar */}
        <div
          className="flex items-center px-13 py-3 gap-15
        backdrop-blur-sm bg-transparent border border-zinc-500 
        rounded-full shadow-md"
        >
          <button
            className="relative flex flex-col uppercase text-xs font-bold tracking-wider group overflow-hidden"
            onClick={() => scrollToSection("Hero")}
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
            onClick={() => scrollToSection("Penilaian")}
          >
            <span className="cursor-pointer block translate-y-0 group-hover:-translate-y-full transition-transform duration-300 group-hover:text-blue-500">
              Review
            </span>
            <span className="cursor-pointer absolute left-0 top-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 group-hover:text-blue-500">
              Review
            </span>
          </button>
        </div>

        {/* Right actions: login or profile */}
        <div ref={popupRef} className="relative">
          {!user ? (
            <button onClick={() => navigate("/login")}>
              <span className="cursor-pointer border border-black px-7 py-2 rounded-full backdrop-blur-sm font-semibold hover:bg-blue-400 hover:text-white transition duration-300 hover:shadow-lg hover:scale-105">
                Login
              </span>
            </button>
          ) : (
            <>
              <button onClick={() => setShowProfilePopup(s => !s)} title={user?.nama || user?.username || user?.email || 'User'} className="w-12 h-12 cursor-pointer rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold text-lg">
                {getInitial()}
              </button>

              {showProfilePopup && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-50 text-sm">
                  <div className="p-4 border-b">
                    <div className="font-semibold">{user?.nama || user?.username || '-'}</div>
                    <div className="text-xs text-gray-500 truncate">{user?.email || '-'}</div>
                  </div>
                  <div className="p-3 space-y-2">
                    <button onClick={() => { navigate(user?.role === 'admin' ? '/dashboard' : '/user/dashboard'); setShowProfilePopup(false); }} className="w-full px-3 py-2 rounded hover:bg-gray-100">Dashboard</button>
                    <button onClick={logout} className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
