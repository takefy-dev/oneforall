const StateManager = require('../../utils/StateManager');

// let all = new Map();
const Event = require('../../structures/Handler/Event');
module.exports = class messageReactionAdd extends Event {
    constructor() {
        super({
            name: 'shardReconnecting',
        });
    }

    async run(client, id) {
        console.log(`Shard ${id} is reconnecting`)
        client.oneforallSocket.emit('shard-reconnecting', id);
    }
}

