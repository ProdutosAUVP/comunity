import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` relativo permite servir o build em GitHub Pages
// (https://<user>.github.io/<repo>/) sem configuração adicional.
export default defineConfig({
  plugins: [react()],
  base: './',
})
