const { EventEmitter } = require('events');



class StateManager extends EventEmitter{   
    constructor(opts){
        super(opts);

    } 

}

module.exports = new StateManager();