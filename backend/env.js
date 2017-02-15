'use strict';

// Single place to contain all credentials
module.exports = Object.freeze({
  debug: process.env.NODE_ENV === 'debug' ? true : false,
  production: process.env.NODE_ENV === 'production' ? true : false,
  fb : {
    client_id:process.env.ITERATE_FB_APP_ID,
    client_secret:process.env.ITERATE_FB_APP_SECRET
  },
  yandex : {
    api_key:process.env.ITERATE_YANDEX_TRANSLATOR_API
  }
});
