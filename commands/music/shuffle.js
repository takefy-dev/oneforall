const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'shuffle',
            description: 'Randomise the queue song order | Choisis des musics aléatoire de la queue',
            // Optionnals :
            usage: '!shuffle',
            category: 'music',
            aliases: ['random'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }
    async run(client, message,args){

    const color = message.guild.color
    const lang = client.lang(message.guild.lang)
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    client.music.shuffle(message)
    message.channel.send(lang.music.shuffle)
}};
