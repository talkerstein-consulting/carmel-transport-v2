import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // This project lives on an archive drive whose change events Vite's watcher
  // misses, which left it serving stale module transforms. Poll instead.
  server: { port: 5180, watch: { usePolling: true, interval: 300 } },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
})
