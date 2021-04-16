const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command, getThing } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const Distube = require('distube')
module.exports = new Command({
    name: 'test',
    description: 'test',
    // Optionnals :
    usage: 'test',
    category: 'test',
    tags: [],
    aliases: [],
    userPermissions: [],
    clientPermissions: [],
}, async (client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const play = client.music.playlist(args[0], message.author);

    console.log(play)
});

embedsColor(guildEmbedColor);
langF(guildLang);
