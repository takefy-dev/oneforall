const randomPuppy = require('random-puppy')
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'meme',
            description: 'A meme command for Joke | Une commande meme pour rigoler',
            usage: '!meme',
            category: 'fun',
            tags: ['guildOnly'],
            aliases: ['!me'],
            clientPermissions: ["EMBED_LINKS"],
        });
    }
    async run(client, message,args){

    const color = message.guild.color
    const lang = client.lang(message.guild.lang)
    const subReddits = ["dankememe", "meme", "memes"]
    const random = subReddits[Math.floor(Math.random() * 3) ]

    const img = await randomPuppy(random)

    const embed = new Discord.MessageEmbed()
        .setColor(`${color}`)
        .setImage(img)
        .setTitle(lang.meme.reponse(random))
        .setURL(`https://reddit.com/r/${random}`)

    message.channel.send(embed)
}};
