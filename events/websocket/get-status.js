const StateManager = require('../../utils/StateManager');

// let all = new Map();
const Event = require('../../structures/Handler/Event');
module.exports = class connect extends Event {
    constructor() {
        super({
            name: 'get-status',
        });
    }

    async run(websocket, client, cb) {
        console.log("getting status in bot")
        const upTime = client.uptime
        const apiLatency = Math.round(client.ws.ping)
        const guilds = []
        client.guilds.cache.forEach(g => guilds.push(g.id))
        const unavailableGuilds = client.unavailableGuilds;
        cb(upTime, apiLatency, parseInt(client.shard.ids.toString()) + 1, guilds, unavailableGuilds);
    }
}
