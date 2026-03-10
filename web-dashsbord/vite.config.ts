import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Admin Dashboard runs on port 5174 (separate from buyer store on 3000)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  }
})
