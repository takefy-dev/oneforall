const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
let embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
let langF = require('../../function/lang')
const prettyMilliseconds = require('pretty-ms');
module.exports = new Command({
    name: 'stat',
    description: "Show the stats of a member | Afficher les statistiques d'un membre",
    // Optionnals :
    usage: 'stat [mention/id]',
    category: 'stats',
    tags: ['guildOnly'],
    cooldown: 5
}, async (client, message, args) => {
    return;
    const color = message.guild.color
    this.connection = StateManager.connection;
      const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;
    let member = message.mentions.members.first()
    if (member === undefined && args[0]) {
        if (message.guild.members.cache.has(args[0])) {
            member = message.guild.members.cache.get(args[0])
        } else {
            member = await message.guild.members.fetch(args[0]).catch(err => { })
        }
    } else {
        member = message.member
    }
    if (member === undefined) return message.channel.send(lang.stats.memberNotFound).then(mp => mp.delete({ timeout: 4000 }))
    let totalDuration = 0
    let mostActiveChannel;
    let mostActiveChannelDuration = 0;
    await this.connection.query(`SELECT * FROM statsVoc WHERE userId = '${member.user.id}' AND guildId = '${message.guild.id}'`).then(async (res) => {
        if (res[0].length === 0) return message.channel.send(lang.stats.noStatsFound).then(mp => mp.delete({ timeout: 4000 }))
        // console.log(res[0])
        const voiceStats = res[0]
        voiceStats.forEach(async stats => {
            totalDuration += stats.duration;
            if (message.guild.channels.cache.get(stats.channelId) === undefined) {
                await this.connection.query(`DELETE FROM statsVoc WHERE channelId = ${stats.channelId}`)

            }
        })
        let max = voiceStats.sort((a, b) => a.duration - b.duration)[voiceStats.length - 1]
        mostActiveChannelDuration = max.duration
        mostActiveChannel = message.guild.channels.cache.get(max.channelId)
        if (mostActiveChannel === undefined) {
            await this.connection.query(`DELETE FROM statsVoc WHERE channelId = ${max.channelId}`)
        }
    })
    if (totalDuration !== 0) {
        const embed = new Discord.MessageEmbed()
            .setDescription(lang.stats.desc(member))
            .addField(lang.stats.totalVoiceChat, prettyMilliseconds(totalDuration), true)
            .addField(lang.stats.voiceMostActive, mostActiveChannel === undefined ? lang.stats.noVoiceChannel : `**${mostActiveChannel.name}**  __${prettyMilliseconds(mostActiveChannelDuration)}__`, true)
            .setColor(`${color}`)
            .setFooter(client.user.username, member.user.displayAvatarURL({ dynamic: true }))
        message.channel.send(embed)
    }

});

embedsColor(guildEmbedColor);
langF(guildLang);
