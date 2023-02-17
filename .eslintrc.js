module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  env: { node: true, browser: true, es2021: true },
  extends: ["plugin:react/recommended"],
  overrides: [
    {
      extends: [
        "airbnb",
        "airbnb-typescript",
        "plugin:react/jsx-runtime",
        "prettier",
      ],
      files: ["*.ts", "*.tsx"],
      rules: {
        "react/react-in-jsx-scope": "off",
        "no-prototype-builtins": "off",
        "import/prefer-default-export": "off",
        "import/no-default-export": "error",
        "react/destructuring-assignment": "off",
        "react/jsx-props-no-spreading": "off",
        "react/prop-types": "off",
        "react/require-default-props": "off",
        "react/jsx-filename-extension": [1, { extensions: [".tsx", ".ts"] }],
        "no-use-before-define": [
          "error",
          { functions: false, classes: true, variables: true },
        ],
        "@typescript-eslint/no-use-before-define": [
          "error",
          { functions: false, classes: true, variables: true },
        ],
        "import/no-extraneous-dependencies": [
          "off",
          { packageDir: ["project-canvas/electron/main"] },
        ],
        "@typescript-eslint/no-explicit-any": "error",
      },
    },
  ],
  plugins: ["react"],
}
