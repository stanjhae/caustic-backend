const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const cors = require('cors');
const compression = require('compression');

require('dotenv').config();

mongoose.Promise = global.Promise = bluebird;

const app = express();
const server = require('http').Server(app);
const io = require('./utils/socket');

const uri = process.env.DB_URL;

io.initSocket(server);
io.initNamespace();

const config = require('./config');
const routes = require('./routes/');

const router = express.Router();

routes(router);

mongoose.connect(uri, { useNewUrlParser: true });

app.use(compression({ level: 6 })); // Default compression level is 6

app.use(logger('dev'));
app.use(bodyParser.json({ limit: config.MAX_PAYLOAD }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', router);

// start https or http server
startServer();

/**
 * Starts a development or production
 * server with http or https.
 */
function startServer() {
  const { PORT } = config;
  let server;

  if (process.env.NODE_ENV === 'production') {
    server = prodServer(PORT);
  } else {
    server = devServer(PORT);
  }

  server.on('close', async (err) => {
    if (err) throw err;

    console.log('\nClosing db connections...\n');
    try {
      await mongoose.disconnect();
    } catch (e) {
      console.error(e.message);
    }
    console.log('Server Out!! *drops mic*');
  });

  process.on('SIGINT', () => server.close());

  console.log(`Running on port: ${PORT}`);
}

/**
 * Starts an https server at
 * the given port
 *
 * @param port - port number
 * @return {Server}
 */
function prodServer(port) {
  const https = require('https');

  const options = {
    key: config.KEY,
    cert: config.CERT,
  };

  return https.createServer(options, app).listen(port);
}

/**
 * Starts an http or, if the env vars
 * are present, https server at the
 * given port.
 *
 * @param port - port number
 * @return {*}
 */
function devServer(port) {
  if (config.CERT && config.KEY) {
    return prodServer(port);
  }

  return server.listen(port);
}
