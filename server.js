const fs = require('fs');
const path = require('path');
const electron = require('electron-prebuilt');
const proc = require('child_process');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require(path.resolve('./.live-preview/webpack.config'));

// TODO: Make an event emitter
module.exports = function createServer(onMessage) {
  const app = express();
  const expressWs = require('express-ws')(app);
  const compiler = webpack(config);
  const PORT = 8099;
  let wss;

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(webpackHotMiddleware(compiler));

  app.listen(PORT, 'localhost', err => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`Listening at http://localhost:${PORT}`);
  });
  
  app.ws('/socket', function(ws, req) {
    ws.on('message', onMessage);
  });

  //wss = expressWs.getWss('/socket');
}
