import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    modulePreload: true,
    minify: "terser",
    target: "esnext",
    cssCodeSplit: true,
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/');
            return parts[0];
          }
        },
        assetFileNames: (assetInfo) => {
          if (/\.(gif|jpe?g|png|svg|webp|avif)$/.test(assetInfo.name ?? "")) {
            return "assets/img/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        chunkFileNames: "assets/scripts/[name]-[hash].js",
        entryFileNames: "assets/scripts/[name]-[hash].js",
      }
    }
  }
})
