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
    const song = queue.songs[0];
    let minutes = song.formattedDuration.split(":")[0];   
    let seconds = song.formattedDuration.split(":")[1];    
    let ms = (Number(minutes)*60+Number(seconds));   

    //define current time
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
   // define left duration
    const left = ms - seek;
    const likes = song.likes.toLocaleString();
    const dislikes = song.dislikes.toLocaleString();
    const reposts = song.reposts.toLocaleString();
    const view = song.views.toLocaleString();
    const name = song.name;
    const url = song.url;
    const thumbnail = song.thumbnail;
    const requestedBy = song.user;
    const averageRate = !song.info ? lang.music.noAvgRate : parseFloat(song.info.videoDetails.averageRating).toFixed(1);
    const category = !song.info ? lang.music.noAvgRate : song.info.videoDetails.category;
    let nowPlaying = new Discord.MessageEmbed()
          .setAuthor('Now playing ♪','https://cdn.discordapp.com/attachments/820031925389230110/822494236007596082/3dgifmaker81211.gif','https://www.one4all.fr')
          .setDescription(`<:title:783422216095793172> Title: [**${name}**](${url})\n<:asked:823538221257588737> Requested by: **${requestedBy}**\n:eyes: Views: **${view}**\n<:like:823538200285806622> Likes: **${likes}**\n<:dislike:823538205001383967> Dislikes: **${dislikes}**\n<:cateogry:823538209598341149> Category: **${category}**\n<:rate:823538188466389032> Average Rate: **${averageRate}**\n<a:reupload:823538184050573342> Reposts: **${reposts}**`)
          .setThumbnail(thumbnail)
          .setColor(`${color}`)
          .setFooter(`${lang.music.requestedBy} ${requestedBy.username}#${requestedBy.discriminator}`, requestedBy.displayAvatarURL({ dynamic: true }))
          .addField("\u200b", "\u200b");
      //if its a stream
      if(song.isLive) {
        nowPlaying.addField("\u200b", "🔴 LIVE", false);
        //send approve msg
        return message.channel.send(nowPlaying);
      }
      //If its not a stream 
      if (ms > 0 && ms<10000) {
        nowPlaying.addField("<:time:783422233988562964> **TIME:**", "`[" + createBar((ms == 0 ? seek : ms), seek, 25, "▬", "🟢")[0] + "]`\n" + "`" + "[" + new Date(seek * 1000).toISOString().substr(11, 8) + " / " + (ms == 0 ? " ◉ LIVE" : new Date(ms * 1000).toISOString().substr(11, 8))+ "]" + "`" + "\n" + "`" + new Date(left * 1000).toISOString().substr(11, 8) + "`", false ); // the bar
        //send approve msg
        return message.channel.send(nowPlaying);
      }
});

embedsColor(guildEmbedColor);
langF(guildLang);
