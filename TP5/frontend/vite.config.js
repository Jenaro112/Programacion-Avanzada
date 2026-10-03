import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// * Configuración de Vite para el proyecto React
// ? Vite es el bundler que reemplaza a Webpack, más rápido para desarrollo
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
