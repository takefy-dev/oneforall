
const Discord = require('discord.js')
const randomPuppy = require('random-puppy')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'meme',
    description: 'A meme command for Joke | Une commande meme pour rigoler',
    // Optionnals :
    usage: '!meme',
    category: 'fun',
    tags: ['guildOnly'],
    aliases: ['!me'],
    clientPermissions: ["EMBED_LINKS"],
    cooldown: 5
}, async (client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const subReddits = ["dankememe", "meme", "memes"]
    const random = subReddits[Math.floor(Math.random() * 3) ]

    const img = await randomPuppy(random)

    const embed = new Discord.MessageEmbed()
        .setColor(`${color}`)
        .setImage(img)
        .setTitle(lang.meme.reponse(random))
        .setURL(`https://reddit.com/r/${random}`)

    message.channel.send(embed)
    console.log(img)
});

embedsColor(guildEmbedColor);
langF(guildLang);
