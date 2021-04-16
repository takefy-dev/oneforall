const lyricsFinder = require("lyrics-finder");
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'lyrics',
    description: 'Get the lyrics of current playing music | Afficher les paroles de la music',
    // Optionnals :
    usage: '!lyrics',
    category: 'music',
    aliases: ['ly'],
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    let lyrics = null;
    try {
        lyrics = await lyricsFinder(queue.songs[0].name, "");
        if (!lyrics) lyrics = `${lang.music.lyrics.notFound} ${queue.songs[0].name}.`;
      } catch (error) {
        console.log(error)
        lyrics = `${lang.music.lyrics.notFound} ${queue.songs[0].name}.`;
      }
  
      let lyricsEmbed = new Discord.MessageEmbed()
        .setTitle("Lyrics")
        .setDescription(lyrics)
        .setColor(`${color}`)
        .setTimestamp();
  
      if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
      return message.channel.send(lyricsEmbed).catch(console.error);
});

embedsColor(guildEmbedColor);
langF(guildLang);
