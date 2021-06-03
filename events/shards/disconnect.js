const StateManager = require('../../utils/StateManager');

// let all = new Map();
const Event = require('../../structures/Handler/Event');
module.exports = class messageReactionAdd extends Event {
    constructor() {
        super({
            name: 'shardDisconnect',
        });
    }

    async run(client, event, id) {
        console.log(`Shard ${id} is disconnect with ${event}`)
        client.oneforallSocket.emit('shard-disconnect', id);
    }
}

