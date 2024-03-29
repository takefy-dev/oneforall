const Discord = require('discord.js')

module.exports = {

    name: 'derank',
    description: "Remove all roles of a member | Enlever tout les rôles d'un membre",
    usage: 'derank <mention / id>',
    category: 'moderation',
    aliases: ['unrank'],
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['MANAGE_ROLES'],
    cooldown: 5,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const color = guildData.get('color')
        let member = await message.mentions.members.first() || await message.guild.members.resolve(args[0])
        if (!member) return message.channel.send(lang.derank.errorNoMember)
        if (member.user.id === client.user.id) return message.channel.send(lang.derank.errorUnrankMe)
        if (member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0 && message.guild.ownerId
            !== message.author.id) return message.channel.send(lang.derank.errorRl(member))
        if (member.user.id === message.author.id) return message.channel.send(lang.derank.errorUnrankSelf);
        let roles = []
        await member.roles.cache
            .map(role => roles.push(role.id))
        if (roles.length === 1) return message.channel.send(lang.derank.errorNoRl(member));
        member.roles.remove(roles, lang.derank.reason(message.member)).then(() => {
            let logChannelId = guildData.get('logs').mod
            if (logChannelId) {
                let logChannel = message.guild.channels.cache.get(logChannelId)
                const logsEmbed = new Discord.MessageEmbed()
                    .setTitle("\`❌\` Derank d'un membre")
                    .setDescription(`
					\`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a derank :\n
                    \`\`\`${member.user.tag} (${member.user.id})\`\`\`

					`)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                logChannel.send({embeds: [logsEmbed]})
            }
            return message.channel.send(lang.derank.success(member))
        })
    }
}
