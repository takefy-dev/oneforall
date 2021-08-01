const request = require('request')
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'webhook',
            description: 'Show the number of webhook or delete all the webhook | Afficher le nombre de webhook ou les supprimer',
            usage: 'webhook < size / delete >',
            category: 'moderation',
            aliases: ['wb'],
            clientPermissions: ['MANAGE_WEBHOOKS'],
            userPermissions: ['MANAGE_WEBHOOKS'],
            cooldown: 5
        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const del = args[0] === 'delete';
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Informations Invitations`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
                .setColor(`${color}`)
                .setTimestamp()
                .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
                .setFooter("Massrole", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
                .addField('<:invite_oeople:785494680904138763> MassRole:', `[\`massrole add\`](https://discord.gg/WHPSxcQkVk) ・ Setup du système d'invitations\n[\`massrole remove\`](https://discord.gg/WHPSxcQkVk) ・ Suppression de rôle en masse`)
            message.channel.send({embeds: [embed]})
        }
        const size = args[0] === "size";
        if (size) {
            message.guild.fetchWebhooks().then((webhooks) => {
                message.channel.send(lang.webhook.replyMsg(message.guild, webhooks))
            })
        } else if (del) {
            function webDel(strURL) {
                for (let index = 0; index < 5; index++) {
                    request.del(strURL, {}, () => {

                    })

                }
                message.channel.send(lang.webhook.replyMsgDelete)
                message.guild.fetchWebhooks().then((webhooks) => {
                    webhooks.forEach((webhook) => {
                        let strURL = `https://discordapp.com/api/v8/webhooks/${webhook.id}/${webhook.token}`
                        webDel(strURL)


                    })
                })
            }
        }

    }

}
