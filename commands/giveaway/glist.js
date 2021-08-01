const {MessageEmbed} = require("discord.js");

module.exports = {

    name: 'glist',
    description: 'List giveaways',
    usage: 'glist',
    category: 'giveaway',
    aliases: ['list-giveaways'],
    userPermissions: ['MANAGE_GUILD'],
    clientPermissions: ['ADMINISTRATOR'],
    cooldown: 5,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const lang = guildData.lang;
        const color = guildData.get('color');
        const onServer = client.giveawaysManager.giveaways.filter(g => g.guildID === message.guild.id && !g.ended);
        let i = 0;
        const embed = new MessageEmbed()
            .setTitle(`List of giveaways (${onServer.size})`)
            .setDescription(onServer.size > 0 ? onServer.map((g) => {

                return `**Giveaway#${i++ + 1}** - [${g.prize}](https://discord.com/channels/${g.guildID}/${g.channelId
                }/${g.messageID})`
            }) : `No giveaways`)
            .setTimestamp()
            .setColor(color)
        await message.channel.send({embeds: [embed]})

    }
};

