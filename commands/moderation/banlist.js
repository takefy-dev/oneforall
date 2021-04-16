const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const bans = new Map();
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'allbans',
    description: 'Show all bans members | Afficher tout les membres banni',
    // Optionnals :
    usage: '!allbans',
    category: 'moderation',
    aliases: ['banlist'],
    clientPermissions: ['BAN_MEMBERS'],
    userPermissions: ['BAN_MEMBERS'],
    cooldown: 5
}, async (client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id)
    const lang = require(`../../lang/${message.guild.lang}`)


    message.guild.fetchBans()
        .then(banned => {
            let list = banned.map(ban => ban.user.tag).join('\n');
            const color = guildEmbedColor.get(message.guild.id)

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

});

embedsColor(guildEmbedColor);
langF(guildLang);
