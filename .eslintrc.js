module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  extends: [
    "airbnb-base",
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  // required to lint *.vue files
  plugins: ["babel", "html", "promise", "vue", "prettier"],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // add your custom rules here
  rules: {
    "no-console": 0,
    "import/no-unresolved": 0,
    "prettier/prettier": "error",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0
  }
};
