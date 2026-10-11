import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset URLs work on both a custom domain and GitHub project pages.
  base: './',
  esbuild: { jsx: 'automatic' },
});
