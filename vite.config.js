import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Vite Configuration for Payout Management System
 * 
 * This configuration optimizes the build for production deployment:
 * - Code splitting: Separates vendor libraries for better caching
 * - Production minification: Uses esbuild for fast builds
 * - Development server: Runs on port 3000 with auto-open
 */
export default defineConfig({
  plugins: [vue()],
  
  // Development server configuration
  server: {
    port: 3000,
    open: true
  },
  
  // Production build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable source maps for production (smaller bundle)
    minify: 'esbuild', // Fast minification using esbuild
    
    // Code splitting configuration
    // Splits vendor libraries into separate chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue core libraries chunk
          'vue-vendor': ['vue', 'vue-router'],
          // Element Plus UI library chunk (large library, benefits from separate chunk)
          'element-plus': ['element-plus']
        }
      }
    }
  }
})
