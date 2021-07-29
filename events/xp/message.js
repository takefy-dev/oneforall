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
        let {xpPerMsg, allowChannels, forbidChannels, multiplerChannels, enable} = xp
        if(!enable) return;
        const boost = multiplerChannels.find(boost => boost.channel === message.channel.id)
        if(!allowChannels.includes('all') && !allowChannels.includes(message.channel.id) || forbidChannels.includes(message.channel.id)) return
        if(typeof xpPerMsg === 'string') xpPerMsg = client.functions.getRandomInt(parseInt(xpPerMsg.split('-')[0]), parseInt(xpPerMsg.split('-')[1]))
        let xpGain = xpPerMsg
        if(boost)
            xpGain += boost.boost
        await client.levels.appendXp(message.author.id, message.guild.id, xpGain)
    }
}