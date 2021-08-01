const request = require('request')
const Discord = require('discord.js')

module.exports = {

    name: 'webhook',
    description: 'Show the number of webhook or delete all the webhook | Afficher le nombre de webhook ou les supprimer',
    usage: 'webhook < size / delete >',
    category: 'moderation',
    aliases: ['wb'],
    clientPermissions: ['MANAGE_WEBHOOKS'],
    userPermissions: ['MANAGE_WEBHOOKS'],
    cooldown: 5,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const del = args[0] === 'delete';

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
