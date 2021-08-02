module.exports = {

    name: 'cleanup',
    description: "Kick all of from a voicechannel | Exclure tout les membre d'un channel vocal",
    category: 'utils',
    usage: 'cleanup <channel>',
    userPermissions: ['MOVE_MEMBERS'],
    cooldown: 60,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
        if (channel.type !== 'GUILD_VOICE') return message.channel.send(lang.cleanUp.wrongType).then((mp) => {
            setTimeout(() => {
                mp.delete();
            }, 2000)
        })
        for await(const [_, member] of channel.members) {
            await member.voice.kick(`Cleanup par ${message.author.tag || message.author.username}`)
        }
        message.channel.send(lang.cleanUp.success(channel))

    }
}