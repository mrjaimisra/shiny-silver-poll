//CLIENT

var responses         = $('#response');
var addResponseButton = $('addResponse');

$('#addResponse').on('click', function () {
  $('.responses').append("<div><label for='response'>Response</label> <input id='response' type='text' class='validate' name='pollResponse'></div>");
});

//POLL

function Poll(question) {
  this.question      = question;
  this.responses  = {};
  this.status     = true;
}