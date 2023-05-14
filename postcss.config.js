module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    // ^^ nesting: add it to your PostCSS configuration, somewhere before Tailwind
    //    https://tailwindcss.com/docs/using-with-preprocessors#nesting
    tailwindcss: {},
    autoprefixer: {},
  },
}
