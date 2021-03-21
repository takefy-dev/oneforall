const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const usersPlaylist = new Map();

module.exports = new Command({
    name: 'myplaylist',
    description: 'show your save playlist | Affiche vos playlist sauvegardé',
    // Optionnals :
    usage: '!myplaylist [playlistName]',
    category: 'music',
    tags: ['guildOnly'],
    aliases: ['mp'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const authorPlaylist = usersPlaylist.get(message.author.id);
    if(!args[0]){
        const playlist = !authorPlaylist ? `No playlist` : authorPlaylist.map((pl, i) => `${i+1}. ${pl.name}\n`);
        const embed = new Discord.MessageEmbed()
        .setDescription(playlist)
        .setColor(`${color}`)
        message.channel.send(embed)
    }else if(authorPlaylist){
        const playlistName = args.slice(0).join(" ");
        console.log(authorPlaylist)
        const lookPl = authorPlaylist.find(pl => pl.name === playlistName);
        console.log(playlistName, lookPl)
        if(lookPl){
            const songs = lookPl.song
         
            const embed = new Discord.MessageEmbed()
            .setAuthor(`Playlist ${playlistName} (${songs.length} songs)`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${songs.map((song, i) => `${i+1} - [${song.name}](${song.url}) \`${song.duration}\``).slice(0, 20).join("\n")}\n${songs.length > 20 ? `+ ${songs.length - 20}other songs` : ''}`)
            .setColor(`${color}`)
            message.channel.send(embed)
        }
    }else{
        message.channel.send("No playlist");
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