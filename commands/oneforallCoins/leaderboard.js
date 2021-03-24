const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const userCoins = new Map();
module.exports = new Command({
    name: 'leaderboard',
    description: 'Show the top 10 member with the most coins | Affiche le top 10 des membres avec le plus de coins',
    // Optionnals :
    usage: '!leaderboard',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['lb', 'classement'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const guildTotalCoins = userCoins.get(message.guild.id);
    if(guildTotalCoins){
        const sortedTotalCoins = Object.entries(guildTotalCoins).sort((a, b) => b[1].coins - a[1].coins);
        const lb = sortedTotalCoins.slice(0, 10)
        const embed = new Discord.MessageEmbed()
        .setTitle(lang.lb.title)
        .setDescription(lb.map((user, i) => `${i+1} . <@${user[1].userId}> : ${user[1].coins}`))
        .setFooter(`OneForAll coins`)
        .setColor(`${color}`)
        message.channel.send(embed)
    }else{
        return message.channel.send(lang.lb.noCoins)
    }
  
});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('guildCoins', (guildId, coins) => {
    userCoins.set(guildId, coins)
})
