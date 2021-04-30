const StateManager = require('../../utils/StateManager');
const logsChannelId = new Map();
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'ban',
            description: 'Ban a user from the server | Bannir un membre du serveur',
            usage: 'ban <mention / id> [reason]',
            category: 'moderation',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['BAN_MEMBERS'],
            cooldown: 5

        });
    }
    async run(client, message,args){


    this.connection = StateManager.connection;
    const lang = client.lang(message.guild.lang)
    const color = message.guild.color

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
        if(logChannel !== undefined){
            logChannel.send(logsEmbed)

        }
        message.channel.send(lang.ban.success(user));
    })

        .catch((err) => {
            console.log('err', err)
            if(err.toString().includes('Missing Permission'))  return message.channel.send(lang.error.MissingPermission)
            message.channel.send(lang.ban.error(user))
        })
}};

