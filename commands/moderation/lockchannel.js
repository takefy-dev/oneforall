const Discord = require('discord.js');
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
var checkSetup = require('../../function/check/checkSetup');
const guildMemberRole = new Map();
const guildLang = new Map();
var langF = require('../../function/lang')
const {Command} = require('advanced-command-handler');
module.exports = new Command({
    name: 'lock',
    description: 'Lock one or multiple channels | Fermer un ou plusieurs salons',
    // Optionnals :
    usage: '!lock <on / off / all> <on / off>',
    tags: ['guildOnly'],
    category: 'moderation',
    userPermissions: ['MANAGE_CHANNELS'],
    clientPermissions: ['MANAGE_CHANNELS'],
    cooldown: 3,
    
}, async(client, message, args) => {
    this.connection = StateManager.connection;
    const lang = require(`../../lang/${message.guild.lang}`);
    
    // if(!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send("<:720681441670725645:780539422479351809> \`ERREUR\` Vous n'avez pas la permission requise \`MANAGE_CHANNELS\`")
    let isSetup = checkSetup(message.guild.id);
    if(!isSetup) return message.channel.send(lang.error.noSetup)
    const lockAllOn = args[0] == 'all' && args[1] == "on";
    const lockAllOff =  args[0] == 'all' && args[1] == "off";
    const on = args[0] == 'on';
    const off = args[0] == 'off';
    const color = guildEmbedColor.get(message.guild.id)

    const channels = message.guild.channels.cache.filter(ch => ch.type != 'category')
    const ch = message.channel
    
    if(!args[0]){
        const hEmbed = new Discord.MessageEmbed()
            .setAuthor(`Informations lock`, `https://images-ext-2.discordapp.net/external/1jym0uCwurjteTPUodKOyFbBriTlwJyS56xk9hDjo2s/https/images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%253Fwidth%253D588%2526height%253D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setDescription(`[\`lock on\`](https://discord.gg/WHPSxcQkVk), [\`lock off\`](https://discord.gg/WHPSxcQkVk), [\`lock all on\`](https://discord.gg/WHPSxcQkVk), [\`lock all off\`](https://discord.gg/WHPSxcQkVk)`)
            .setFooter(`Informations lock`, `https://images-ext-2.discordapp.net/external/1jym0uCwurjteTPUodKOyFbBriTlwJyS56xk9hDjo2s/https/images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%253Fwidth%253D588%2526height%253D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setColor(color)
            .setTimestamp();
        return message.channel.send(hEmbed)
    }
    const memberRole = message.guild.roles.cache.get(guildMemberRole.get(message.guild.id));
    if(lockAllOn){
        channels.forEach(channel =>{
            channel.updateOverwrite(memberRole,{
                SEND_MESSAGES : false
            })

        })
        message.channel.send(lang.lock.successLockAll)


      
    }else if(lockAllOff){
        channels.forEach(channel =>{
            channel.updateOverwrite(memberRole,{
                SEND_MESSAGES : true
            })

        })
        message.channel.send(lang.lock.successOpenAll)

    }else if(on){
        ch.updateOverwrite(memberRole,{
            SEND_MESSAGES : false
        }).then(() =>{
            message.channel.send(lang.lock.successLock)
        })
    }else if(off){
        ch.updateOverwrite(memberRole,{
            SEND_MESSAGES : true
        }).then(() =>{
            message.channel.send(lang.lock.successOpen)
        })
    }
});

StateManager.on('addMemberRole', (guildId, memberRole) =>{
    guildMemberRole.set(guildId, memberRole)
});

StateManager.on('memberRoleFetched', (guildId, memberRole) =>{
    guildMemberRole.set(guildId, memberRole)
});
embedsColor(guildEmbedColor);
langF(guildLang);
