const Command = require('../../structures/Handler/Command');
const {MessageEmbed} = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'topxp',
            description: 'Show the top 10 best lvl',
            category: 'xp',
            usage: 'topxp',
            aliases: ['top-xp', 'xplb', 'xb-leaderboard'],
            clientPermissions : ['EMBED_LINKS'],
            cooldown: 2
        });
    }
    async run(client, message,args){
        const rawLeaderboard = await client.levels.fetchLeaderboard(message.guild.id, 10)
        const lb = await client.levels.computeLeaderboard(rawLeaderboard, true)
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const color = guildData.get('color')
        const embed = new MessageEmbed()
            .setDescription(`${lb.map((user => `${user.position} - **${user.username}#${user.discriminator}** - Level : ${user.level} - Xp: ${user.xp}`)).join('\n')}`)
            .setTimestamp()
            .setTitle(`Top 10 best members`)
            .setColor(color)
            .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        message.channel.send({embeds: [embed]})
    }
}