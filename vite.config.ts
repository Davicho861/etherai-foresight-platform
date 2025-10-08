import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isTestMode = process.env.TEST_MODE === 'true' || mode === 'test';

  return {
    define: {
      'process.env.TEST_MODE': JSON.stringify(isTestMode ? 'true' : 'false'),
    },
    server: {
      host: '0.0.0.0',
      port: 3002, // Puerto consistente para el frontend
      allowedHosts: ['frontend', 'localhost', '127.0.0.1', '0.0.0.0', 'host.docker.internal'],
      proxy: {
        '/api': {
          target: isTestMode ? 'http://localhost:3001' : 'http://backend:4000',
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
