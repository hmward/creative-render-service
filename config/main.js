const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

/** General Configurations Like PORT, HOST names and etc... */
const config = {
  env,
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8889,
  apiHost: process.env.API_HOST || 'localhost',
  apiPort: process.env.API_PORT || 3030, 
  karmaPort: 9876,

  // This part goes to React-Helmet for Head of our HTML
  app: {
    head: {
      title: 'Homespace',
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Homespace creative render service' },
      ]
    }
  }
};

module.exports = config;
