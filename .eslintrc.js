module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "plugin:vue/vue3-recommended",
    "plugin:tailwindcss/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "extraFileExtensions": [".vue"],
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "plugins": [
    "vue",
    "@typescript-eslint",
  ],
  "parser": "vue-eslint-parser",
  "ignorePatterns": ["**/*.json", ".eslintrc.js", "*.config.js"],
  "rules": {
    "semi": [1, "never"],
    "quotes": [1, "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
    "import/order": [1, { "groups": ["builtin", "external", "parent", "sibling", "index"] }],
    "sort-imports": [1, {
      "ignoreCase": false,
      "ignoreDeclarationSort": true,
      "ignoreMemberSort": false,
      "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
      "allowSeparatedGroups": false
    }],
    "tailwindcss/no-custom-classname": "off",
    "vue/attribute-hyphenation": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-setup-props-destructure": "off",
    "@typescript-eslint/no-unused-vars": "off"
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx",],
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        "project": './tsconfig.json',
      }
    }
  }
}
