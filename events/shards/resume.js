

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
        if(client.config.dev || client.config.botperso) return
        await client.shardWebhook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569975603200:868814251186348042> Shard \`#${id + 1}\`  prêt \n▬▬▬▬▬▬▬▬`)
    }
}

