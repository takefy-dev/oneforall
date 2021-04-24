const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'queue',
            description: 'Get the queue of music in the server | Afficher la liste des music sur le serveur',
            usage: '!queue',
            category: 'music',
            aliases: ['q'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const queue = client.music.getQueue(message)
        if (!queue) return message.channel.send(lang.music.nothingInQueue)
        const q = queue.songs.map((song, i) => `${i === 0 ? lang.music.playing : `${i}.`} ${song.name} - \`${song.formattedDuration}\``).join("\n")
        const embed = new Discord.MessageEmbed()
            .setTitle(`Current queue`)
            .setDescription(queue.songs.map((song, i) => `${i === 0 ? lang.music.playing : `${i}.`} [${song.name} - \`${song.formattedDuration}\`](${song.url})`).slice(0, 15).join("\n"))
            .setTimestamp()
            .setColor(`${color}`)

        message.channel.send(embed)
    }
}