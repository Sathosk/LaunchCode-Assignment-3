class Message {
  constructor(_name, _commands) {
    this.name = _name;
    if (!_name) {
      throw Error("Name required.");
    }
    this.commands = _commands;
  }

}

module.exports = Message;