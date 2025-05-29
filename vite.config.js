import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Configuración básica
  root: '.',
  base: '/',
  
  // Directorio público donde están tus assets estáticos
  publicDir: 'public',
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    open: true, // Abre el navegador automáticamente
  },
  
  // Configuración del build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        register: resolve(__dirname, 'public/pages/register.html')
      },
    },
  },

  // Optimización
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore']
  },

  // Resolución de rutas
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'src': resolve(__dirname, './src')
    }
  },
}) 