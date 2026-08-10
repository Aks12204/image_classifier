import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/image_classifier/', // Fixes GitHub Pages asset 404 path resolution
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
