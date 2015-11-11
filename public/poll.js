function Poll(title) {
  this.title      = title;
  this.responses  = {};
  this.status     = true;
}

module.exports = Poll;