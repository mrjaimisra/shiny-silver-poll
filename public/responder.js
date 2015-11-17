// WEB SOCKETS

const socket = io();

socket.on('connect', function () {
});

var submitButton = $('.submit');

submitButton.on('click', function () {
  var response = $('.responseChoices:checked').val();
  socket.send('voteCast', response);
});

socket.on('voteCount', function (votes) {
  Object.keys(votes).forEach(function (key) {
    if ($('#' + key).length) {
      $('#' + key).text(`${key}: ${votes[key]}`);
    } else
      $('#voteCount').append(`<div id="${key}">${key}: ${votes[key]}</div>`)
  });

  var path = window.location.pathname;
  $.ajax({
    url: '/admin/' + path,
    method: 'PATCH',
    success: function () {
      Object.keys(votes).forEach(function (key) {
        if ($('#' + key).length) {
          $('#' + key).text(`${key}: ${votes[key]}`);
        } else
          $('#voteCount').append(`<div id="${key}">${key}: ${votes[key]}</div>`)
      });
    }
  });
});

function countVotes(votes) {
  var count = 0;
  for (key in votes) {
    count += votes[key];
  }
  return votes;
}