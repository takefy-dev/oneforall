const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const createBar = require("string-progressbar");
module.exports = new Command({
    name: 'nowplaying',
    description: 'show the current playing music | Affiche la music qui joue',
    // Optionnals :
    usage: '!nowplaying',
    category: 'music',
    tags: ['guildOnly', 'voiceOnly'],
    aliases: ['np', 'current-song', 'now-playing'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 3
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    console.log(queue)
    const song = queue.songs[0];
    console.log(song)
    let minutes = song.formattedDuration.split(":")[0];   
    let seconds = song.formattedDuration.split(":")[1];    
    let ms = (Number(minutes)*60+Number(seconds));   

    //define current time
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    //define left duration
    const left = ms - seek;
    const likes = song.likes;
    const dislikes = song.dislikes;
    const reposts = song.reposts;
    const view = song.views;
    const name = song.name;
    const url = song.url;
    const thumbnail = song.thumbnail;
    const requestedBy = song.user;
    const averageRate = parseFloat(song.info.videoDetails.averageRating).toFixed(1);
    const category = song.info.videoDetails.category;
    let nowPlaying = new Discord.MessageEmbed()
          .setAuthor('♪Now playing♪','https://cdn.discordapp.com/attachments/820031925389230110/822494236007596082/3dgifmaker81211.gif','https://www.one4all.fr')
          .setDescription(`[**${song.name}**](${song.url})`)
          .setImage(song.thumbnail)
          .setColor(`${color}`)
          .setFooter(`${lang.music.requestedBy} ${requestedBy.username}#${requestedBy.discriminator}`, requestedBy.displayAvatarURL({ dynamic: true }))
      //if its a stream
      if(song.isLive) {
        nowPlaying.addField("\u200b", "🔴 LIVE", false);
        //send approve msg
        return message.channel.send(nowPlaying);
      }
      //If its not a stream 
      if (ms > 0 && ms<10000) {
        nowPlaying.addField("\u200b", "**``[" + createBar((ms == 0 ? seek : ms), seek, 25, "▬", "🔘")[0] + "]``**\n**" + "\n[" + new Date(seek * 1000).toISOString().substr(11, 8) + " / " + (ms == 0 ? " ◉ LIVE" : new Date(ms * 1000).toISOString().substr(11, 8))+ "]**" + "\n" + `\n **${lang.music.currentPlaying.timeLeft}**` + "``" + new Date(left * 1000).toISOString().substr(11, 8) + "``", false ); // the bar
        //send approve msg
        return message.channel.send(nowPlaying);
      }
});

embedsColor(guildEmbedColor);
langF(guildLang);
