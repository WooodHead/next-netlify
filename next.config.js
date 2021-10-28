// const { PHASE_PRODUCTION_BUILD } = require('next/constants')
const withPWA = require('next-pwa')

module.exports = () => {

  // const isProd = phase === PHASE_PRODUCTION_BUILD

  return withPWA({
    pwa: { dest: 'public' },
    // images: {
    //   domains: ['*']
    // }
  })
}