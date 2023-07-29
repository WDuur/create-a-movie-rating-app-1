module.exports = {
  root: true, // This indicates that this is the root ESLint configuration file
  env: {
    browser: true, // Specifies that the code will run in a browser environment
    node: true, // Specifies that the code can also run in a Node.js environment
  },
  extends: [
    "eslint:recommended", // Use ESLint's recommended rules
    "plugin:vue/recommended", // Use recommended rules for Vue.js
  ],
  parserOptions: {
    
    ecmaVersion: "latest", // Specifies ECMAScript version 2018 (ES9)
    sourceType: "module", // Allows the use of imports and exports in modules
  },
  rules: {
    // Custom rules or overrides go here
    "no-console": "warn", // Warns when using console.log, console.error, etc.
    "vue/html-closing-bracket-newline": [
      "error",
      {
        // Configures the placement of closing brackets in Vue templates
        singleline: "never",
        multiline: "always",
      },
    ],
    "semi": ["off", "never"],	
  },
};
