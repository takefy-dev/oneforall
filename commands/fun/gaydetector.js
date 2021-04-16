const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'gaydetector',
    description: 'A command for look a gay people | Une commande pour detecter les gays',
    // Optionnals :
    usage: '!gaydetector <id/member> ',
    category: 'fun',
    tags: ['guildOnly'],
    aliases: ['gay'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 5
}, async(client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);

    let member = message.mentions.users.first() || message.author

    let rng = Math.floor(Math.random() * 100)
    const gaydetectorembed = new Discord.MessageEmbed()
    .setTitle(lang.gaydetector.title)
    .setDescription(`**${member.username}** est gay à ${rng}% 🏳️‍🌈`)
    .setColor(`${color}`)

    message.channel.send(gaydetectorembed)

});

embedsColor(guildEmbedColor);
langF(guildLang);
