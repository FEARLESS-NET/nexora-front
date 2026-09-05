// ==========================================
// FRONTEND API CONFIG
// ==========================================
// Single source of truth for API / Socket URLs.
//
// In production (Render) set these at build time:
//   VITE_API_URL    -> https://your-backend.onrender.com/api
//   VITE_SOCKET_URL -> https://your-backend.onrender.com
//
// If unset, falls back to local development (backend on port 3013).

const devFallbackApi = "http://localhost:3013/api";
const devFallbackSocket = "http://localhost:3013";

const apiUrl = import.meta.env.VITE_API_URL;
const socketUrl = import.meta.env.VITE_SOCKET_URL;

// In production builds, a missing env var bakes localhost into the bundle,
// which breaks the deployed site (browsers try the visitor's own computer).
// Warn loudly so a misconfigured Render deploy is easy to spot.
if (!apiUrl && import.meta.env.PROD) {
  console.error(
    "[Nexora] VITE_API_URL is not set! This build points at localhost and API calls will fail. " +
      "Add VITE_API_URL and VITE_SOCKET_URL to your Render Static Site environment and redeploy."
  );
}

export const API_URL = apiUrl || devFallbackApi;
export const SOCKET_URL = socketUrl || devFallbackSocket;