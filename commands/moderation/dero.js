
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'dero',
            description: "Fix back the derogation of channels when someone raid | Remet les dérogations des salons quand quelqu'un raid",
            usage: 'dero',
            category: 'moderation',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['MANAGE_CHANNELS'],
            guildOwnerOnly: true,
            cooldown: 5

        });
    }

    async run(client, message, args) {


        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        let success;
        let owner = message.guild.ownerID;

        if (client.BotPerso) {
            const fs = require('fs');
            const path = './config.json';
            if (fs.existsSync(path)) {
                owner = require('../../config.json').owner;
            } else {
                owner = process.env.OWNER
            }
        }

        if (args[0].toLowerCase() !== 'off') {
            const channels = message.guild.channels.cache
            channels.forEach(channel => {
                channel.edit({
                    permissionOverwrites: [{
                        id: message.guild.id,
                        deny: 805379089
                    }]
                })

            })
            success = await message.channel.send(lang.dero.success);
            setTimeout(() => {
                success.delete();
            }, 5000)
        } else if (args[0].toLowerCase() === "off") {
            const channels = message.guild.channels.cache
            channels.forEach(channel => {
                channel.edit({
                    permissionOverwrites: [{
                        id: message.guild.id,
                        allow: 'VIEW_CHANNEL'
                    }]
                })

            })
            success = await message.channel.send(lang.dero.success);
            setTimeout(() => {
                success.delete();
            }, 5000)
        }

    }
}
