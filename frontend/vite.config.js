import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: true,
      port: 4173,
      strictPort: true,
      allowedHosts: env.HOST_DOMAIN.split(",")
    },
    preview: {
      host: true,
      port: 4173,
      strictPort: true,
      allowedHosts: env.HOST_DOMAIN.split(",")
    },
    build: {
      modulePreload: true,
      minify: "terser",
      target: "es2018",
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              const match = id.match(/node_modules\/(@?[^\/]+)/);
              return match ? match[1] : "vendor";
            }
          },
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name ?? "";
            if (name.match(/\.(gif|jpe?g|png|svg|webp|avif)$/)) {
              return "assets/img/[name][extname]";
            }

            if (name.endsWith(".css")) {
              return "assets/css/[hash][extname]";
            }

            return "assets/[hash][extname]";
          },
          chunkFileNames: "assets/scripts/[hash].js",
          entryFileNames: "assets/scripts/[hash].js",
        },
      },
    },
    css: {
      transformer: "lightningcss",
    }
  }
})