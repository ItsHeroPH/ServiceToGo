import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
      plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      proxy: {
        "/api" : {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        },
        "/socket.io": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          ws: true,
        }
      },
      host: true,
      port: 4173,
      strictPort: true,
      allowedHosts: ['servicetogo.store', 'www.servicetogo.store']
    },
    preview: {
      proxy: {
        "/api" : {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        },
        "/socket.io": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          ws: true,
        }
      },
      host: true,
      port: 4173,
      strictPort: true,
      allowedHosts: ['servicetogo.store', 'www.servicetogo.store']
    },
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
          chunkFileNames: "assets/scripts/[hash].js",
          entryFileNames: "assets/scripts/[hash].js",
        }
      }
    }
  }
})
