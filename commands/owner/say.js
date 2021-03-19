const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'say',
    description: 'The bot can say your message | Le bot dit votre message',
    // Optionnals :
    usage: '!say <message>',
    category: 'owners',
    tags: ['guildOnly'],
    userPermissions: ['ADMINISTRATOR'],
    cooldown: 10
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const toSay = args.slice(0).join(' ')
    await message.delete()
    if(toSay.length < 1) return message.channel.send(lang.say.cantSendEmptyMsg).then(mp => mp.delete({timeout: 4000}))
    message.channel.send(toSay)
});

embedsColor(guildEmbedColor);
langF(guildLang);
