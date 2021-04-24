
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'loop',
            description: 'Set the repeat mode | Changer le mode en boucle',
            usage: `!loop <off/song/queue> \`off: Disable\`, \`song: Repeat a song\`, \`queue: Repeat all the queue\``,
            category: 'music',
            aliases: ['rp'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }
    async run(client, message,args){

    const color = message.guild.color
    const lang = client.lang(message.guild.lang)
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    let mode = null
    switch (args[0]) {
        case "off":
            mode = 0
            break
        case "song":
            mode = 1
            break
        case "queue":
            mode = 2
            break
    }
    mode = client.music.setRepeatMode(message, mode)
    mode = mode ? mode === 2 ? "Repeat queue" : "Repeat song" : "Off"
    message.channel.send(lang.music.repeatMode(mode))
}}