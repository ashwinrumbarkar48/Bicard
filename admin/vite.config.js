import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Admin portal runs on port 3001 in development.
export default defineConfig({
  plugins: [react()],
  server: { port: 3001 },
  build: { outDir: 'dist' },
});
