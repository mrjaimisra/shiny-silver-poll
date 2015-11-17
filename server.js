//SERVER

const http = require('http');
var express = require('express');
var app = express();
const _ = require('lodash');
const crypto = require('crypto');
const ejs = require('ejs');

//SERVER CONFIG STUFF

const port = process.env.PORT || 3000;
app.locals.title = 'Shiny Silver Poll';
app.locals.polls = {};

const server = http.createServer(app)
  .listen(port, function () {
    console.log('Listening on port ' + port + '.');
  });

var bodyParser = require('body-parser');

app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

//CREATE POLL FORM

const polls = {};
const pollForm = `

<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/css/materialize.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/js/materialize.min.js"></script>
  </head>
  <body>
  <div class="container">
    <h1>Question: <%= poll.pollQuestion %> </h1>
      <h2>Choose one of the following: </h2>

      <form action="/polls/<%= poll.id %>" method="post">
      <% if ( poll.pollResponse.constructor === Array ) {
        for (var i = 0; i < poll.pollResponse.length;  i++) { %>

        <input type='radio'
          value='<%= poll.pollResponse[i] %>'
          name='responses'
          class='responseChoices'
          id='response <%= i %>'>
        <label for='response <% i %>'>
          <%= poll.pollResponse[i] %>
        </label>
        <br>
        <% }
      } else { %>
        <input type='radio'
          value='<%= poll.pollResponse %>'
          name='responses'
          class='responseChoices'
          id="response">
        <label for='response'>
          <%= poll.pollResponse %>
        </label>
      <% } %>
        <br>
        <button type='' class='submit'>Submit</button>
      </form>
      <h3>Results:</h3>
      <div id="voteCount"></div>
    </div>
  </body>
  <script src='/socket.io/socket.io.js'></script>
  <script src='/responder.js'></script>
</html>`;

app.route('/')
  .get(function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
  })

  .post(function (req, res) {
    var poll = req.body;
    var id = crypto.randomBytes(20).toString('hex');

    app.locals.polls[id] = req.body;

    poll.id = id;
    poll.active = true;

    poll.adminId = crypto.randomBytes(20).toString('hex');
    poll.adminUrl = '/admin/' + id;

    polls[id] = poll;
    res.send(ejs.render(`<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/css/materialize.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/js/materialize.min.js"></script>
  </head>
    <body>
    <h3 id="pollId">Poll ID: <%= poll.id %></h3>

                         <a href='/polls/<%= id %>'>Vote Link</a>
                         <a href='<%= poll.adminUrl %>'>Admin Link</a>

                         <div class="voteCount"></div>

    </body>
  <script src='/socket.io/socket.io.js'></script>
  <script src='/responder.js'></script>
</html>`, {poll: poll, id: id})
    );
  });

app.route('/polls/:id')
  .get(function (req, res) {
    const poll = polls[req.params.id];

    res.send(ejs.render
      (pollForm, {poll: poll, polls: polls})
    );
  })

  .post(function (req, res) {
    const poll = polls[req.params.id]
  });

app.route('/admin/:id')
  .get(function (req, res) {
    const poll = polls[req.params.id];

    res.send(ejs.render
      (`<html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/css/materialize.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/js/materialize.min.js"></script>
      </head>
      <body>

      <h1>Question: <%= poll.pollQuestion %> </h1>
      <h2>Results:</h2>

      <div id="voteCount">
      </div>

      <form action="/admin/<%= poll.id %>" method="post">
        <button type='' class='submit'>Close Poll</button>
      </form>

      </body>
        <script src='/socket.io/socket.io.js'></script>
        <script src='/responder.js'></script>
      </html>`, {poll: poll, polls: polls})
    );
  })

  .post(function (req, res) {
    const poll = polls[req.params.id];

    poll.active = false;
    console.log(poll)
  })

  .patch(function (req, res) {
    const poll = polls[req.params.id];
  });

//WEB SOCKETS

const socketIo = require('socket.io');
const io = socketIo(server);

const totalVotes = {};

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);
  var chunkedUrl = socket.handshake.headers.referer.split('/');
  var id = chunkedUrl[chunkedUrl.length - 1];
  var poll = polls[id];

  if (id !== '' && poll && !poll.votes) {
    poll.votes = {};

    if (poll.pollResponse.constructor === Array) {
      var responses = poll.pollResponse;

      responses.forEach(function (response) {
        poll.votes[response] = 0
      });

    } else {
      poll.votes[(poll.pollResponse)] = 0
    }

    socket.emit('voteCount', poll.votes);
  }
  //io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    var poll = polls[id];

    if (channel === 'voteCast' && poll.active) {

      if (!poll.votes) {
        poll.votes = {}
      }
      if (poll.votes[message]) {
        poll.votes[message] += 1;
      } else {
        poll.votes[message] = 1;
      }
      if (totalVotes[socket.id]) {
        poll.votes[(totalVotes[socket.id])] -= 1;
        delete totalVotes[socket.id];
      }
      totalVotes[socket.id] = message;
      socket.emit('voteCount', poll.votes);
    } else {

    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

module.exports = app;
//module.exports = server;
