const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
const { Command, getThing } = require('advanced-command-handler');
var count = new Map();
const countGuild = new Map();
var checkOwner = require('../../function/check/botOwner');
const guildLang = new Map();
var logsChannelF = require('../../function/fetchLogs');
const logsChannelId = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'ban',
    description: 'Ban a user from the server | Bannir un membre du serveur',
    // Optionnals :
    usage: '!ban <mention / id> [reason]',
    category: 'moderation',
    tags: ['guildOnly'],
    userPermissions: ['BAN_MEMBERS'],
    clientPermissions: ['BAN_MEMBERS'],
    cooldown: 2
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)
    const color = guildEmbedColor.get(message.guild.id);

    const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(async err => {
        return await message.channel.send(lang.ban.noBan).then(mp => mp.delete({ timeout: 4000 }));
    })
    if (user.id === message.author.id) {
        return await message.channel.send(lang.ban.errorBanSelf).then(mp => mp.delete({ timeout: 4000 }));
    }
    // const banned = await message.guild.fetchBans();
    // if(banned.some((m) => m.user.id === user.id)){
    //     return message.channel.send(lang.ban.alreadyBan(user)).then(mp => mp.delete({ timeout: 4000}))
    // }

    let reason = args.slice(1).join(" ");
    if (!reason) {
        reason = `Ban par ${message.author.tag}`
    }

    const member = await message.guild.members.fetch(user.id).catch(() => { });
    if (member) {
        const memberPosition = member.roles.highest.position;
        const moderationPosition = message.member.roles.highest.position;
        if (message.guild.ownerID !== message.author.id && !(moderationPosition > memberPosition) && !client.isOwner(message.author.id)) {
            return message.channel.send(lang.ban.errorRl(user)).then(mp => mp.delete({ timeout: 4000 }));
        }
        if (!member.bannable) {
            return message.channel.send(lang.ban.errorRl(user)).then(mp => mp.delete({ timeout: 4000 }));
        }
    }

    await user.createDM().then((dm) => {
        dm.send(lang.ban.dm(message.guild.name, message.author.username)).then(() => {
            user.deleteDM()
        }).catch(() => {});
        
    })
    
    
    

    message.guild.members.ban(user, {reason}).then(() => {

        let logChannel
        let logChannelId = logsChannelId.get(message.guild.id);
        if (logChannelId != undefined) {
            logChannel = message.guild.channels.cache.get(logChannelId)

        }

        const logsEmbed = new Discord.MessageEmbed()
            .setTitle("\`🚫\` Ajout d'un bannissement à un membre (commande)")
            .setDescription(`
        \`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a banni :\n
        \`\`\`${user.tag}\`\`\`
        `)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(`${color}`)
        if(logChannel != undefined){
            logChannel.send(logsEmbed)

        }
        message.channel.send(lang.ban.success(user));
    })

        .catch((err) => {
            console.log('err', err)
            if(err.toString().includes('Missing Permission'))  return message.channel.send(lang.error.MissingPermission)
            message.channel.send(lang.ban.error(user))
        })
});

embedsColor(guildEmbedColor);
logsChannelF(logsChannelId, 'mod');

langF(guildLang);
