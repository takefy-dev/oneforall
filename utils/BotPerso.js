const { EventEmitter } = require('events');

const botperso = require('../database/botperso');

class Botperso extends EventEmitter{   
    constructor(opts){
        super(opts);
        botperso
            .then((botperso) => this.botperso = botperso)
            .catch((err) => console.log(err));
    } 

}

module.exports = new Botperso();