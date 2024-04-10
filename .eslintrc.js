module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: '@antfu/eslint-config',
  rules: {
    'curly': ['error', 'all'],
    'max-statements-per-line': ['error', { max: 1 }],
  },
  overrides: [],
}
