import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  server: {
    host: '0.0.0.0',
    // Honour an assigned PORT (harness/preview); fall back to the repo default.
    port: Number(process.env.PORT) || 5175,
    // Dev only: forward /api to the local Express server (pnpm server).
    proxy: { '/api': { target: 'http://localhost:4001', changeOrigin: true } }
  }
})
