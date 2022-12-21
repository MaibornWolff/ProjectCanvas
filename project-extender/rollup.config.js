import { babel, getBabelOutputPlugin } from "@rollup/plugin-babel"
import typescript from "@rollup/plugin-typescript"

const config = {
  input: "src/index.ts",
  output: {
    file: "dist/index.cjs",
    format: "cjs",
    plugins: [getBabelOutputPlugin({ presets: ["@babel/preset-env"] })],
  },
  plugins: [typescript(), babel({ babelHelpers: "bundled" })],
}

export default config
