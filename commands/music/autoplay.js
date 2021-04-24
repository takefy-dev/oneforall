const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'autoplay',
            description: "Enable or disable the autoplay | Activer ou désactiver l'autoplay",
            usage: '!autoplay <on/off>',
            category: 'music',
            clientPermissions: ['EMBED_LINKS'],
        });
    }
    async run(client, message,args){

    const color = message.guild.color
    const lang = client.lang(message.guild.lang)
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

  
}}
