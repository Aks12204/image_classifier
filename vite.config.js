import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base works seamlessly with .nojekyll on GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
