const Event = require('../../structures/Handler/Event');

module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'message',
        });
    }

    async run(client, message) {
        if(!message.guild || message.author.bot) return
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const xp = guildData.get('xp');
        if(!xp.enable) return;
        let {xpPerMsg} = xp
        if(typeof xpPerMsg === 'string') xpPerMsg = client.functions.getRandomInt(parseInt(xpPerMsg.split('-')[0]), parseInt(xpPerMsg.split('-')[1]))
        await client.levels.appendXp(message.author.id, message.guild.id, xpPerMsg)

    }
}