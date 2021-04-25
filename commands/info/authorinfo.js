const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'authorinfo',
            description: 'Information about the author of the bot | Information sur les auteurs du bot',
            category: 'info',
            clientPermissions: ['SEND_MESSAGES'],
            aliases: ['author', 'createur'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor(`${color}`)
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter("Authorinfo", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setDescription(lang.authorinfo.description)
        message.channel.send(embed)
    }
};


