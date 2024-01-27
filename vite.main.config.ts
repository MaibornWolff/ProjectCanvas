import { defineConfig } from "vite";

// https://github.com/electron/forge/issues/3208#issuecomment-1498476106
export function restart() {
  let config;
  return {
    name: "electron-restart",
    configResolved(_config) {
      config = _config;
    },
    closeBundle() {
      if (config.mode === "production") {
        return;
      }
      process.stdin.emit("data", "rs");
    },
  };
}

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [restart()],
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
});
