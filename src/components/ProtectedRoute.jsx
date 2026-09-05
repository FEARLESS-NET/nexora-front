import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Auth tekshirilayotgan paytda
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  // Login qilmagan bo'lsa
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Login qilgan bo'lsa
  return <Outlet />;
}