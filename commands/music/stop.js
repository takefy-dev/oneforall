const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'stop',
            description: 'Stop the music | Arreter la music',
            usage: '!stop',
            category: 'music',
            aliases: ['disconnect', 'deco'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const queue = client.music.getQueue(message)
        if (!queue) return message.channel.send(lang.music.nothingInQueue)
        client.music.stop(message)
        message.channel.send(lang.music.stop)

    }
}