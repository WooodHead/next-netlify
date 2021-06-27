module.exports = {
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    // layers: ['base']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        'text': "url('https://assets.tokbox.com/solutions/images/icon-message.png')",
        'screen': "url('https://assets.tokbox.com/solutions/images/icon-screen-share.png')",
        'video': "url('https://assets.tokbox.com/solutions/images/icon-video.png')",
        'noVideo':"url('https://assets.tokbox.com/solutions/images/icon-no-video.png')",
        'audio': "url('https://assets.tokbox.com/solutions/images/icon-audio.png')",
        'noAudio': "url('https://assets.tokbox.com/solutions/images/icon-no-audio.png')",
        'mic': "url('https://assets.tokbox.com/solutions/images/icon-mic.png')",
        'micMuted': "url('https://assets.tokbox.com/solutions/images/icon-muted-mic.png')"
      }),
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
    extend: {
      backgroundImage: ['hover', 'focus']
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
