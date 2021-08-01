module.exports = {

    name: 'gend',
    description: 'End giveaways',
    usage: 'gend',
    category: 'giveaway',
    aliases: ['gstop'],
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 5,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const lang = guildData.lang
        const msgId = args[0];
        let giveaway = client.giveawaysManager.giveaways.last();
        if (msgId) {

            giveaway =
                client.giveawaysManager.giveaways.find((g) => g.guildID === message.guild.id && g.prize === args.join(' ')) ||
                client.giveawaysManager.giveaways.find((g) => g.guildID === message.guild.id && g.messageID === args[0]);

        }

        if (!giveaway) return message.channel.send("Je ne trouve pas de giveaway avec cette ID/nom");

        client.giveawaysManager.end(giveaway.messageID)
            .then(() => {
                message.channel.send('Le giveaway a été **__terminé__**')
            })
            .catch((e) => {
                message.channel.send("Ce giveaway est terminé")

            })

    }
};

