const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const { lang } = require('moment');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'clear',
    description: 'Delete a number of message | Supprimer un nombre de messages',
    // Optionnals :
    usage: '!clear <number>',
    category: 'moderation',
    userPermissions: ['MANAGE_MESSAGES'],
    clientPermissions: ['MANAGE_MESSAGES'],
    cooldown: 2
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id)
    const lang = require(`../../lang/${message.guild.lang}`)

    let deleteAmount;

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.reply(lang.clear.errorNaN)}

    if (parseInt(args[0]) >= 101) {
        return message.reply(lang.clear.error100)
    } else {
        deleteAmount = parseInt(args[0]);
    }
    message.delete();
    let msg;
    message.channel.bulkDelete(deleteAmount + 1, true).then(async () =>{
        msg = await message.channel.send(lang.clear.success(deleteAmount))
        setTimeout(() =>{
            msg.delete();
        }, 5000)  
   
    });
});

embedsColor(guildEmbedColor);
langF(guildLang);
