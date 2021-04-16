const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'volume',
    description: 'Change the volume of the music | Changer le volume de la music',
    // Optionnals :
    usage: '!volume <number>',
    category: 'music',
    aliases: ['v', 'up'],
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async (client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const queue = client.music.getQueue(message)
    if (!queue) return message.channel.send(lang.music.nothingInQueue)
    const volume = parseInt(args[0]);
    if(isNaN(volume)) return message.channel.send(lang.music.volume.notNumber);
    client.music.setVolume(message, volume);
    message.channel.send(lang.music.volume.changed(volume))

});

embedsColor(guildEmbedColor);
langF(guildLang);
