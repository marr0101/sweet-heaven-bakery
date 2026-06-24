import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sweet-heaven-bakery/',  // El nombre de tu repositorio
  build: {
    outDir: '../docs'  // Compila en la carpeta docs
  }
})