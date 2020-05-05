const assert = require('assert');
const Message = require('../message.js');
const Command = require('../command.js');

describe("Message class", function() {

  it("throws error if a name is NOT passed into the constructor as the first parameter", function() {
    assert.throws(
      function() {
        new Message();
      },
      {
        message: 'Name required.'
      }
    );
  });

  it("constructor sets name", function() {
    let test = new Message('name');
    assert.strictEqual(test.name, 'name');
  });

  it("contains a commands array passed into the constructor as 2nd argument", function() {
    let commandsArray = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let messageObj = new Message ('name of message', commandsArray);
    assert.strictEqual(typeof messageObj.commands, 'object');
  });

  
});