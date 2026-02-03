import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: path.resolve(__dirname, './src/ui'),
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: '../../dist',
    emptyOutDir: false,
    rollupOptions: { input: { ui: path.resolve(__dirname, './src/ui/index.html') } },
  },
});
