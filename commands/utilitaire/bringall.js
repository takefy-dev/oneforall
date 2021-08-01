module.exports = {

    name: 'bringall',
    description: "Bring all members from a voicechannel | Apporter tout les gens en vocal",
    category: 'utils',
    usage: 'bringall <channel>',
    aliases: ['voicemove'],
    userPermissions: ['MOVE_MEMBERS'],
    cooldown: 10,

    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang
        const channelInput = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
        if (channelInput.type !== 'voice') return message.channel.send(lang.cleanUp.wrongType).then((mp) => {
            setTimeout(() => {
                mp.delete();
            }, 2000)
        })
        const channels = message.guild.channels.cache.filter(ch => ch.id !== channelInput.id && ch.type === "text" && ch.members.size > 0)
        for await(const [_, channel] of channels)
            for await(const [_, member] of channel.members) {
                await member.voice.setChannel(channelInput, `Bringall by ${message.author.tag}`).catch(() => {
                })
            }

    }
}