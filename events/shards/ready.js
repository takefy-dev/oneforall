const StateManager = require('../../utils/StateManager');

// let all = new Map();
const Event = require('../../structures/Handler/Event');
module.exports = class messageReactionAdd extends Event {
    constructor() {
        super({
            name: 'shardReady',
        });
    }

    async run(client, id, unavailableGuilds) {
        console.log(`Shard ${id} is ready with ${unavailableGuilds}`)
        // client.oneforallSocket.emit('send-commands', client.commands.filter(cm => cm.category !== "botOwner" && cm.category !== "test" && cm.category !== "botperso"))
        if(!unavailableGuilds) return;
        client.unavailableGuilds = unavailableGuilds;
    }
}

