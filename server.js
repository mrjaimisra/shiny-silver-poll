//SERVER

const http = require('http');
var express = require('express');
var app = express();

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

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
  .listen(port, function () {
    console.log('Listening on port ' + port + '.');
  });

app.get('/', function (req, res) {
  var question = $('#question');
  var response = $('#response');

  res.send(question, response)
});

app.post('/', function (req, res) {
  var pollQuestion = req.body.pollQuestion;
  var pollResponse = req.body.pollResponse;

  //console.log(`Question: ${pollQuestion}`);
  //console.log(`Response: ${pollResponse}`)
});
