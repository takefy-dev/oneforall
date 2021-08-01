
const coinSettings = new Map();
const userCoins = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
const {MessageEmbed} = require("discord.js");

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'pay',
            description: 'Pay a member | Payer un membre',
            // Optionnals :
            usage: 'pay <mention / id> <number coins>',
            category: 'coins',
            coinsOnly: true,
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const lang = guildData.lang
        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];

        const targetUser = await client.users.fetch(args[0]);
        if (!targetUser) return;

        const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`)
        if (!userData) return;

        const targetData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${targetUser.id}`)

        if (!targetData) return;

        if (!args[1]) return message.reply(lang.pay.noCoins);

        if (!isNaN(args[1])) {
            if (parseFloat(args[1]) > 0.0 && args[1].split('.')[1].split('').length <= 2 && userData.get("coins") >= parseFloat(args[1])) {
                userData.removeCoins(parseFloat(args[1])).save();
                targetData.addCoins(parseFloat(args[1])).save();

                message.channel.send(lang.pay.giveCoins(parseFloat(args[1]), targetUser));
                const {logs} = guildData.get('coinsSettings')
                const logsChannel = message.guild.channels.cache.get(logs);
                if(!logsChannel && logsChannel.deleted) return;
                const logsEmbed = new MessageEmbed()
                    .setTitle(`Coins logs`)
                    .setColor(guildData.get('color'))
                    .setDescription(lang.pay.logs(parseFloat(args[1]), message.member, targetUser))
                logsChannel.send({embeds: [logsEmbed]})
            }else
                message.reply(lang.pay.notEnoughtCoins(parseFloat(args[1])))
        }

    }
}