import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: parseInt(process.env.PORT || "3000"),
    host: "0.0.0.0",
    proxy: {
      // A local preview can run the live demo against Studio itself: WEBHOOK_TARGET=https://studio.4xor.de
      "/webhook": { target: process.env.WEBHOOK_TARGET || "http://localhost:5678", changeOrigin: true },
      "/media-api": "http://localhost:3001",
    },
  },
});
