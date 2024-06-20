import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { 
    globals: 
    {
      ...globals.browser,
      ...globals.node,
      ...globals.es2020,
      "Phaser": "readonly",
    }
  }},
  pluginJs.configs.recommended,
  {
    rules: {
      "no-console": "off",
      "quotes": 0,
      "prefer-const": 'off',
      "prefer-destructuring": 'off',
      "no-multiple-empty-lines": 'off',
      "no-useless-concat": 'off',
      "import/no-unresolved": 'off',
      "import/no-extraneous-dependencies": 'off',
      "import/extensions": 'off',
      "import/newline-after-import": 'off',
      "prefer-arrow-callback": 'off',
      "no-var": 'off',
      "vars-on-top": 'off',
      "quote-props": 'off',
      "no-use-before-define": 'off',
      "prefer-template": 'off',
      "no-param-reassign": 'off',
      "spaced-comment": 'off',
      "no-lone-blocks": 'off',
    }
  }
];


