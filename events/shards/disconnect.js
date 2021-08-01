


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
        await client.shardWebhook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569560498197:868814521949650984> Shard \`#${id + 1}\`  est déconnecté   \n▬▬▬▬▬▬▬▬ `)
    }
}

