const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const gawMsgID = new Map();
const vc = new Map();
module.exports = new Command({
    name: 'greroll',
    description: 'Reroll giveaways',
    // Optionnals :
    usage: '!greroll',
    category: 'giveaway',
    aliases: ['grl', 'gredo'],
    userPermissions: ['SEND_MESSAGES'],
    clientPermissions: ['ADMINISTRATOR'],
    cooldown: 2
}, async (client, message, args) => {
    const color = message.guild.color
    const msgId = args[0];
    if (!msgId) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` Veuillez spécifiez l'id du message de giveaway !`)

    let giveaway = client.giveawaysManager.giveaways.find((g) => g.prize === args.join(" ")) || client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    if (!giveaway) return message.channel.send("Je ne trouve pas de giveaway avec cette ID/nom");

    client.giveawaysManager.reroll(giveaway.messageID)
        .then(() => {
            message.channel.send('Le giveaway a été **__reroll__**')
        })
        .catch((e) => {
            if (e.startsWith(`Giveaway avec l'ID ${giveaway.messageID} n'est pas terminé `)) {
                message.channel.send("Ce giveaway n'est pas encore terminé")
            } else {
                console.error(e);
                message.channel.send('Oupsi, une erreur est survenue')
            }
        })

});

embedsColor(guildEmbedColor);
StateManager.on('gawMsgId', (guildId, gawMsgId) => {
    gawMsgID.set(guildId, gawMsgId)
})
StateManager.on('vc', (guildId, gawMsgId) => {
    vc.set(guildId, gawMsgId)
})
vc
