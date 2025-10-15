import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');

  const isTestMode = env.TEST_MODE === 'true' || mode === 'test';
  const backendPort = env.BACKEND_PORT || '4000';
  const vitePort = env.VITE_PORT ? Number(env.VITE_PORT) : 3002;

  return {
    define: {
      'process.env.TEST_MODE': JSON.stringify(isTestMode ? 'true' : 'false'),
    },
    server: {
      host: '0.0.0.0',
      port: vitePort,
      allowedHosts: ['frontend', 'localhost', '127.0.0.1', '0.0.0.0', 'host.docker.internal'],
      proxy: {
        '/api': {
          target: isTestMode ? 'http://localhost:3001' : `http://localhost:${backendPort}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        output: {
          // manualChunks intentionally left empty to avoid resolution issues during CI/build.
          manualChunks: {},
        },
      },
      // Optimize chunk size limits
      chunkSizeWarningLimit: 1000,
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
