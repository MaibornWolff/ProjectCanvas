import { defineConfig } from "vite";
import { restart } from "./vite.main.config";
import path from "path";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [restart()],
  resolve: {
    alias: {
      '@canvas/types': path.resolve(__dirname, './types'),
      '@canvas/electron': path.resolve(__dirname, './electron'),
      '@canvas': path.resolve(__dirname, './src'),
    }
  }
});
