module.exports = {
  "extends": [
    "airbnb",
    "prettier"
  ],
  "parser": "babel-eslint",
  "plugins": [
    "jest",
    "prettier",
    "import"
  ],
  "rules": {
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [
          "**/__tests__/**/*.js",
        ]
      }
    ],
    "import/no-unresolved": [
      "off"
    ],
    "import/prefer-default-export": "off",
    "import/extensions": [
      "error",
      "never",
      {
        "json": "always"
      }
    ],
    "no-labels": "off",
    "no-restricted-syntax": "off",
    "no-underscore-dangle": "off",
    "no-use-before-define": "off",
    "arrow-body-style": "off",
    "spaced-comment": "off",
    "no-await-in-loop": "off",
    "no-mixed-operators": "off",
    "no-plusplus": "off",
    "react/sort-comp": "off",
    "react/jsx-filename-extension": "off",
    "react/require-default-props": "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error",
    "react/jsx-indent": "off",
    "arrow-parens": "off",
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-closing-tag-location": "off",
    "react/jsx-curly-spacing": "off",
    "react/jsx-equals-spacing": "off",
    "react/jsx-first-prop-new-line": "off",
    "react/jsx-indent-props": "off",
    "react/jsx-max-props-per-line": "off",
    "react/jsx-tag-spacing": "off",
    "react/jsx-wrap-multilines": "off",
    "react/prefer-stateless-function": "off"
  },
  "env": {
    "browser": true
  },
  "overrides": [
    {
      "files": [
        "**/__tests__/**/*.js",
        "**/*.test.js"
      ],
      "globals": {
        "when": true
      },
      "env": {
        "jest": true
      },
      "rules": {
        "react/no-multi-comp": "off",
        "react/prop-types": "off"
      }
    }
  ]
};
