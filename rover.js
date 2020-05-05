class Rover {
  constructor(position) {
    this.position = position,
    this.mode = 'NORMAL',
    this.generatorWatts = 110;
  }

  receiveMessage(_message) {
    let obj = {}
    obj.message = _message.name;
    obj.results = [];
    let responseTrue = {completed: true};
    let responseFalse = {completed: false};
    for (let i = 0; i < _message.commands.length; i++) {

      if (_message.commands[i].commandType === 'MODE_CHANGE') {
        obj.results.push(responseTrue);
        this.mode = _message.commands[i].value;
      } else if (_message.commands[i].commandType === 'STATUS_CHECK') {
        obj.results.push(responseTrue);
        let _roverStatus = {mode: this.mode, generatorWatts: this.generatorWatts, position: this.position};
        obj.results[i].roverStatus = _roverStatus;
      } else if (_message.commands[i].commandType === 'MOVE') {
        if (this.mode === 'LOW_POWER') {
          obj.results.push(responseFalse);
        } else if (this.mode === 'NORMAL') {
          obj.results.push(responseTrue);
          this.position = _message.commands[i].value;
        }
      } else {
          obj.results.push({completed: false, error: 'unknown command'});
      }
    }
    return obj
  }

}

module.exports = Rover;