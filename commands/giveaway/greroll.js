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
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['ADMINISTRATOR'],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const lang = guildData.lang
        const msgId = args[0];
        let giveaway = client.giveawaysManager.giveaways.last();
        if (msgId) {

            giveaway =
                client.giveawaysManager.giveaways.find((g) => g.guildID === message.guild.id && g.prize === args.join(' ')) ||
                client.giveawaysManager.giveaways.find((g) => g.guildID === message.guild.id && g.messageID === args[0]);

        }

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

    }
};

