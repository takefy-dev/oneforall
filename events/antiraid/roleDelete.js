module.exports =  {
    name: 'roleDelete',
    run: async (client, role)=> {
        if (role.managed) return;
        let guild = role.guild;
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color')
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang


        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable['roleDelete'];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: "ROLE_DELETE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return client.Logger.log(`No sanction oneforall`, `roleDelete`, 'pink');
        if (guild.ownerId
            === action.executor.id) return client.Logger.log(`No sanction crown`, `roleDelete`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass['roleDelete'];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return client.Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `ROLE_DELETE`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const member = await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)
            try {
                await guild.roles.create({
                    data: {
                        name: role.name,
                        color: role.hexColor,
                        hoist: role.hoist,
                        position: role.rawPosition,
                        permissions: role.permissions,
                        mentionable: role.mentionable
                    },
                    reason: `OneForAll - Type : roleDelete`
                })


            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {

                    if (channel && !channel.deleted) {
                        channel.send({embeds: [logs.roleDelete(member, role.name, role.id, color, "Je n'ai pas assé de permissions")]})
                    }


                }
            }

            let sanction = antiraidConfig.config['roleDelete'];

            if (member.roles.highest.comparePositionTo(role.guild.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: "OneForAll - Type : roleDelete"})
                } else if (sanction === 'kick') {
                    await member.kick(
                        `OneForAll - Type: roleDelete `
                    )
                } else if (sanction === 'unrank') {
                    await member.roles.set(client.functions.getRoleWithoutSensiblePermissions(member.roles.cache), `OneForAll - Type: roleDelete`)
                    if (action.executor.bot) {

                        await member.roles.botRole.setPermissions([], `OneForAll - Type: roleDelete`)
                    }
                }
                if (channel && !channel.deleted) {
                    channel.send({embeds: [logs.roleDelete(member, role.name, role.id, color, sanction)]})
                }
            } else {

                if (channel && !channel.deleted) {
                    channel.send({embeds: [logs.roleDelete(member, role.name, role.id, color, "Je n'ai pas assé de permissions")]})
                }
            }
        }
    }
}
