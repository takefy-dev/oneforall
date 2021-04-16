const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'queue',
    description: 'Get the queue of music in the server | Afficher la liste des music sur le serveur',
    // Optionnals :
    usage: '!queue',
    category: 'music',
    aliases: ['q'],
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    const q = queue.songs.map((song, i) => `${i === 0 ? lang.music.playing : `${i}.`} ${song.name} - \`${song.formattedDuration}\``).join("\n")
    const embed = new Discord.MessageEmbed()
    .setTitle(`Current queue`)
    .setDescription(queue.songs.map((song, i) => `${i === 0 ? lang.music.playing: `${i}.`} [${song.name} - \`${song.formattedDuration}\`](${song.url})`).slice(0, 15).join("\n"))
    .setTimestamp()
    .setColor(`${color}`)
    
    message.channel.send(embed)
});

embedsColor(guildEmbedColor);
langF(guildLang);
