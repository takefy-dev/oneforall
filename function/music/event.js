const Discord = require("discord.js");
const guildLang = new Map();
var langF = require('../../function/lang')
const guildEmbedColor = new Map();
var embedsColor = require('../../function/embedsColor');
const { Logger } = require('advanced-command-handler');

module.exports = {
    async musicEvent(music) {
        Logger.log(`${Logger.setColor('blue')} Events launch`, 'music')
        const guildColor = (message) => guildEmbedColor.get(message.guild.id);
        const lang = (message) => require(`../../lang/${guildLang.get(message.guild.id)}`);
        const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

        // when music is start playing
        music.on("playSong", async (message, queue, song) => {
            const nameOfSong = song.name; // the nam eof the song playing
            const timeOfSong = song.formattedDuration; // the duration of the song
            const requestedBy = song.user; // the user who play the song
            const queueStatus = status(queue); //
            const color = guildColor(message)
      
        })



        // when a song is added to the queue
        music.on("addSong", (message, queue, song) => {
            const nameOfSong = song.name; // the nam eof the song playing
            const timeOfSong = song.formattedDuration; // the duration of the song
            const requestedBy = song.user; // the user who play the song
            const color = guildColor(message)

            message.channel.send(`Added ${nameOfSong} - \`${timeOfSong}\` to the queue by ${requestedBy}`)
        })

        // when the playlist start
        music.on("playList", (message, queue, playlist, song) => {
            const nameOfSong = song.name; // the nam eof the song playing
            const nameOfPlaylist = playlist.name // the name of the playlist
            const numberOfSongInPlaylisy = playlist.songs.length // the number of song in the playlist
            const timeOfSong = song.formattedDuration; // the duration of the song
            const requestedBy = song.user; // the user who play the song
            const queueStatus = status(queue); //
            const color = guildColor(message)
            message.channel.send(`Play \`${nameOfPlaylist}\` playlist (${numberOfSongInPlaylisy} songs).\nRequested by: ${requestedBy}\nNow playing \`${nameOfSong}\` - \`${timeOfSong}\`\n${queueStatus}`)
        })

        // when the music is added to the guild queue
        music.on("playList", (message, queue, playlis) => {
            const nameOfPlaylist = playlist.name // the name of the playlist
            const numberOfSongInPlaylisy = playlist.songs.length // the number of song in the playlist
            const queueStatus = status(queue); //
            const color = guildColor(message)
            

            message.channel.send( `Added \`${nameOfPlaylist}\` playlist (${numberOfSongInPlaylisy} songs) to queue\n${queueStatus}`)
        })

        //result of the search
        music.on("searchResult", (message,result) =>{
            let i = 0;
            message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
        })

        // search cancel
        music.on("searchCancel", (message) => {
            message.channel.send(`Searching canceled`)
        })

        //error 
        music.on("error", (message, error) => {
            console.error(error)
            message.channel.send(`An error as occurent: \n ${error}`)
        })

        // when nobody is in voicechat
        music.on("empty", (message) =>{
            message.channel.send("Channel is empty. Leaving the channel")
        })
        music.on("noRelated", message =>{
            message.channel.send("Can't find related video to play. Stop playing music.")
        } );

    }
}
embedsColor(guildEmbedColor);
langF(guildLang);