module.exports = {

    name: 'nuke',
    description: "Clear all messages of a channel | Supprimer tout les messages d'un salon",
    usage: 'nuke',
    category: 'moderation',
    aliases: ['renew', 'clearall'],
    userPermissions: ['MANAGE_MESSAGES'],
    clientPermissions: ['MANAGE_CHANNELS'],
    cooldown: 5,


    run: async (client, message, args) => {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const position = message.channel.position;
        const rateLimitPerUser = message.channel.rateLimitPerUser;
        let newChannel = await message.channel.clone()
        await message.channel.delete();
        await newChannel.setPosition(position);
        await newChannel.setRateLimitPerUser(rateLimitPerUser)
        newChannel.send(lang.nuke.success(message.member))


    }
};


