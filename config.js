'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
    //   process.env.DATABASE_URL || 'mongodb://localhost/library-app',
    process.env.DATABASE_URL || 'mongodb://dev:password1@ds215172.mlab.com:15172/library-app',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || 'mongodb://localhost/thinkful-backend-test'
};
