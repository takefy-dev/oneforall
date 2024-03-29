const {Util} = require('discord.js')


module.exports = {

    name: 'removeemoji',
    description: 'Remove an emoji | Supprimer un emoji',
    usage: 'removeemoji <emoji>',
    category: 'misc',
    aliases: ['remove', 'emojiremove', 'rmemoji'],
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 5,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        const emoji = args[0];
        let custom = Util.parseEmoji(emoji);

        if (!emoji) {
            return message.channel.send(lang.removeemoji.missingUrl);
        }

        if (custom.id) {
            message.guild.emojis.resolve(custom.id).delete(`Remove emoji par ${message.author.username}`).then(() => {
                message.channel.send(lang.removeemoji.success(custom.name))

            }).catch(err => {
                message.channel.send(lang.removeemoji.error(custom.name))
            });

        }

    }
}

