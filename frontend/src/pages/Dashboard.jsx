import { useEffect, useState } from "react";
import api from "../api/api";
import NavDashboard from "./NavDashboard";
import { IoWalletOutline } from "react-icons/io5";
import Tagihan from "../components/Tagihan";
import { Banknote, Wallet } from "lucide-react";

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [tagihan, setTagihan] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [paidByUser, setPaidByUser] = useState({});

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return logout();
        const res = await api.get("/auth/me");

        if (!res.data.success) return logout();
        const me = res.data.payload;
        setAdmin(me);

        // fetch tagihan, riwayat, statistics in parallel
        try {
          const [tRes, rRes, sRes] = await Promise.all([
            api.get("/tagihan"),
            api.get("/tagihan/riwayat/all"),
            api.get("/tagihan/statistics"),
          ]);

          if (tRes.data && tRes.data.success) {
            let tPayload = tRes.data.payload || [];
            // If logged-in user is a penghuni, show only their tagihan
            if (me.role === "penghuni") {
              tPayload = tPayload.filter(
                (t) => String(t.Id_Penghuni) === String(me.id)
              );
            }
            setTagihan(tPayload);

            // Compute totals of tagihan per user but only include those already marked 'Lunas'
            const totals = {};
            tPayload
              .filter(
                (item) => item && String(item.Status).toLowerCase() === "lunas"
              )
              .forEach((item) => {
                const uid = String(item.Id_Penghuni);
                const amount = Number(item.Jumlah_Tagihan || 0);
                totals[uid] = (totals[uid] || 0) + (isNaN(amount) ? 0 : amount);
              });
            setPaidByUser(totals);
          }

          if (rRes.data && rRes.data.success) {
            let rPayload = rRes.data.payload || [];
            if (me.role === "penghuni") {
              rPayload = rPayload.filter(
                (r) => String(r.Id_Penghuni) === String(me.id)
              );
            }
            setRiwayat(rPayload);
          }

          if (sRes.data && sRes.data.success)
            setStatistics(sRes.data.payload || null);
        } catch (innerErr) {
          console.error("Failed to fetch tagihan-related data", innerErr);
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  // HANDLE ADD USER
  const handleAddUser = async (e) => {
    e.preventDefault();
    setMsg("");

    const form = new FormData(e.target);

    const newUser = {
      Nama: form.get("Nama"),
      No_Telp: form.get("No_Telp"),
      Alamat: form.get("Alamat"),
      Email: form.get("Email"),
      Password: form.get("Password"),
    };

    try {
      const token = localStorage.getItem("accessToken");

      const res = await api.post("/admin/add-user", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMsg(res.data.message || "User berhasil dibuat");
      e.target.reset();
    } catch (err) {
      setMsg(err.response?.data?.message || "Gagal menambahkan user");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <NavDashboard />
      {/* CONTENT */}
      <div className="px-12 py-16">
        <h1 className="font-bold text-4xl">Pembayaran</h1>
        {/* CARD ATAS */}
        <div className="mt-4 px-32 relative">
          <div className="flex gap-16 justify-center">
            <div className="min-w-[402px] min-h-[206px] shadow-md shadow-gray-200 bg-[#0F7AC7] px-4 rounded-4xl flex justify-center items-center">
              <span className="flex-1/2 justify-center flex">
                <Wallet className="size-24 text-yellow-300" />
              </span>
              <h1 className="flex-1/2 text-white max-w-xs text-2xl">
                Tagihan Pembayaran
              </h1>
            </div>
            <div className="min-w-[402px] min-h-[206px] shadow-md shadow-gray-200 bg-[#0F243F] px-4 rounded-4xl flex justify-center items-center">
              <span className="flex-1/2 justify-center flex">
                <Banknote className="size-24 text-yellow-300" />
              </span>
              <h1 className="flex-1/2 text-white max-w-xs text-2xl">
                Riwayat Pembayaran
              </h1>
            </div>
          </div>
          <div className="mt-4 bg-[#03C3FD]/27 p-4">
            <h1 className="text-[#0172C4]">
              Info MAse!! Bagi penghuni yang sudah melakukan pembayaran harap
              memeriksa kembali status pembayaran di kanal ini.
            </h1>
          </div>
          <div className="absolute left-0 -z-10 -bottom-7 shadow-md rounded-2xl shadow-gray-200 w-full min-h-[230px]"></div>
        </div>
      </div>

      {/* TAGIHAN */}
      <Tagihan
        tagihan={tagihan}
        riwayat={riwayat}
        statistics={statistics}
        admin={admin}
        paidByUser={paidByUser}
      />
    </div>
  );
}
