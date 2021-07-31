const Event = require('../../structures/Handler/Event');



module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'ready',
        });
    }
    async run(client){

    }
}