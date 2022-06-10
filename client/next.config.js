require('dotenv').config()
module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  },
  env: {
    'STRIPE_PUBLISHABLE_KEY': process.env.STRIPE_PUBLISHABLE_KEY,
    'TICKETING_SERVICE': process.env.TICKETING_SERVICE,
  }
};
