//SERVER

const http = require('http');
var express = require('express');
var app = express();
const _ = require('lodash');
const crypto = require('crypto');
const ejs = require('ejs');

//ejs.delimiter = '%';

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
app.use(bodyParser.urlencoded({extended: true}));

const path = require('path');

app.use(express.static('public'));

const polls = {};
const pollForm = `

<html>
  <body>
    <h1>Question: <%= poll.pollQuestion %> </h1>
      <h2>Choose one of the following: </h2>

      <form action="/polls/<%= poll.id %>" method="post">
      <% if ( poll.pollResponse.constructor === Array ) {
        for (var i = 0; i < poll.pollResponse.length;  i++) { %>

        <input type='radio'
          value='<%= poll.pollResponse[i] %>'
          name='responses'>
          <%= poll.pollResponse[i] %>
        <br>
        <% }
      } else { %>
        <input type='radio' value='<%= poll.pollResponse %>'>
          <%= poll.pollResponse %>
      <% } %>
        <br>
        <button type='' class='submit'>Submit</button>
      </form>
  </body>
</html>`;

app.route('/polls/:id')
  .get(function (req, res) {
    const poll = polls[req.params.id];

    res.send(ejs.render
      (pollForm, {poll: poll, polls: polls})
    );
  })

  .post(function (req, res) {
    const poll = polls[req.params.id];

    res.send('<h1>request submitted!</h1>' +
             '<h2>use the form below to change your response</h2>' +
              ejs.render(pollForm, {poll: poll, polls: polls} ));

    console.log(polls);
  });

app.route('/')
  .get(function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
  })

  .post(function (req, res) {
    var poll = req.body;
    var id = crypto.randomBytes(20).toString('hex');

    poll.id = id;
    poll.voterId = crypto.randomBytes(20).toString('hex');
    poll.voterUrl = '/vote/' + poll.voterId;

    polls[id] = poll;
    res.redirect('/polls/' + id);
  });

//SERVER CONFIG STUFF

const port = process.env.PORT || 3000;

const server = http.createServer(app)
  .listen(port, function () {
    console.log('Listening on port ' + port + '.');
  });
