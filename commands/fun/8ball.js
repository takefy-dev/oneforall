const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: '8ball',
    description: 'Answer to your question. | Répond a votre question.',
    // Optionnals :
    usage: '!8ball <question>',
    category: 'fun',
    tags: ['guildOnly'],
    aliases: ['8b'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 5
}, async (client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);

    if (!args[0]) return message.channel.send(lang.ball.noQuestion)
    let replies = lang.ball.reponseQuestion
    let result = Math.floor((Math.random() * 8));
    let question = args.slice().join(" ");

    let ballembed = new Discord.MessageEmbed()
    .setAuthor(`🎱 ${message.author.username}`)
    .setColor(`${color}`)
    .addField("Question", question)
    .addField(lang.ball.reponse, replies[result])

    message.channel.send(ballembed)

});

embedsColor(guildEmbedColor);
langF(guildLang);
