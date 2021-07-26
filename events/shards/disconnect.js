const StateManager = require('../../utils/StateManager');
const Discord = require('discord.js')

const hook = new Discord.WebhookClient('801060243785383936', 'foWpfz4X8OEwrZ4SQfOR1khPOH0YdF1AsHzjfIqFW_iRpTSqtPfDwFJYUOx91Y4xv5oq');

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
        hook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569560498197:868814521949650984> Shard \`#${id + 1}\`  est déconnecté   \n▬▬▬▬▬▬▬▬ `)
    }
}

