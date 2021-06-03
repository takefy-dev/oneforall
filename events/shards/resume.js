const StateManager = require('../../utils/StateManager');

// let all = new Map();
const Event = require('../../structures/Handler/Event');
module.exports = class messageReactionAdd extends Event {
    constructor() {
        super({
            name: 'shardResume',
        });
    }

    async run(client, id, event) {
        console.log(`Shard ${id} is resumed ${event}`)
        client.oneforallSocket.emit('shard-resume', id);
    }
}

