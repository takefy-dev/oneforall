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
    usage: '!myplaylist',
    category: 'music',
    tags: ['guildOnly'],
    aliases: ['mp'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const authorPlaylist = usersPlaylist.get(message.author.id);
    const playlist = !authorPlaylist ? `No playlist` : authorPlaylist.map((pl, i) => `${i+1}. ${pl.name}\n`);
    const embed = new Discord.MessageEmbed()
    .setDescription(playlist)
    .setColor(`${color}`)
    message.channel.send(embed)

});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('playlist', (userId, playlist) => {
    usersPlaylist.set(userId, playlist)
})
StateManager.on('playlistDelete', (userId) =>{
    usersPlaylist.delete(userId)
})