import { useEffect, useState } from "react";
import Footer from "../landing/Footer.jsx";
import api from "../api/api";

function Tagihan({ tagihan = [], riwayat = [], statistics = null, admin = null }) {
  const [user, setUser] = useState(admin || null);
  const [loading, setLoading] = useState(!admin);

  useEffect(() => {
    if (admin) {
      setUser(admin);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return logout();

        const res = await api.get("/auth/me");
        if (!res.data.success) return logout();
        setUser(res.data.payload);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [admin]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const formatCurrency = (amount) => {
    if (amount == null) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">Loading...</div>
    );

  const firstTagihan = tagihan && tagihan.length > 0 ? tagihan[0] : null;

  // Determine current displayed user id (prefer authenticated user id)
  const currentUserId = String(user?.id || firstTagihan?.Id_Penghuni || "");

  // Compute aggregated unpaid totals per user: sum Jumlah_Tagihan where Status !== 'Lunas'
  const unpaidTotals = {};
  (tagihan || []).forEach(item => {
    if (!item) return;
    const status = String(item.Status || '').trim().toLowerCase();
    if (status === 'lunas') return; // skip already paid
    const uid = String(item.Id_Penghuni || '');
    // sanitize amount (strip non-digit formatting) then parse
    const amount = Number(String(item.Jumlah_Tagihan || '').replace(/[^0-9.-]+/g, '')) || 0;
    unpaidTotals[uid] = (unpaidTotals[uid] || 0) + amount;
  });

  const aggregatedUnpaidForUser = unpaidTotals[currentUserId] || 0;

  // Find the most recent riwayat for the current user (by tanggal)
  let latestRiwayat = null;
  const riwayatForUser = (riwayat || []).filter(r => String(r.Id_Penghuni || '') === currentUserId);
  if (riwayatForUser.length > 0) {
    riwayatForUser.sort((a, b) => new Date(b.Tanggal_Bayar || b.tanggal_bayar || 0) - new Date(a.Tanggal_Bayar || a.tanggal_bayar || 0));
    latestRiwayat = riwayatForUser[0];
  }
  const firstRiwayat = latestRiwayat || (riwayat && riwayat.length > 0 ? riwayat[0] : null);

  return (
    <>
      <div className="min-h-screen">
        <div className="w-full px-12 mx-auto">
          {/* Tagihan */}
          <div className="bg-white rounded-lg shadow-md shadow-gray-200 p-6">
            <h1 className="text-2xl font-semibold mb-6">Info Tagihan</h1>
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-600 w-32">Nama</span>
                <span className="text-gray-600 mx-4">:</span>
                <span className="text-gray-800">{firstTagihan?.Nama_Penghuni || user?.Nama || '-'}</span>
              </div>

              <div className="flex">
                <span className="text-gray-600 w-32">Kamar</span>
                <span className="text-gray-600 mx-4">:</span>
                <span className="text-gray-800">{firstTagihan?.Id_Penghuni || '-'}</span>
              </div>

              <div className="flex">
                <span className="text-gray-600 w-32">Jumlah Bayar</span>
                <span className="text-gray-600 mx-4">:</span>
                <span className="text-gray-800">{formatCurrency(aggregatedUnpaidForUser)}</span>
              </div>

              <div className="flex">
                <span className="text-gray-600 w-32">Jatuh Tempo</span>
                <span className="text-gray-600 mx-4">:</span>
                <span className="text-gray-800">{firstTagihan?.Jatuh_Tempo || '-'}</span>
              </div>
            </div>
          </div>
          {/* Riwayat Pembayaran */}
          <div className="bg-white rounded-lg shadow-md shadow-gray-200 p-6 mt-8">
            <h1 className="text-2xl font-semibold mb-6">Riwayat Pembayaran</h1>
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-600 w-32">Nama</span>
                <span className="text-gray-600 mx-4">:</span>
                <span className="text-gray-800">{firstRiwayat?.Nama_Penghuni || user?.Nama || '-'}</span>
              </div>

              <div className="flex">
                <span className="text-gray-600 w-32">Kamar</span>
                <span className="text-gray-600 mx-4">:</span>
                <span className="text-gray-800">{firstRiwayat?.Id_Penghuni || '-'}</span>
              </div>

              <div className="flex">
                <span className="text-gray-600 w-32">Jumlah Bayar</span>
                <span className="text-gray-600 mx-4">:</span>
                <span className="text-gray-800">{formatCurrency(firstRiwayat?.Jumlah_Dibayar)}</span>
              </div>

              <div className="flex">
                <span className="text-gray-600 w-32">waktu pembayaran</span>
                <span className="text-gray-600 mx-4">:</span>
                <span className="text-gray-800">{firstRiwayat?.Tanggal_Bayar || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Tagihan;