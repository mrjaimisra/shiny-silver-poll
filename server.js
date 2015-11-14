//SERVER

const http = require('http');
var express = require('express');
var app = express();
const _ = require('lodash');

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 * 'body-parser' must be installed (via `npm install --save body-parser`)
 * For more info see: https://github.com/expressjs/body-parser
 */

var bodyParser = require('body-parser');

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser());

app.use(express.static('public'));

app.route('/')
   .get(function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
   })
   .post(function (req, res) {
    console.log(req.body.pollQuestion);
    console.log(req.body.pollResponse);
   });

const port = process.env.PORT || 3000;

const server = http.createServer(app)
  .listen(port, function () {
    console.log('Listening on port ' + port + '.');
  });
