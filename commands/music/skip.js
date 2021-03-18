const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'skip',
    description: 'Skip to the next music in the queue | Sauter la music et passer a la suivante dans la queue',
    // Optionnals :
    usage: '!skip',
    category: 'music',
    aliases: ['s'],
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    try{
        client.music.skip(message)
        message.channel.send(`${lang.music.skip}\n${queue.songs[0].name}`)
    }catch(e){

    }
});

embedsColor(guildEmbedColor);
langF(guildLang);
