
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'filter',
            description: 'Put a filter on the music | Mettre un filtre sur la music',
            usage: '!filter <3d/bassboost/echo/karaoke/nightcore/vaporwave/flanger/gate/haas/reverse/surround/mcompand/phaser/tremolo/earwax> **OFF TO DISABLE**',
            category: 'music',
            tags: ['guildOnly', 'voiceOnly'],
            aliases: ['fl', 'filtre', 'effet'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {
        const color = message.guild.color
        let availableFilter = ["off", "3d", "bassboost", "echo", "karaoke", "nightcore", "vaporwave", "flanger", "gate", "hass", "reverse", "surround", "mcompand", "phaser", "tremolo", "earwax"]
        const lang = client.lang(message.guild.lang)
        const queue = client.music.getQueue(message)
        if (!queue) return message.channel.send(lang.music.nothingInQueue)
        const desiredFilter = args[0];
        if (!desiredFilter || !availableFilter.includes(desiredFilter)) return message.channel.send(lang.music.filter.noArgs)

        if (desiredFilter === "off") {
            client.music.setFilter(message, queue.filter);

            message.channel.send(lang.music.filter.successOff)
        } else {
            let filter = client.music.setFilter(message, desiredFilter);

            message.channel.send(lang.music.filter.success(desiredFilter, filter))
        }


    }
};
