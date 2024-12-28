import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import dotenv from "dotenv";
dotenv.config();


export default defineConfig(({ mode }) => {
  console.log(`Vite mode: ${mode}`); // Log the mode
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    server: {
      host: isProduction ? "0.0.0.0" : "localhost", // Use localhost in development
      port: parseInt(process.env.PORT) || 5173, // Default to 5173
      proxy: {
        "/api": {
          target: isProduction
            ? "https://web-production-5eca0.up.railway.app" // Replace with production backend URL
            : `http://localhost:${process.env.BACKEND_PORT || 3000}`, // Local backend
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        external: ['express', 'buffer'], // Externalize Node.js modules
      },
    },
    optimizeDeps: {
      exclude: ['express', 'buffer'], // Exclude Node.js modules from optimization
    },
  };
});