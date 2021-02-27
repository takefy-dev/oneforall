const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
module.exports = new Command({
    name: 'setavatar',
    description: '!setavatar <link or image>',
    // Optionnals :
    usage: '!setavatar <link or image>',
    category: 'botOwner',
    tags:['ownerOnly', "guildOnly"],

    aliases: ['setphoto', 'setimage', 'seticon'],
    cooldown: 2
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id)
    if(!message.guild) return;

    if(message.attachments.size > 0) { 
    message.attachments.forEach(attachment => {
        client.user.setAvatar(attachment.url)
        .then(u => message.channel.send(`${message.author}, Vous avez changé la photo de profil de votre bot.`))
        .catch(e => { return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``); });
    });
    } else if (args.length) {
        let str_content = args.slice(0).join(" ")
        client.user.setAvatar(str_content)
        .then(u => message.channel.send(` ${message.author}, Vous avez changé la photo de profil de votre bot.`))
        .catch(e => { return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``); });
    } else {
        message.channel.send(`${message.author}, Vous avez fournie aucune valeur, veuillez mettre sois une image sois un lien`);
    }
});

embedsColor(guildEmbedColor);