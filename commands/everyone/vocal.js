const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'vocal',
    description: 'Show how many members are in voice chat | Permet de montrer combien de membres sont en vocal',
    // Optionnals :
    usage: '!vocal',
    category: 'everyone',
    aliases: ['voc', 'vc'],
    clientPermissions: ['SEND_MESSAGES'],
    cooldown: 2
}, async(client, message, args) => {
    const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
    const members = message.guild.members.cache.filter(m => !m.bot && m.voice.channelID != null);
    // console.log(message.guild.members.cache.get('796457090679570483').voice)
    // console.log(message.guild.members.cache.filter(m => !m.bot && m.voice.sessionID))
    const color = guildEmbedColor.get(message.guild.id)
    const lang = require(`../../lang/${message.guild.lang}`)

    let count = 0;
    let muteCount = 0;
    let streamingCount = 0;
    let muteHeadSetCount = 0;
    let openMicCount = 0;
    for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
    for (const [id, member] of members) {
        if(member.voice.mute == true && member.voice.deaf == false){
            muteCount += 1
        }
        if(member.voice.streaming == true){
            streamingCount += 1
        }
        if(member.voice.deaf == true){
            muteHeadSetCount += 1
        }
        if(member.voice.mute == false && member.voice.deaf == false){
            openMicCount += 1
        }
        
    }
    // members.clear();
    // let Embed = new discord.MessageEmbed()
    //     .setTitle(`<:775296098356428801:781188223481282570> __${lang.vocal.title}__`)
    //     .setDescription(lang.vocal.description)
    //     .setColor(`${color}`)
    //     .setFooter(`${client.user.username}`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
    //     .setTimestamp()
    message.channel.send(lang.vocal.msg(count, muteCount, streamingCount,muteHeadSetCount, openMicCount))
});


langF(guildLang);
embedsColor(guildEmbedColor);
