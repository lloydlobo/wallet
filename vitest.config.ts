/// <reference types="vitest" />
/// <reference types="vite/client" />
// 👆 do not forget to add the references above 
// https://docs.solidjs.com/guides/how-to-guides/testing-in-solid/vitest#configuring-vitest
// If you do not add them, you will get a type error when you try to run your tests.
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: { web: [/\.[jt]sx?$/] },
  }
});
