const Command = require('../../structures/Handler/Command');
const {Util} = require('discord.js')
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'reaction',
            description: 'Add reactions to messages sent in a channel | Ajoute des reactions aux messages envoyé dans un salon',
            category: 'misc',
            usage: 'reaction add <channel/id> <reactions up to 3>',
            clientPermissions: [''],
            userPermissions: ['MANAGE_MESSAGES'],
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        let reactionsToMessages = guildData.get('reactionsToMessages');
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.deleted) return message.channel.send(lang.reactionsToMessages.nochannel).then((mp) => {
            setTimeout(() => {
                mp.delete()
            }, 3000)
        })
        if (args[0] === "add") {

            const reactions = [args[2], args[3], args[4]].filter(react => react !== undefined);
            if (reactions.length === 0) return message.channel.send(lang.reactionsToMessages.noEmoji).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 3000)
            })
            for await (const react of reactions) {
                const parsedEmoji = Util.parseEmoji(react);
                if (parsedEmoji.id) {
                    let emoji = client.emojis.cache.get(parsedEmoji.id);
                    if (!emoji) {
                        let link = `https://cdn.discordapp.com/emojis/${parsedEmoji.id}.${parsedEmoji.animated ? "gif" : "png"}`
                        const em = await message.guild.emojis.create(link, parsedEmoji.name || parsedEmoji.id, {reason: `emoji add par ${message.author.username}`})
                        reactions[reactions.indexOf(react)] = em.toString()
                    }
                }
            }
            const alreadyExist = reactionsToMessages.find(reactionsToMessage => reactionsToMessage.channel === channel.id);
            if (alreadyExist) {
                reactionsToMessages = reactionsToMessages.filter(reactionsToMessage => reactionsToMessage.channel !== channel.id)
            }
            reactionsToMessages.push({channel: channel.id, reactions})
            guildData.set('reactionsToMessages', reactionsToMessages).save().then(() => {
                return message.channel.send(lang.reactionsToMessages.success(channel, reactions)).then((mp) => {
                    setTimeout(() => {
                        mp.delete()
                    }, 5000)
                })
            })
        }
        if(args[0] === "remove"){
            guildData.set('reactionsToMessages', reactionsToMessages.filter(react => react.channel !== channel.id)).save().then(() => {
                return message.channel.send(lang.reactionsToMessages.successDelete(channel)).then((mp) => {
                    setTimeout(() => {
                        mp.delete()
                    }, 5000)
                })
            })
        }
    }
}