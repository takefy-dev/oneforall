
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'greroll',
            description: 'Reroll giveaways',
            usage: 'greroll',
            category: 'giveaway',
            aliases: ['grl', 'gredo'],
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['ADMINISTRATOR'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const msgId = args[0];
        if (!msgId) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` Veuillez spécifiez l'id du message de giveaway !`)

        let giveaway = client.giveaways.giveaways.find((g) => g.prize === args.join(" ")) || client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if (!giveaway) return message.channel.send("Je ne trouve pas de giveaway avec cette ID/nom");

        client.giveaway.reroll(giveaway.messageID)
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

    }
};

