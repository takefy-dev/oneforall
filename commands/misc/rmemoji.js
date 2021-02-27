const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const { Util } = require('discord.js')
const { parse } = require('twemoji-parser')
module.exports = new Command({
    name: 'removeemoji',
    description: 'Remove an emoji | Supprimer un emoji',
    // Optionnals :
    usage: '!removeemoji <emoji>',
    category: 'misc',
    aliases: ['remove', 'emojiremove', 'rmemoji'],
    userPermissions: ['MANAGE_GUILD'],
    tags : ['guildOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 2
}, async (client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
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
  
})

embedsColor(guildEmbedColor);
langF(guildLang);
