const discord = require('discord.js')

module.exports = {

    name: 'support',
    description: 'Get the support server | Avoir le serveur de support',
    usage: 'support',
    clientPermissions: ['SEND_MESSAGES'],
    category: 'everyone',
    cooldown: 2,

    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        const embed = new discord.MessageEmbed()
            .setAuthor(lang.support.support, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter(lang.support.support, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setDescription(`[\`${lang.clic}\`](https://discord.gg/WHPSxcQkVk)`)
        message.channel.send({embeds: [embed]});
    }
};

