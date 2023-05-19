// prettier.config.js
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/blob/main/README.md#sorting-classes-in-function-calls
  // In addition to sorting classes in attributes, you can also sort classes in strings provided to function calls. This is useful when working with libraries like clsx or cva.
  // You can sort classes in function calls using the tailwindFunctions option, which takes a list of function names:
  // With this configuration, any classes in clsx() function calls will be sorted:
  tailwindFunctions: ['cn', 'clsx'],

  // @source https://github.com/tailwindlabs/tailwindcss.com/blob/master/prettier.config.js
  semi: false,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'es5',
  arrowParens: 'always',
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,
}
