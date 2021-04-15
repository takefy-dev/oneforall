const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const checkPermissionRole = (role) => role.permissions.has('ADMINISTRATOR') || role.permissions.has('KICK_MEMBERS') || role.permissions.has('BAN_MEMBERS') || role.permissions.has('MANAGE_GUILD') || role.permissions.has('MANAGE_CHANNELS');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'role',
    description: 'Add / Remove a role of a member | Ajouter ou enlever un role a un membre',
    // Optionnals :
    usage: '!role <add / remove > <role> <mention / id>',
    category: 'misc',
    tags : ['guildOnly'],
    userPermissions: ['MANAGE_ROLES'],
    aliases: ['rl'],
    clientPermissions: ['MANAGE_ROLES'],
    cooldown: 2
}, async(client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)

    const add = args[0] == 'add';
        const remove = args[0] == 'remove';
        // if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("<:720681441670725645:780539422479351809> \`ERREUR\` Vous n'avez pas la permission requise \`MANAGER_ROLES\`");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
        if(role == undefined) return message.channel.send("Le rôle spécifié n'existe pas.")
        if(role.comparePositionTo(message.member.roles.highest) >= 0) return message.reply(`<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas ajouter le rôle **\`${role.name}\`** à **\`${member.user.tag}\`** car vos permissions sont plus basses que ce rôle`)
        if(add && !member) return message.channel.send("<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez specifier un membre à ajouter le rôle")
        if(add && member && !role) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez specifier un rôle à ajouter à ${membre}`)
        if(member.user.id == message.author.id) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas vous ajoutez vous même le rôle (${role})`)
        if(!args[0]){
 const hEmbed = new Discord.MessageEmbed()
            .setAuthor(lang.role.author, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setColor(`${color}`)
            .setTimestamp()
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter(lang.role.author, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .addField('<:778353230559969320:780778719824183316> Rôle:', `[\`role add\`](https://discord.gg/WHPSxcQkVk), [\`role remove\`](https://discord.gg/WHPSxcQkVk)`)
      message.channel.send(hEmbed); 
        }else if(add){
            if(member.roles.cache.has(role.id)) return message.channel.send(lang.role.errorAlreadyRl(member, role))
            member.roles.add(role).then(() =>{
                message.channel.send(lang.role.successAdd(member, role))
            }).catch((err) =>{
                console.log(err)
                message.channel.send(lang.role.errorCantRm(member))
            })
        }else if(remove){
            if(!member.roles.cache.has(role.id)) return message.channel.send(lang.errorNoRl(member, role))
            member.roles.remove(role).then(() =>{
                message.channel.send(lang.role.successRemove(member, role))
            }).catch((err) =>{
                console.log(err)
                message.channel.send(lang.role.error(member))
            })
        }
});



embedsColor(guildEmbedColor);
langF(guildLang);
