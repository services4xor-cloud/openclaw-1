import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: parseInt(process.env.PORT || "3000"),
    host: "0.0.0.0",
    proxy: {
      "/webhook": "http://localhost:5678",
      "/media-api": "http://localhost:3001",
    },
  },
});
