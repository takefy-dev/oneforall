const Discord = require('discord.js')

module.exports = {

    name: 'leaderboard',
    description: 'Show the top 10 member with the most coins | Affiche le top 10 des membres avec le plus de coins',
    usage: 'leaderboard',
    category: 'coins',
    aliases: ['lb', 'classement'],
    clientPermissions: ['EMBED_LINKS'],
    coinsonly: true,
    cooldown: 4,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const allUsers = client.managers.userManager.filter(user => user.get('guildId') === message.guild.id);
        const tempData = [];
        allUsers.forEach(user => tempData.push({userId: user.get('userId'), coins: user.get('coins')}))
        const lb = tempData.sort((a, b) => b.coins - a.coins).slice(0, 10);
        const color = guildData.get('color');
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.lb.title)
            .setDescription(`${lb.map((user, i) => `${i + 1} . <@${user.userId}> : ${user.coins.toFixed(2)} coins <a:coinsoneforall:823538178622488616>`).join('\n')}`)
            .setFooter(`OneForAll coins`)
            .setColor(color)
        message.channel.send({embeds: [embed]})


    }
}