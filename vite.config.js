// Importaciones necesarias
import { defineConfig } from 'vite'
import { resolve } from 'path'

// Exportamos la configuración de Vite
export default defineConfig({
  // Configuración básica del proyecto
  root: 'public',
  base: '/',
  
  // Configuración de construcción
  build: {
    outDir: '../dist',   // Carpeta de salida para archivos compilados
    emptyOutDir: true,    // Limpia la carpeta antes de construir
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'public/pages/login.html'),
        register: resolve(__dirname, 'public/pages/register.html'),
        dashboard: resolve(__dirname, 'public/pages/dashboard.html')
      }
    }
  },

  // Configuración del servidor de desarrollo
  server: {
    port: 3000,          // Puerto del servidor
    open: true,          // Abre el navegador automáticamente
    cors: true
  },

  // Configuración de rutas y alias
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),     // Alias para importaciones con @
      '/src': resolve(__dirname, 'src')   // Alias para rutas absolutas
    }
  },

  // Configuración para archivos estáticos
  publicDir: 'public',

  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore']
  }
}) 