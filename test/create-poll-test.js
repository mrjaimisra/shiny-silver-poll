"use strict";
const Poll = require('../public/poll');

const assert = require('assert');

describe('the Poll', function () {
  it('should exist', function () {
    var poll = new Poll();

    assert(poll)
  });

  it('should accept a question', function () {
    var poll = new Poll("DOM");

    assert.equal("DOM", poll.question)
  });

  it('should have a default status of true', function () {
    var poll = new Poll();
    var status = poll.status;

    assert(status)
  });

  it('should have an empty hash of responses', function () {
    var poll = new Poll();
    var responses = poll.responses;

    assert.deepEqual({}, responses);
  });
});
