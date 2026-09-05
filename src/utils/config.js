// ==========================================
// FRONTEND API CONFIG
// ==========================================
// Single source of truth for API / Socket URLs.
//
// In production (Render) set these at build time:
//   VITE_API_URL   -> https://your-backend.onrender.com/api
//   VITE_SOCKET_URL -> https://your-backend.onrender.com
//
// If unset, falls back to local development (backend on port 3013).

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3013/api";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3013";