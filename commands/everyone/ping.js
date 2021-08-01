module.exports = {

    name: 'ping',
    description: 'Get the latency and ping of the bot',
    usage: 'ping',
    clientPermissions: ['SEND_MESSAGES'],
    category: 'everyone',
    cooldown: 5,


    run: async (client, message, args) => {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        message.channel.send(lang.ping.pinging).then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp; //calculate the ping of the bot
            m.edit(lang.ping.success(ping, client));
        })
    }
};

