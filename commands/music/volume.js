
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'volume',
            description: 'Change the volume of the music | Changer le volume de la music',
            usage: '!volume <number>',
            category: 'music',
            aliases: ['v', 'up'],
            tags: ['guildOnly', 'voiceOnly'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const queue = client.music.getQueue(message)
        if (!queue) return message.channel.send(lang.music.nothingInQueue)
        const volume = parseInt(args[0]);
        if (isNaN(volume)) return message.channel.send(lang.music.volume.notNumber);
        if(volume > 100) return
        client.music.setVolume(message, volume);
        message.channel.send(lang.music.volume.changed(volume))

    }
}