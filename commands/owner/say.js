module.exports = {
    name: 'say',
    description: 'The bot can say your message | Le bot dit votre message',
    usage: 'say <message>',
    category: 'owners',
    userPermissions: ['ADMINISTRATOR'],
    cooldown: 6,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const toSay = args.slice(0).join(' ')
        await message.delete()
        if (toSay.length < 1) return message.channel.send(lang.say.cantSendEmptyMsg).then(mp => mp.delete({timeout: 4000}))
        message.channel.send(toSay)
    }
}
