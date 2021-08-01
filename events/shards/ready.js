
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
        if(client.config.dev) return;
        await client.shardWebhook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569975603200:868814251186348042> Shard \`#${id + 1}\`  prêt \n▬▬▬▬▬▬▬▬`)
    }
}

