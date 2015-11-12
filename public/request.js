var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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

app.get('/', function (req, res) {
  res.sendfile('./public/index.html');
  console.log("hello world");
});

app.get('/', function (req, res) {
  var question = $('#question');
  var response = $('#response');

  res.send(question, response)
});

app.post('/', function (req, res) {
  var pollQuestion = req.body.pollQuestion;
  var pollResponse = req.body.pollResponse;

  console.log(`Question: ${pollQuestion}`);
  console.log(`Response: ${pollResponse}`)
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});
