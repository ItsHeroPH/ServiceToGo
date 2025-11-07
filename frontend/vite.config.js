import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import obfuscatorPlugin from "vite-plugin-obfuscator"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [
      react(),
      tailwindcss(),
      obfuscatorPlugin({
        apply: "build",
        options: {
          compact: true,
          controlFlowFlattening: true,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.3,
          disableConsoleOutput: true,
          identifierNamesGenerator: "hexadecimal",
          rotateStringArray: true,
          selfDefending: true,
          stringArray: true,
          stringArrayEncoding: ["base64"],
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false,
        },
      }),
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
              return "assets/img/[hash][extname]";
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
      transformer: "lightningcss", // proper placement
    }
  }
})
