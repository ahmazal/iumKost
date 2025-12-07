import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setChecking(false);
      setIsAdmin(false);
      return;
    }

    let mounted = true;
    api
      .get('/auth/me')
      .then((res) => {
        if (!mounted) return;
        if (res.data && res.data.success && res.data.payload && res.data.payload.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => setIsAdmin(false))
      .finally(() => {
        if (mounted) setChecking(false);
      });

    return () => { mounted = false };
  }, []);

  if (checking) return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;

  if (!isAdmin) return <Navigate to="/user/dashboard" replace />;

  return children;
}