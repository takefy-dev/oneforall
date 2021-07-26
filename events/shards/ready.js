const StateManager = require('../../utils/StateManager');
const Discord = require('discord.js')
const hook = new Discord.WebhookClient('801060243785383936', 'foWpfz4X8OEwrZ4SQfOR1khPOH0YdF1AsHzjfIqFW_iRpTSqtPfDwFJYUOx91Y4xv5oq');

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
        hook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569975603200:868814251186348042> Shard \`#${id+ 1}\`  prêt \n▬▬▬▬▬▬▬▬`)
    }
}

