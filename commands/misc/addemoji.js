const {Util} = require('discord.js')

module.exports = {
    name: 'addemoji',
    description: 'Add a emoji | Ajouter un emoji',
    usage: 'addemoji <emoji> <name>',
    category: 'misc',
    aliases: ['create', 'emojicreate'],
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    cooldown: 5,

    run: async (client, message, args) => {


        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        const emoji = args[0];
        let custom = Util.parseEmoji(emoji);

        if (!emoji) {
            return message.channel.send(lang.addemoji.missingUrl);
        }
        let name = args[1] ? args[1].replace(/[^a-z0-9]/gi, "") : null;
        if (!custom.id && !name) {
            return message.channel.send(lang.addemoji.missingName);
        }
        if (name && (name.length < 2 || name > 32)) {
            return message.channel.send(lang.addemoji.invalidName);
        }
        if (!name) name = custom.id

        let link = args[0]
        if (custom.id) {
            link = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`


        }
        message.guild.emojis.create(link, name, {reason: `emoji add par ${message.author.username}`}).then(() => {
            message.channel.send(lang.addemoji.success(name))
            client.Logger.log(`${client.Logger.setColor('teal')}${message.author.tag} a ajouté un emoji`, 'Success add emoji')
        })
    }
}

