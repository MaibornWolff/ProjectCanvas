module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  env: { node: true, browser: true, es2021: true },
  extends: ["plugin:react/recommended"],
  overrides: [
    {
      extends: [
        "eslint:recommended",
        "airbnb",
        "airbnb-typescript",
        "plugin:react/jsx-runtime",
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
        "@typescript-eslint/member-delimiter-style": ["error", {
          "multiline": {
            "delimiter": "comma",
            "requireLast": true
          },
          "singleline": {
            "delimiter": "comma",
            "requireLast": false
          },
        }],
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/quotes": "off",
        "object-curly-newline": ["error", { multiline: true, consistent: true }],
        'import-newlines/enforce': ['error', { items: 40, 'max-len': 120 }],
        quotes: ["error", "double"],
        "max-len": "off",
      },
    },
  ],
  plugins: ["react", "@typescript-eslint", "testing-library", "import-newlines"],
};
