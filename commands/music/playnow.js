const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const usersPlaylist = new Map();
module.exports = new Command({
    name: 'playnow',
    description: 'Play a song now| Jouer une music en skippant la queue',
    // Optionnals :
    usage: '!playnow <url/title/playlistName>',
    category: 'music',
    tags: ['guildOnly', "voiceOnly"],
    aliases: ['pn', 'pnow'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const musicName = args.join(" ");
    if(!musicName) return message.channel.send(lang.music.play.noMusic);
    if(usersPlaylist.has(message.author.id)){
        const authorPlaylist = usersPlaylist.get(message.author.id);
        let wantedPlaylist = authorPlaylist.filter(pl => pl.name === musicName);
        console.log(wantedPlaylist.length)
        if(!wantedPlaylist || wantedPlaylist.length === 0){
            try{
                await client.music.playSkip(message, musicName).catch(err => console.log(err))
        
            }catch(e){
                console.error(e)
                message.channel.send(`Error ${e}`)
            }
        }else{
            const songs = [];
            const songsPropertie = wantedPlaylist[0].song
            for(let song of songsPropertie){
                songs.push(song.url)
            }
            console.log(songs)
            try{
                await client.music.playCustomPlaylist(message, songs, {name : wantedPlaylist[0].name}, true, true);
            }catch(e){
                console.error(e)
                message.channel.send(`Une erreur est survenue`)
            }
        }
    }else{
        try{
            await client.music.playSkip(message, musicName).catch(err => console.log(err))
    
        }catch(e){
            console.error(e)
            message.channel.send(`Une erreur est survenue`)
        }
    }
    
});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('playlist', (userId, playlist) => {
    usersPlaylist.set(userId, playlist)
})
StateManager.on('playlistDelete', (userId) =>{
    usersPlaylist.delete(userId)
})