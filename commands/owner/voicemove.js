const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
var checkOwner = require('../../function/check/botOwner');
const guildOwner = new Map();
const {Command} = require('advanced-command-handler');
module.exports = new Command({
    name: 'voicemove',
    description: 'Move all members to a voice channel | Déplacer tout les membres dans un salon vocal',
    // Optionnals :
    usage: '!voicemove',
    category: 'moderation',
    aliases: ['vm'],
    clientPermissions: ['ADMINISTRATOR'],
    cooldown: 5
}, async(client, message, args) => {
    const color = message.guild.color
    
    message.member.voice.channel.join().then(m => { 
        message.channel.send(lang.voicemove.success(message.author));
        setTimeout(() => {
            message.member.voice.channel.leave()
            }, 120000);
        })

});

embedsColor(guildEmbedColor);
StateManager.on('ownerUpdate', (guildId, data) =>{
    guildOwner.set(guildId, data);
  })
  StateManager.on('ownerFetched', (guildId, data) =>{
    guildOwner.set(guildId, data);
  
  })
