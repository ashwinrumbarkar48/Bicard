import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Public website runs on port 3000 in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
