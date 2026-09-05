import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // ===============================
  // DEVELOPMENT SERVER
  // ===============================

  server: {
    host: true,
    port: 5173,
    strictPort: true,

    proxy: {
      "/api": {
        target: "http://localhost:3013",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ===============================
  // BUILD
  // ===============================

  build: {
    target: "es2022",

    sourcemap: false,

    cssMinify: true,

    chunkSizeWarningLimit: 1000,

    reportCompressedSize: true,

    // Vite 8 = Rolldown
    // manualChunks ishlatilmaydi
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react",
              test: /node_modules[\\/](react|react-dom|react-router-dom)/,
            },
            {
              name: "icons",
              test: /node_modules[\\/]lucide-react/,
            },
            {
              name: "axios",
              test: /node_modules[\\/]axios/,
            },
          ],
        },
      },
    },
  },

  // ===============================
  // DEPENDENCIES
  // ===============================

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "axios",
      "lucide-react",
    ],
  },

  // ===============================
  // ALIAS
  // ===============================

  resolve: {
    alias: {
      "@": "/src",
    },
  },
});