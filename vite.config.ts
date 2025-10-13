import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isTestMode = process.env.TEST_MODE === 'true' || mode === 'test';
  const isNativeMode = process.env.NATIVE_DEV_MODE === 'true';

  return {
    define: {
      'process.env.TEST_MODE': JSON.stringify(isTestMode ? 'true' : 'false'),
    },
    server: {
      host: '0.0.0.0',
      port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 3002, // Puerto consistente para el frontend (env VITE_PORT)
      allowedHosts: ['frontend', 'localhost', '127.0.0.1', '0.0.0.0', 'host.docker.internal'],
      proxy: {
        '/api': {
          target: isTestMode ? 'http://localhost:3001' : (isNativeMode ? (process.env.BACKEND_URL || 'http://localhost:4003') : 'http://localhost:4003'),
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
