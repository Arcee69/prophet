import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    '/report-files': {
      target: 'https://prophet.smhptech.com/storage/report_files',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/report-files/, ''),
    },
  },
},
})
