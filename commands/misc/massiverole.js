const Discord = require('discord.js')
const guildEmbedColor = new Map();
const ms = require('ms')
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const prettyMilliseconds = require('pretty-ms');
const guildLang = new Map();
var langF = require('../../function/lang')
const timer = new Map();
let member = new Map();
let counts = new Map();
let done = new Map();
module.exports = new Command({
    name: 'massrole',
    description: "Add / Remove a role to all members in a server | Permet d'ajouter / enlver un rôle a tout les membres d'un serveur",
    // Optionnals :
    usage: '!massrole < add / remove> <role>',
    category: 'misc',
    tags : ['guildOnly'],
    aliases: ['roleall', 'allrole'],
    userPermissions: ["MANAGE_ROLES"],
    clientPermissions: ["MANAGE_ROLES"],
    cooldown: 5
}, async (client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)
    const color = guildEmbedColor.get(message.guild.id)
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

    if (!client.isGuildOwner(message.guild.id, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    if(role){
        if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MANAGE_ROLES")) return message.channel.send(lang.massrole.highPermRole(role.name))

    }
    const add = args[0] == 'add';
    const remove = args[0] == 'remove'
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
                        .setAuthor(`Informations Massrole`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setColor(`${color}`)
            .setTimestamp()
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter("Massrole", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .addField('<:invite_oeople:785494680904138763> MassRole:', `[\`massrole add\`](https://discord.gg/WHPSxcQkVk) ・ Ajout de rôle à tout le monde\n[\`massrole remove\`](https://discord.gg/WHPSxcQkVk) ・ Suppression de rôle en masse`)
        message.channel.send(embed)
    }
    if (!role) return message.channel.send(lang.massrole.errorNoRl);
    if (add) {
        await message.guild.members.fetch().then((members) =>{
            member.set(message.guild.id, members.filter(member => member.roles.highest.comparePositionTo(message.guild.me.roles.highest) <= 0 && !member.roles.cache.has(role.id))) 
        })
        
        if (member.get(message.guild.id).size == 0) return message.channel.send(lang.massrole.errorRlAlready(role))
        var timeLeft = ms(`${member.get(message.guild.id).size}s`)
        const embed = new Discord.MessageEmbed()
        .setTitle(lang.massrole.title(role, member.get(message.guild.id).size))
        .setDescription(lang.massrole.descriptionTimeLeft(timeLeft))
        .setColor(`${color}`)
        .setFooter(client.user.tag)
        .setTimestamp();
        const msg = await message.channel.send(embed)
       
      
        counts.set(message.guild.id, 0)
        done.set(message.guild.id, 0)

       
        member.get(message.guild.id).forEach((members) => {
            const adding = setTimeout(async () => {
                if(done.has(message.guild.id)){
                    members.roles.add(role, `Massrole add all par ${message.author.username}`).then(() =>{
                        const addD = done.get(message.guild.id) + 1
                        if(member.has(message.guild.id)){
                            done.set(message.guild.id, addD)

                        }
                        
                    })
                    if(done.get(message.guild.id) == member.get(message.guild.id).size - 1) {
    
                       message.channel.send(lang.massrole.successAdd(role, member.get(message.guild.id).size))
                       counts.delete(message.guild.id)
                       done.delete(message.guild.id)
                       member.delete(message.guild.id)
                       timer.set(message.guild.id, true)
                        return clearTimeout(adding);
                    } 
                    
                }
               
            }, counts.get(message.guild.id) * 1200)
            const addC = counts.get(message.guild.id) + 1
            counts.set(message.guild.id,  addC)
        })
        
    

        //
        setTimeout(async () => {
            timer.delete(message.guild.id)
        },1.8e+6)
        // var inter = setInterval(addRole, 1000);
        // function stopInt() {
        //     clearTimeout(inter);
        //     message.channel.send(lang.massrole.successAdd(role, member))
        // }
    }  else if (remove) {
        await message.guild.members.fetch().then((members) =>{
            member.set(message.guild.id, members.filter(member => member.roles.highest.comparePositionTo(message.guild.me.roles.highest) <= 0 && member.roles.cache.has(role.id))) 
        })
        
        if (member.get(message.guild.id).size == 0) return message.channel.send(lang.massrole.errorRlNot(role))
        var timeLeft = ms(`${member.get(message.guild.id).size}s`)
        const embed = new Discord.MessageEmbed()
        .setTitle(lang.massrole.titleRm(role, member.get(message.guild.id).size))
        .setDescription(lang.massrole.descriptionTimeLeft(timeLeft))
        .setColor(`${color}`)
        .setFooter(client.user.tag)
        .setTimestamp();
        const msg = await message.channel.send(embed)
       
      
        counts.set(message.guild.id, 0)
        done.set(message.guild.id, 0)

       
        member.get(message.guild.id).forEach((members) => {
            const adding = setTimeout(async () => {
                if(done.has(message.guild.id)){
                    members.roles.remove(role, `Massrole remove all par ${message.author.username}`).then(() =>{
                        const addD = done.get(message.guild.id) + 1
                        if(member.has(message.guild.id)){
                            done.set(message.guild.id, addD)

                        }
                        
                    })
                    if(done.get(message.guild.id) == member.get(message.guild.id).size - 1) {
    
                       message.channel.send(lang.massrole.successRemove(role, member.get(message.guild.id).size))
                       counts.delete(message.guild.id)
                       done.delete(message.guild.id)
                       member.delete(message.guild.id)
                       timer.set(message.guild.id, true)
                        return clearTimeout(adding);
                    } 
                    
                }
               
            }, counts.get(message.guild.id) * 1200)
            const addC = counts.get(message.guild.id) + 1
            counts.set(message.guild.id,  addC)
        })
        
    

        //
        setTimeout(async () => {
            timer.delete(message.guild.id)
        },1.8e+6)
        // var inter = setInterval(addRole, 1000);
        // function stopInt() {
        //     clearTimeout(inter);
        //     message.channel.send(lang.massrole.successAdd(role, member))
        // }


    }else if(args[0] == 'status'){
    
        if(!done.has(message.guild.id) || !member.has(message.guild.id)) return message.channel.send(lang.nickall.noMassrole) 
        var timeLeft = ms(`${member.get(message.guild.id).size - done.get(message.guild.id)}s`)
        const status = new Discord.MessageEmbed()
        .setTitle('Status')
        .setDescription(lang.descriptionTimeLeft(timeLeft))
        .setColor(`${color}`)
        .setFooter(client.user.username)    
        .setTimestamp()
        message.channel.send(status)
    }





});

embedsColor(guildEmbedColor);
langF(guildLang);
