module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['keyframes', 'media']
      }
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes']
      }
    ]
  }
};
