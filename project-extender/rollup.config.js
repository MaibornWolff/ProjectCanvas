import { babel, getBabelOutputPlugin } from "@rollup/plugin-babel"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import del from "rollup-plugin-delete"

const config = [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
      plugins: [getBabelOutputPlugin({ presets: ["@babel/preset-env"] })],
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.json",
        declaration: true,
        declarationDir: "dts",
      }),
      babel({ babelHelpers: "bundled" }),
      nodeResolve(),
    ],
  },
  {
    input: "dist/dts/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts(), del({ hook: "buildEnd", targets: "dist/dts" })],
  },
]

export default config
