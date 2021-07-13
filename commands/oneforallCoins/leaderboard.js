const userCoins = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'leaderboard',
            description: 'Show the top 10 member with the most coins | Affiche le top 10 des membres avec le plus de coins',
            // Optionnals :
            usage: 'leaderboard',
            category: 'coins',
            aliases: ['lb', 'classement'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        if (!message.guild.config.coinsOn) return;
          const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;
        const lb = await message.guild.getLeaderBoard()
        const color = message.guild.color;
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.lb.title)
            .setDescription(lb.map((user, i) => `${i + 1} . <@${user[1].userId}> : ${user[1].coins} coins`))
            .setFooter(`OneForAll coins`)
            .setColor(color)
        message.channel.send(embed)


    }
}