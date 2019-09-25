const dbString = 'mongodb://localhost:27017';
const DB = process.env.DB || 'panther-dev';
const { M_USER, M_PASS } = process.env;
const { CERT, KEY } = process.env;
const { SECRET } = process.env;

exports.PORT = process.env.PORT;
exports.SECRET = 'sparta-secret';
exports.DB_URL = `${dbString}/${DB}`;
exports.MONGO_ERR = 'MongoError';
exports.DUP_ERR = 11000;
exports.AUTH_TOKEN = 'x-auth-token';
exports.DEFAULT_ERR_MSG = 'OOPS! Sumfin goofed!!';
exports.AUTH_ERR_MSG = 'Authentication Failed!';
exports.MAX_PAYLOAD = '50mb';

// check for env vars when running in node (i.e not in browser)
if (!global.window) {
  /**
   * Output possible env errors to
   * the console
   */
  function envErr() {
    if (process.env.NODE_ENV === 'production') {
      let message = 'Error: Set env var(s)';

      for (const arg of arguments) {
        message += ` '${arg}'`;
      }
      process.exit(1);
    }
  }

  // TLS credentials
  if (CERT && KEY) {
    const fs = require('fs');

    exports.CERT = fs.readFileSync(CERT);
    exports.KEY = fs.readFileSync(KEY);
  } else {
    envErr('CERT', 'KEY');
  }

  // mongodb credentials
  if (M_USER && M_PASS) {
    exports.DB_OPTIONS = {
      auth: { authdb: DB },
      user: M_USER,
      pass: M_PASS,
    };
  } else {
    envErr('M_USER', 'M_PASS');
  }

  // jwt secret
  if (SECRET) {
    exports.SECRET = SECRET;
  } else {
    envErr('SECRET');
  }
}
