import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

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

        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data.success) return logout();

        setAdmin(res.data.payload);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAV */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard Admin</h1>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Informasi Admin
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">ID Admin</p>
              <p className="text-lg font-medium text-gray-800">{admin.id}</p>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">Username</p>
              <p className="text-lg font-medium text-gray-800">
                {admin.username}
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">Role</p>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                {admin.role}
              </span>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">Token Status</p>
              <p className="text-green-600 font-medium">Active</p>
            </div>
          </div>
        </div>

        {/* OTHER CARDS */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700">Total Kamar</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">—</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Penghuni
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">—</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700">
              Tagihan Menunggu
            </h3>
            <p className="text-3xl font-bold text-red-500 mt-2">—</p>
          </div>
        </div>
      </div>
    </div>
  );
}
