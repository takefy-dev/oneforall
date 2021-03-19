const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'shuffle',
    description: 'Randomise the queue song order | Choisis des musics aléatoire de la queue',
    // Optionnals :
    usage: '!shuffle',
    category: 'music',
    aliases: ['random'],
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    client.music.shuffle(message)
    message.channel.send(lang.music.shuffle)
});

embedsColor(guildEmbedColor);
langF(guildLang);
