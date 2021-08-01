const Discord = require('discord.js')

module.exports = {

    name: 'allbans',
    description: 'Show all bans members | Afficher tout les membres banni',
    usage: 'allbans',
    category: 'moderation',
    aliases: ['banlist'],
    clientPermissions: ['BAN_MEMBERS'],
    userPermissions: ['BAN_MEMBERS'],
    cooldown: 5,


    run: async (client, message, args) => {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;


        message.guild.bans.fetch()
            .then(banned => {
                let list = banned.map(ban => ban.user.tag).join('\n');
                const color = guildData.get('color')

                if (list.length >= 1950) list = `${list.slice(0, 1948)}...`;
                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setFooter(client.user.tag)
                    .setTitle(lang.banlist.title(message.guild))
                    .setDescription(lang.banlist.description(banned, list))
                    .setColor(color)
                const embedinf = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setTitle(lang.banlist.title(message.guild))
                    .setFooter(client.user.tag)
                    .setDescription(lang.banlist.descriptionInf(banned))
                    .setColor(color)
                if (list.length > 0) {
                    message.channel.send({embeds: [embed]});

                } else {
                    message.channel.send(embedinf);

                }
            })

    }
}
