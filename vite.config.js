import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    // Three.js is the bulk of the bundle; this is expected for a WebGL site.
    chunkSizeWarningLimit: 800,
  },
  server: {
    host: true,
    port: 5173,
  },
});
