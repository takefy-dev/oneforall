const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'previous',
    description: 'Play the previous song from the queue | Joue la dernière music joué',
    // Optionnals :
    usage: '!previous',
    category: 'music',
    aliases: ['prev'],
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    client.music.previous(message)
});

embedsColor(guildEmbedColor);
langF(guildLang);
