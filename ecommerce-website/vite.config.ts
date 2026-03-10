import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can change this to any port you prefer
    strictPort: true, // This forces Vite to fail if port 3000 is already in use
  }
})
