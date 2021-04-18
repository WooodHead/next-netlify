module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            // color: '#432342',
            maxWidth: '100ch',
            // a: {
            //   color: '#3182ce',
            //   '&:hover': {
            //     color: '#2c5282',
            //   },
            // },
          },
        },
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
