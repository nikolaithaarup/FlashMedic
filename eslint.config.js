// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,

  {
    ignores: ["dist/*"],

    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
]);
