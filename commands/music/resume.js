
const Command = require('../../structures/Handler/Command');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'resume',
            description: 'Resume a music | Redémarrer la music',
            usage: '!resume',
            category: 'music',
            aliases: ['unpause'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const queue = client.music.getQueue(message)
        if (!queue) return message.channel.send(lang.music.nothingInQueue)
        client.music.resume(message)
        message.channel.send(lang.music.pause.unPause)
    }
}
