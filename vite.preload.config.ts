import { defineConfig } from "vite"
import { restart } from "./vite.main.config"

// eslint-disable-next-line import/no-default-export
export default defineConfig({ plugins: [restart()] })
