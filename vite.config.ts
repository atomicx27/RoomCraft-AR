import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose on local network for Expo Go WebView & mobile testing
    port: 3000,
    cors: true,
    allowedHosts: true, // Allow all tunnel hosts (Cloudflare Tunnel, ngrok, localtunnel)
  },
});
