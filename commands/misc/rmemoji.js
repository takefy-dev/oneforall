
const { Util } = require('discord.js')
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'removeemoji',
            description: 'Remove an emoji | Supprimer un emoji',
            usage: 'removeemoji <emoji>',
            category: 'misc',
            aliases: ['remove', 'emojiremove', 'rmemoji'],
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 5

        });
    }
    async run(client, message,args){
    const color = message.guild.color
    const lang = client.lang(message.guild.lang)
    const emoji = args[0];
    let custom = Util.parseEmoji(emoji);

    if (!emoji) {
        return message.channel.send(lang.removeemoji.missingUrl);
    }

    if (custom.id) {
        message.guild.emojis.resolve(custom.id).delete(`Remove emoji par ${message.author.username}`).then(()=>{
            message.channel.send(lang.removeemoji.success(custom.name))

        }).catch(err => {
            message.channel.send(lang.removeemoji.error(custom.name))
        });

    }
  
}}

