
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'pic',
    description: "Get the picture profile of an user | Avoir l'avatar d'un utilisateur",
    // Optionnals :
    usage: '!pic [user]',
    aliases: ['pp'],
    cooldown: 2
}, async (client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    let user = message.mentions.users.first();
    if(!isNaN(args[0])) user =  await client.users.fetch(args[0]).catch()
    if (!user) user = message.author;
    const avatarURL = user.displayAvatarURL({ size: 512, dynamic: true }).replace(".webp", ".png");
    if (message.content.includes("-v")) message.channel.send("<" + avatarURL + ">");
    const embed = new Discord.MessageEmbed()
        .setTitle(user.tag)
        .setImage(avatarURL)
        .setColor(`${color}`)
        .setTimestamp()
        .setFooter(client.user.username)
    message.channel.send(embed);
});

embedsColor(guildEmbedColor);
langF(guildLang);
