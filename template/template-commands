const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: '',
    description: '',
    // Optionnals :
    usage: '',
    category: '',
    tags: ['guildOnly'],
    aliases: [''],
    userPermissions: [],
    clientPermissions: [],
    cooldown: 10
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);

});

embedsColor(guildEmbedColor);
langF(guildLang);
