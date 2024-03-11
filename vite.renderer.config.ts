import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import renderer from "vite-plugin-electron-renderer";
import path from "path";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), renderer()],
  resolve: {
    alias: {
      '@canvas/types': path.resolve(__dirname, './types'),
      '@canvas/electron': path.resolve(__dirname, './electron'),
      '@canvas': path.resolve(__dirname, './src'),
    }
  }
});
