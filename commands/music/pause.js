const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'pause',
    description: 'Pause the current music | Mettre en pause la music',
    // Optionnals :
    usage: '!pause',
    category: 'music',
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    if (queue.pause) {
        client.music.resume(message)
        return message.channel.send(lang.music.pause.unPause)
    }
    client.music.pause(message)
    message.channel.send(lang.music.pause.pause)
});

embedsColor(guildEmbedColor);
langF(guildLang);
