module.exports = {
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    // layers: ['base']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        screen: '88vw'
      },
      typography: {
        DEFAULT: {
          css: {
            // color: '#432342',
            maxWidth: '85ch',
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
