import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import dotenv from "dotenv";
dotenv.config();

// console.log(`http://localhost:${process.env.BACKEND_PORT}`)

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: "localhost",
//     proxy: {
//       "/api": {
//         target: `http://localhost:${process.env.BACKEND_PORT}`,
//         changeOrigin: true,
//       },
//     },
//   },
// })

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react()],
    server: {
      host: isProduction ? "0.0.0.0" : "localhost", // Use localhost in development
      port: parseInt(process.env.PORT) || 5173, // Default to 5173
      proxy: {
        "/api": {
          target: isProduction
            ? "web-production-5eca0.up.railway.app" // Replace with production backend URL
            : `http://localhost:${process.env.BACKEND_PORT || 3000}`, // Local backend
          changeOrigin: true,
        },
      },
    },
  };
});