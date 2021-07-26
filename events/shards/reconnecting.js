const Discord = require('discord.js')

const hook = new Discord.WebhookClient('801060243785383936', 'foWpfz4X8OEwrZ4SQfOR1khPOH0YdF1AsHzjfIqFW_iRpTSqtPfDwFJYUOx91Y4xv5oq');

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
        hook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569862357002:868813759110590544> Shard \`#${id + 1}\` se reconnecte  \n▬▬▬▬▬▬▬▬  `)

    }
}

