const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
module.exports = new Command({
    name: 'setname',
    description: 'definir le nom du bot',
    // Optionnals :
    usage: '!setname dd',
    category: 'botOwner',
    tags:['ownerOnly', "guildOnly"],
    aliases: ['setname', 'setprenom', 'setnom'],
    cooldown: 2
}, async (client, message, args) => {
    const color = message.guild.color

    if (args.length) {
        let str_content = args.join(" ")
        client.user.setUsername(str_content)
            .then(u => message.channel.send(`${message.author}, Vous avez changé le pseudonyme de votre bot.`))
            .catch(e => { return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``); });
    } else {
        message.channel.send(` ${message.author}, Vous avez fournie aucune valeur, veuillez mettre comment vous souhaitez nommé votre bot`);
    }

});

embedsColor(guildEmbedColor);