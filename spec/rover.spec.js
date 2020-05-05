const assert = require('assert');
const Rover = require('../rover.js');
const Command = require('../command.js');
const Message = require('../message.js');

describe("Rover class", function() {

  it("constructor sets position and default values for mode and generatorWatts", function () {
    let rover = new Rover(98382);
    assert.strictEqual(rover.position, 98382);
    assert.strictEqual(rover.mode, 'NORMAL');
    assert.strictEqual(rover.generatorWatts, 110);
  });

  it("response returned by receiveMessage contains name of message", function() {
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.message, 'Test message with two commands');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results.length, 2);
  });

  it("responds correctly to status check command", function() {
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results[1].roverStatus.mode, 'LOW_POWER');
    assert.strictEqual(response.results[1].roverStatus.generatorWatts, 110);
    assert.strictEqual(response.results[1].roverStatus.position, 98382);
  });

  it("responds correctly to mode change command", function() {
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message for mode change', commands);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results[0].completed, true);
    assert.strictEqual(response.results[1].roverStatus.mode, 'LOW_POWER');
  });
  
  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let rover = new Rover(123);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 2)];
    let message = new Message('Test message for mode move in LOW_POWER', commands);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results[1].completed, false);
    assert.strictEqual(rover.position, 123);
  });

  it("responds with position for move command", function() {
    let rover = new Rover(123);
    let commands = [new Command('MODE_CHANGE', 'NORMAL'), new Command('MOVE', 2)];
    let message = new Message('Test message for mode move in NORMAL', commands);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results[1].completed, true);
    assert.strictEqual(rover.position, 2);
  });

  it("completed false and a message for an unknown command", function() {
    let rover = new Rover(123);
    let commands = [new Command('BadCommand', 'NORMAL'), new Command('BadCommand2', 2)];
    let message = new Message('Test message for unknown command', commands);
    let response = rover.receiveMessage(message);
    assert.strictEqual(response.results[0].completed, false);
    assert.strictEqual(response.results[1].completed, false);
    assert.strictEqual(response.results[0].error, 'unknown command');
    assert.strictEqual(response.results[1].error, 'unknown command');
  })

})