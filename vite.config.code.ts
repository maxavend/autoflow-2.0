import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    target: 'es2015',
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, './src/code/code.ts'),
      name: 'code',
      fileName: 'code',
      formats: ['iife'], 
    },
    rollupOptions: { output: { entryFileNames: 'code.js' } }
  },
});
