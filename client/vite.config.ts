import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, /api requests go to the Express server unless VITE_API_URL is set.
const apiTarget = process.env.API_PROXY_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: { '/api': apiTarget },
  },
  preview: {
    proxy: { '/api': apiTarget },
  },
});
