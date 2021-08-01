module.exports = {

    name: 'inviterole',
    description: "Add role when member reach certain amount of invites | Ajouter un role quand un membre atteind un certain nombre d'invite",
    category: 'invite',
    usage: 'inviterole <add/remove/list/cumul> <role/on/off> <amountInvite/>',
    aliases: ['roleinvite'],
    userPermissions: ['ADMINISTRATOR'],
    guildOwnerOnly: true,
    cooldown: 4,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        let inviteData = guildData.get('invite');
        let {inviteRole, cumulRoles} = inviteData
        const lang = guildData.lang
        const color = guildData.get('color')
        if (args[0] === 'list') {
            return message.channel.send({
                embeds: [lang.inviteRole.listEmbed(inviteRole).setColor(color).setFooter(client.user.username, message.author.displayAvatarURL({dynamic: true}))]
            })
        }
        if (args[0] === 'cumul') {
            if (args[1] !== 'on' && args[1] !== 'off') return message.channel.send(lang.inviteRole.noOnOff).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 3500)
            })
            cumulRoles = args[1] === 'on'
            guildData.set('invite', {...inviteData, inviteRole, cumulRoles}).save()

            return message.channel.send(lang.inviteRole.successCumul(args[1]))

        }
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        const invite = args[2];
        if (!role) return message.channel.send(lang.inviteRole.noRole).then((mp) => {
            setTimeout(() => {
                mp.delete()
            }, 3500)
        })

        if (args[0] === "add") {
            const alreadyExist = inviteRole.find(inv => inv.role === role.id);
            if (alreadyExist) return message.channel.send(lang.inviteRole.alreadyExist).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 3500)
            })
            if (!invite) return message.channel.send(lang.inviteRole.noInvite).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 3500)
            })
            if (isNaN(invite) || invite <= 0) return message.channel.send(lang.inviteRole.notNumber).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 3500)
            })
            if (role.managed) {
                const replyMsg = await message.channel.send(lang.reactionRole.managedRole);
                return setTimeout(async () => {
                    await replyMsg.delete();
                }, 2000)
            }
            if (client.functions.roleHasSensiblePermissions(role.permissions)) {
                const replyMsg = await message.channel.send(lang.reactionRole.tryToPermsRole);
                const raidLog = guildData.get('logs').antiraid;
                const raidLogChannel = message.guild.channels.cache.get(raidLog);
                if (raidLogChannel && !raidLogChannel.deleted) {
                    raidLogChannel.send('@everyone', lang.logs.reactRolePerm(message.member, color, message.id, `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`))
                }
                return setTimeout(async () => {
                    await replyMsg.delete();
                }, 2000)
            }
            inviteRole.push({role: role.id, invite: parseInt(invite)})
            message.channel.send(lang.inviteRole.success(role, invite))

        }
        if (args[0] === "remove") {
            const alreadyExist = inviteRole.find(inv => inv.role === role.id);
            if (!alreadyExist) return message.channel.send(lang.inviteRole.doestNotExist).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 3500)
            })
            inviteRole = inviteRole.filter(inv => inv.role !== role.id)
            message.channel.send(lang.inviteRole.successRm(role))
        }
        guildData.set('invite', {...inviteData, inviteRole, cumulRoles}).save()


    }
}