// const { PHASE_PRODUCTION_BUILD } = require('next/constants')
const withPWA = require('next-pwa')

module.exports = () => {

  // const isProd = phase === PHASE_PRODUCTION_BUILD

  return withPWA({
    pwa: { dest: 'public' },
    // images: {
    //   domains: ["https://d1yh8cksvv9kll.cloudfront.net", "https://d113rofegfcvwz.cloudfront.net",
    //   "https://d31kifv93uudih.cloudfront.net", "https://d3guuahkmft7rx.cloudfront.net"]
    // }
  })
}