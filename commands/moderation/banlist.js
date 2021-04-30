const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'allbans',
            description: 'Show all bans members | Afficher tout les membres banni',
            usage: 'allbans',
            category: 'moderation',
            aliases: ['banlist'],
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const color =message.guild.color
    const lang = client.lang(message.guild.lang)


    message.guild.fetchBans()
        .then(banned => {
            let list = banned.map(ban => ban.user.tag).join('\n');
            const color =message.guild.color

            if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;
            const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setFooter(client.user.tag)
                .setTitle(lang.banlist.title(message.guild))
                .setDescription(lang.banlist.description(banned, list))
                .setColor(`${color}`)
            const embedinf = new Discord.MessageEmbed()
                .setTimestamp()
                .setTitle(lang.banlist.title(message.guild))
                .setFooter(client.user.tag)
                .setDescription(lang.banlist.descriptionInf(banned))
                .setColor(`${color}`)
            if (list.length > 0) {
                message.channel.send(embed);

            } else {
                message.channel.send(embedinf);

            }
        })

}}
