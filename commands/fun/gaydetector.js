const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'gaydetector',
            description: 'A command for look a gay people | Une commande pour detecter les gays',
            usage: 'gaydetector <id/member> ',
            category: 'fun',
            tags: ['guildOnly'],
            aliases: ['gay'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const color = message.guild.color
    const lang = client.lang(message.guild.lang)

    let member = message.mentions.users.first() || message.author

    let rng = Math.floor(Math.random() * 100)
    const gaydetectorembed = new Discord.MessageEmbed()
    .setTitle(lang.gaydetector.title)
    .setDescription(`**${member.username}** est gay à ${rng}% 🏳️‍🌈`)
    .setColor(`${color}`)

    message.channel.send(gaydetectorembed)

    }
};

