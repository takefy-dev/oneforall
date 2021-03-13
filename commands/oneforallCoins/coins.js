const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'coins',
    description: 'Show how many coins you have | Affiche le nombre de coins que vous avez',
    // Optionnals :
    usage: '!coins [mention/id]',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['balance', 'argent', 'money'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);

});

embedsColor(guildEmbedColor);
langF(guildLang);
