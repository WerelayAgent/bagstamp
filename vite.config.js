import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        communities: resolve(__dirname, 'communities.html'),
        proposals: resolve(__dirname, 'proposals.html'),
      },
    },
  },
});
