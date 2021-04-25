
const {Util} = require('discord.js')
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'addemoji',
            description: 'Add a emoji | Ajouter un emoji',
            usage: 'addemoji <emoji> <name>',
            category: 'misc',
            aliases: ['create', 'emojicreate'],
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            cooldown: 5

        });
    }

    async run(client, message, args) {


        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const emoji = args[0];
        let custom = Util.parseEmoji(emoji);


        if (!emoji) {
            return message.channel.send(lang.addemoji.missingUrl);
        }

        const name = args[1] ? args[1].replace(/[^a-z0-9]/gi, "") : null;
        if (!name) {
            return message.channel.send(lang.addemoji.missingName);
        }
        if (name.length < 2 || name > 32) {
            return message.channel.send(lang.addemoji.invalidName);
        }
        if (custom.id) {
            let link = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`
            message.guild.emojis.create(link, name, {reason: `emoji add par ${message.author.username}`}).then(() => {
                message.channel.send(lang.addemoji.success(name))
                Logger.log(`${Logger.setColor('teal')}${message.author.tag} a ajouté un emoji`, 'Success add emoji')
            })

        }

    }
}

