const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command, getThing} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

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
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const test = [ 'spammp', 'pubmp', 'dpid' ]
    test.splice(2, 1)
    console.log(test)
    
});

embedsColor(guildEmbedColor);
langF(guildLang);
