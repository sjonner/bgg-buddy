/* eslint no-console: 0 */
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

app.use(express.static(__dirname + '/dist'));

if (isDeveloping) {
  const compiler = webpack(config);

  app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
}

import levelup from 'levelup';
import bgg from 'bgg';
import ApiCache from 'apicache';

ApiCache.options({ debug: isDeveloping });
let apicache = ApiCache.middleware;

// 1) Create our database, supply location and options.
//    This will create or open the underlying LevelDB store.
var db = levelup('./data/api', { valueEncoding: 'json' });

// GET apicache index (for the curious)
app.get('/api/cache/', function response(req, res, next) {
  res.send(ApiCache.getIndex());
});

// GET apicache index (for the curious)
app.get('/api/cache/clear/:key?', function response(req, res, next) {
  res.send(200, ApiCache.clear(req.params.key || req.query.key));
});

// add `"x-apicache-bypass": true` header to force fresh request.
app.get('/api/:action?', apicache('5 minutes'), function response(req, res, next) {
  const action = (req.params.action || '').trim().toLowerCase();
  const username = (req.query.name || '').trim();
  const term = (req.query.term || '').trim();
  let data;

  switch (action) {
    case 'user':
      if (username.length) {
        data = {name: username};
      }
      break;
    case 'collection':
      if (username.length) {
        data = {username: username};
      }
      break;
    case 'search':
      if (term.length) {
        data = {query: term, type: 'boardgame,boardgameexpansion', exact: 0};
      }
      break;
  }

  const cacheKey = (`${action}:${JSON.stringify(data)}` || '').toLowerCase();

  if (data) {
    req.apicacheGroup = action;


    bgg(action, data).then((result, err) => {
      if (err) {
        if (cacheKey) {
          db.get(cacheKey, function (err, data) {
            // likely the key was not found
            if (err) {
              return console.log('Ooops!', err);
            }
            console.log('loaded from db.');
            res.status(200);
            res.json(data);
          });
        }
        return;
      }

      db.put(cacheKey, result, function (err) {
        if (err) {
          // some kind of I/O error
          return console.log('Ooops!', err);
        }
      });

      console.log('requested from bgg api.');
      res.status(200);
      res.json(result);
    });
  } else {
    res.status(400);
    res.json({});
  }
});

app.get('*', function response(req, res) {
  console.log('*: ' + path.join(__dirname, 'dist/index.html'));
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, 'localhost', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
