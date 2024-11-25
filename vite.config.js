import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import dotenv from "dotenv";
dotenv.config();

console.log(`http://localhost:${process.env.BACKEND_PORT}`)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
})
