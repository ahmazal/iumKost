import { useState } from "react";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/auth/login", {
        email,      // backend menerima email sekarang
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      // Query /auth/me to determine role and redirect accordingly
      try {
        const meRes = await api.get('/auth/me');
        if (meRes.data && meRes.data.success) {
          const role = meRes.data.payload.role;
          if (role === 'admin') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/user/dashboard';
          }
          return;
        }
      } catch (err) {
        // if /me fails, fallback to admin dashboard
        console.warn('Failed to fetch /auth/me after login', err);
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setMsg(err.response?.data?.msg || err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {msg && <p className="text-red-500 text-center mb-4 text-sm">{msg}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
