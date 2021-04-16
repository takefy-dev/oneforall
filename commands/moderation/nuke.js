const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
var checkOwner = require('../../function/check/checkWl');
var checkSetup = require('../../function/check/checkSetup');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'nuke',
    description: "Clear all messages of a channel | Supprimer tout les messages d'un salon",
    // Optionnals :
    usage: '!nuke',
    category: 'moderation',
    tags: ['guildOnly'],
    aliases: ['renew', 'clearall'],
    userPermissions: ['MANAGE_MESSAGES'],

    clientPermissions: ['MANAGE_CHANNELS'],
    cooldown: 2
}, async(client, message, args) => {
    const lang = require(`../../lang/${message.guild.lang}`)
   
    // if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("<:720681441670725645:780539422479351809> \`ERREUR\` Vous n'avez pas la permission requise \`MANAGE_MESSAGES\`");

    const position = message.channel.position;
    const rateLimitPerUser = message.channel.rateLimitPerUser;
    var newChannel = await message.channel.clone()
    message.channel.delete();
    newChannel.setPosition(position);

    newChannel.setRateLimitPerUser(rateLimitPerUser)
    newChannel.send(lang.nuke.success(message.member))


});



embedsColor(guildEmbedColor);
langF(guildLang);
