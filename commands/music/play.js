const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'play',
    description: 'Play a song | Jouer une music',
    // Optionnals :
    usage: '!play <url/title>',
    category: 'music',
    tags: ['guildOnly', "voiceOnly"],
    aliases: ['p'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const musicName = args.join(" ");
    console.log(musicName)
    if(!musicName) return message.channel.send(lang.play.noMusic);
    try{
        await client.music.play(message, musicName).catch(err => console.log(err))

    }catch(e){
        console.error(e)
        message.channel.send(`Error ${e}`)
    }
});

embedsColor(guildEmbedColor);
langF(guildLang);
