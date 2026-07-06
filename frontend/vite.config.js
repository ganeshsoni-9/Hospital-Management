import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",   // Mobile se access ke liye
    port: 5173,
    strictPort: true,
  },
});