import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import renderer from "vite-plugin-electron-renderer";
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), renderer()],
});
