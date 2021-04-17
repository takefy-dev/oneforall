const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
var checkOwner = require('../../function/check/botOwner');
const guildLang = new Map();
const guildOwner = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'dero',
    description: "Fix back the derogation of channels when someone raid | Remet les dérogations des salons quand quelqu'un raid",
    // Optionnals :
    usage: '!dero',
    category: 'moderation',
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['MANAGE_CHANNELS'],
    cooldown: 10
}, async (client, message, args) => {
  
        const color = message.guild.color
        const lang = require(`../../lang/${message.guild.lang}`)
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

        if (!client.isGuildOwner(message.guild.owners, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
        if(args[0].toLowerCase() !== 'off'){
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
        }else if(args[0].toLowerCase() === "off"){
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
        
    });


embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('ownerUpdate', (guildId, data) => {
    guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) => {
    guildOwner.set(guildId, data);

})
