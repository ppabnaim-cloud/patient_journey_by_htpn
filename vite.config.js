import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// tesseract.js ships its worker + wasm as assets. We copy them into the build
// (scripts/vendor-ocr.mjs) so OCR keeps working with no network, which is what
// the on-device/offline promise on screen requires.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', assetsInlineLimit: 0 },
  server: { host: true, port: 5173 }
})
