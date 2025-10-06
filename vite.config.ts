import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Bind to all interfaces so the dev server is reachable from other containers
    host: '0.0.0.0',
    port: 3000,
    // Allow requests that use service hostnames from within Docker networks
    allowedHosts: ['frontend', 'localhost', '127.0.0.1', '0.0.0.0', 'host.docker.internal'],
    proxy: {
      '/api': {
        // Proxy API calls to the backend service within the Docker network
        target: 'http://backend:4000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    // Ensure React and ReactDOM are pre-bundled so Vite serves ESM-compatible modules
    // otherwise dev server may expose CJS files (like react-dom/client.js) that
    // don't export named ESM bindings and break imports such as `createRoot`.
    include: ['react', 'react-dom']
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
