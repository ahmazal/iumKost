import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import kostds from "../assets/picture/kostds.png";
import { useNavigate } from "react-router-dom";

function NavDashboard() {
  const [user, setUser] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        if (mounted && res.data && res.data.success) {
          const me = res.data.payload || null;
          // if penghuni, fetch full penghuni record to get proper Nama casing
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
        // ignore, user might not be logged in
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
    <>
      <nav className="bg-[#001844] rounded-b-xl shadow-sm px-6 py-2 flex justify-between items-center relative">
        <div onClick={()=>navigate('/')}>
          <img src={kostds} alt="kostds" className="w-36 cursor-pointer" />
        </div>
        <div className="relative" ref={popupRef}>
          <button
            onClick={() => setShowProfilePopup(s => !s)}
            title={user?.nama || user?.username || user?.email || 'User'}
            className="w-12 cursor-pointer h-12 md:w-14 md:h-14 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold text-lg md:text-xl"
          >
            {getInitial()}
          </button>

          {showProfilePopup && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-50 text-sm">
              <div className="p-4 border-b">
                <div className="font-semibold">{user?.nama || user?.username || '-'}</div>
                <div className="text-xs text-gray-500 truncate">{user?.email || '-'}</div>
              </div>
              <div className="p-3">
                <button onClick={logout} className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700">Logout</button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavDashboard;