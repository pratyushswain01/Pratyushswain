import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use path.resolve for a robust, cross-platform path
      '@': path.resolve(__dirname, './src'),
    },
  },
  // If you are hosting in a subfolder like /task-app/, 
  // you MUST add this base property:
  base: '/task-app/',
});
