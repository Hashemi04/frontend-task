// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import prettier from "eslint-config-prettier";

export default withNuxt(
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/html-self-closing": "off",
      "vue/require-default-prop": "off",
      "vue/attributes-order": "off",
    },
  },
  prettier,
);
