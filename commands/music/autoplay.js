const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'autoplay',
    description: "Enable or disable the autoplay | Activer ou désactiver l'autoplay",
    // Optionnals :
    usage: '!autoplay <on/off>',
    category: 'music',
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    let autoplayStatus = queue.autoplay;
    const activity = args[0];
    if(!activity || activity.toLowerCase() !== 'on' && activity.toLowerCase() !== "off") return message.channel.send(lang.music.autoplay.missingArgs)
    if(autoplayStatus && activity.toLowerCase() === "off"){
        client.music.toggleAutoplay(message)
        message.channel.send(lang.music.autoplay.off)
    }else if(autoplayStatus && activity.toLowerCase() === "on"){
        return message.channel.send(lang.music.autoplay.alreadyOn)
    }else if(!autoplayStatus && activity.toLowerCase() === 'on'){
        client.music.toggleAutoplay(message)
        message.channel.send(lang.music.autoplay.on)
    }else if(autoplayStatus && activity.toLowerCase() === "off"){
        return message.channel.send(lang.music.autoplay.alreadyOff)
    }

  
});

embedsColor(guildEmbedColor);
langF(guildLang);
