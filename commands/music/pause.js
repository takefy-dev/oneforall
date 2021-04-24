const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'pause',
            description: 'Pause the current music | Mettre en pause la music',
            usage: '!pause',
            category: 'music',
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const queue = client.music.getQueue(message)
        if (!queue) return message.channel.send(lang.music.nothingInQueue)
        if (queue.pause) {
            client.music.resume(message)
            return message.channel.send(lang.music.pause.unPause)
        }
        client.music.pause(message)
        message.channel.send(lang.music.pause.pause)
    }
}
