//CREATE POLL

var newResponseField =

  "<div id='responseField'>" +
  "<label for='response'>Response</label>" +
  "<input id='response' type='text' class='validate' name='pollResponse'>" +
  "</div>";

$('#addResponse').on('click', function () {
  $('.responses').append(newResponseField);
});

$('#removeResponse').on('click', function () {
  $('.responses').children().last().remove();
});

//POLL

function Poll(question) {
  this.question      = question;
  this.responses  = {};
  this.status     = true;
}