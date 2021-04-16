const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'kick',
    description: 'Kick a member | Kick un membre',
    // Optionnals :
    usage: '!kick <mention/id>',
    tags : ['guildOnly'],
    category: 'moderation',
    userPermissions: ['KICK_MEMBERS'],
    clientPermissions: ['KICK_MEMBERS'],
    cooldown: 2
}, async(client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    let member = message.mentions.members.first() ||message.guild.members.cache.get(args[0]);
    if(member == message.member) return message.channel.send()
    if(!member) return message.channel.send(lang.kick.noKick)
    if(member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) return message.channel.send(lang.errorRl(member.user.tag))

    let reason = args[1];
    if(!reason) reason = lang.kick.noReason;

  

    member.kick().then(() =>{
        message.channel.send(lang.kick.success(member));
    }).catch(()=>{
        message.channel.send(lang.kick.error(member));
    })
    
});


embedsColor(guildEmbedColor);
langF(guildLang);
