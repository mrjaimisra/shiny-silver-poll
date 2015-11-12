function Poll(question) {
  this.question      = question;
  this.responses  = {};
  this.status     = true;
}

console.log("help");

module.exports = Poll;