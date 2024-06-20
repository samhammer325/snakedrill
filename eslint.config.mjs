
import globals from "globals";
// ran npm init @eslint/config

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
    {files: ["**/*.js"], languageOptions: {sourceType: "module"}},
  {languageOptions: { 
    globals: globals.browser,
    "Phaser": "readonly",
  }},
  ...compat.extends("airbnb-base"),
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
      "max-len": ["error", { "comments": 350, "code": 180 }],
    }
  }


];

