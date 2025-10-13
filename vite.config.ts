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
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Code splitting by domain for better performance
            'dashboard-cto': ['../components/dashboards/CTODashboard'],
            'dashboard-cio': ['../components/dashboards/CIODashboard'],
            'dashboard-cso': ['../components/dashboards/CSODashboard'],
            'dashboard-ceo': ['../components/dashboards/CEODashboard'],
            'dashboard-cfo': ['../components/dashboards/CFODashboard'],
            'dashboard-cmo': ['../components/dashboards/CMODashboard'],
            'dashboard-coo': ['../components/dashboards/COODashboard'],
            // Vendor chunks for better caching
            'vendor-react': ['react', 'react-dom'],
            'vendor-charts': ['recharts'],
            'vendor-motion': ['framer-motion'],
            'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          },
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
