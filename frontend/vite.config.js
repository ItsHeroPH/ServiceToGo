import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import obfuscator from "javascript-obfuscator";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [
      react(),
      tailwindcss(),
      obfuscatorPlugin()
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
      allowedHosts: env.HOST_DOMAIN.split(",")
    },
    preview: {
      headers: {
        'Cache-Control': 'no-store',
      },
      proxy: {
        "/api" : {
          target: env.VITE_API_URL,
          changeOrigin: false,
          rewrite: path => path.replace(/^\/api/, "")
        },
        "/socket.io": {
          target: env.VITE_API_URL,
          changeOrigin: false,
          ws: true,
        }
      },
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
      transformer: "lightningcss", // proper placement
    }
  }
})

function obfuscatorPlugin() {
  return {
    name: "obfuscate-all-plugin",
    apply: "build",
    generateBundle(_options, bundle) {
      for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
        if (chunkOrAsset.type === "chunk" && fileName.endsWith(".js")) {
          try {
            const originalCode = chunkOrAsset.code;

            const obfuscated = obfuscator.obfuscate(
              originalCode,
              {
                compact: true,
                controlFlowFlattening: false,
                deadCodeInjection: false,
                stringArray: true,
                stringArrayEncoding: ["base64"],
                rotateStringArray: true,
                stringArrayThreshold: 0.5,
                disableConsoleOutput: true,
                simplify: true,
                transformObjectKeys: true,
                numbersToExpressions: false,
                selfDefending: false,
              },
            );

            chunkOrAsset.code = obfuscated.getObfuscatedCode();
          } catch (err) {
            this.warn(`[obfuscate] failed to obfuscate ${fileName}: ${err}`);
            chunkOrAsset.code = chunkOrAsset.code;
          }
        }
      }
    },
  }
}