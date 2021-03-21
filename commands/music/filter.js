const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'filter',
    description: 'Put a filter on the music | Mettre un filtre sur la music',
    // Optionnals :
    usage: '!filter <3d/bassboost/echo/karaoke/nightcore/vaporwave/flanger/gate/haas/reverse/surround/mcompand/phaser/tremolo/earwax> **OFF TO DISABLE**',
    category: 'music',
    tags: ['guildOnly', 'voiceOnly'],
    aliases: ['fl', 'filtre', 'effet'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    let availableFilter = ["off","3d","bassboost","echo","karaoke", "nightcore", "vaporwave", "flanger", "gate", "hass", "reverse", "surround", "mcompand","phaser", "tremolo", "earwax"]
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    const desiredFilter = args[0];
    if(!desiredFilter || !availableFilter.includes(desiredFilter)) return message.channel.send(lang.music.filter.noArgs)

    if(desiredFilter === "off"){
        client.music.setFilter(message, queue.filter);

        message.channel.send(lang.music.filter.successOff)
    }else{
        let filter =  client.music.setFilter(message, desiredFilter);

        message.channel.send(lang.music.filter.success(desiredFilter,filter))
    }
   

});

embedsColor(guildEmbedColor);
langF(guildLang);
