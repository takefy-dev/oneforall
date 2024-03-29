module.exports =  {
    name: 'roleUpdate',
    run: async (client, oldRole, newRole) => {
        if (oldRole === newRole) return;
        const {guild} = oldRole;
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        if (oldRole.managed && newRole.managed) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color')
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang


        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable['roleUpdate'];
        if (!isOn) return;

        let action = await guild.fetchAuditLogs({type: "ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        console.log(diff)
        if (diff >= 500) return
        if (action.executor.id === client.user.id) return client.Logger.log(`No sanction oneforall`, `roleUpdate`, 'pink');
        if (guild.ownerId
 === action.executor.id) return client.Logger.log(`No sanction crown`, `roleUpdate`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass['roleUpdate'];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return client.Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL DELETE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const member = await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)

            try {
                await newRole.edit({
                    name: oldRole.name,
                    color: oldRole.hexColor,
                    hoist: oldRole.hoist,
                    position: oldRole.position,
                    permissions: oldRole.permissions,
                    mentionable: oldRole.mentionable
                }, `OneForAll - Type : roleUpdate`)

            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {

                    if (channel && !channel.deleted) {
                        channel.send({embeds : [logs.edtionRole(member, oldRole.id, oldRole.name, newRole.name, color, "Je n'ai pas assé de permissions")]})

                    }

                }

            }


            let sanction = antiraidConfig.config['roleUpdate'];

            if (member.roles.highest.comparePositionTo(oldRole.guild.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: `OneForAll - Type: roleUpdate `})
                } else if (sanction === 'kick') {
                    await member.kick(
                        `OneForAll - Type: roleUpdate `
                    )
                } else if (sanction === 'unrank') {
                    await member.roles.set(client.functions.getRoleWithoutSensiblePermissions(member.roles.cache), `OneForAll - Type: roleUpdate`)
                    if (action.executor.bot) {

                        await member.roles.botRole.setPermissions([], `OneForAll - Type: roleUpdate`)
                    }
                }


                if (channel && !channel.deleted) {
                    channel.send({embeds : [logs.edtionRole(member, oldRole.id, oldRole.name, newRole.name, color, sanction)]})
                }

            } else {
                if (channel && !channel.deleted) {
                    channel.send({embeds: [logs.edtionRole(member, oldRole.id, oldRole.name, newRole.name, color, "Je n'ai pas assé de permissions")]})

                }


            }
        }
    }

}



