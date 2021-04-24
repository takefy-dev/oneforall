const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'skip',
            description: 'Skip to the next music in the queue | Sauter la music et passer a la suivante dans la queue',
            usage: '!skip',
            category: 'music',
            aliases: ['s'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const queue = client.music.getQueue(message)
        if (!queue) return message.channel.send(lang.music.nothingInQueue)
        try {
            client.music.skip(message)
            message.channel.send(`${lang.music.skip}\n${queue.songs[0].name}`)
        } catch (e) {

        }
    }
}
