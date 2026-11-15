import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Same routes as nginx.conf, for `npm run dev` with the backends running on this machine.
const proxy = {
  "/api": { target: "http://localhost:8080", rewrite: (p: string) => p.replace(/^\/api/, "") },
  "/ws": { target: "ws://localhost:8082", ws: true },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  // host: true lets a phone on the same network open the dev server from the QR code.
  server: { host: true, proxy },
});
