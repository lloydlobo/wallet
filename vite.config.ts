import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  // For the production build, you will need to set the define options in your config file, letting
  // the bundler do the dead code elimination. 
  // https://vitest.dev/guide/in-source.html
  // NOTE: Why are we duplicating this here and in vitest.config.ts
  define: {
    'import.meta.vitest': 'undefined'
  },
});
