import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk: React core
          'vendor-react': ['react', 'react-dom'],
          // Animation library
          'vendor-framer': ['framer-motion'],
        },
      },
    },
  },
})
