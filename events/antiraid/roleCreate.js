module.exports = {

    name: 'roleCreate',

    run: async (client, role) => {
        console.log('hiii')
        if (role.managed) return
        let guild = role.guild;
            console.log('1')

        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        console.log('2')

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color')
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang


        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable['roleCreate'];
        if (!isOn) return;
        console.log('3')

        let action = await guild.fetchAuditLogs({type: "ROLE_CREATE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return client.Logger.log(`No sanction oneforall`, `roleCreate`, 'pink');
        if (guild.ownerId
            === action.executor.id) return client.Logger.log(`No sanction crown`, `roleCreate`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass['roleCreate'];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return client.Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `ROLE_CREATEE`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const member = await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)
            try {
                role.delete(`OneForall - Type : roleCreate`);

            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {

                    if (channel && !channel.deleted) {
                        channel.send({embeds: [logs.roleCreate(member, role.name, role.id, color, "Je n'ai pas assé de permissions")]})
                    }


                }
            }

            let sanction = antiraidConfig.config['roleCreate'];

            if (member.roles.highest.comparePositionTo(role.guild.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: "OneForAll - Type : roleCreate"})
                } else if (sanction === 'kick') {
                    await member.kick(
                        `OneForAll - Type: roleCreate `
                    )
                } else if (sanction === 'unrank') {
                    await member.roles.set(client.functions.getRoleWithoutSensiblePermissions(member.roles.cache), `OneForAll - Type: roleCreate`)
                    if (action.executor.bot) {

                        await member.roles.botRole.setPermissions([], `OneForAll - Type: roleCreate`)
                    }
                }
                if (channel && !channel.deleted) {
                    channel.send({embeds: [logs.roleCreate(member, role.name, role.id, color, sanction)]})
                }
            } else {

                if (channel && !channel.deleted) {
                    channel.send({embeds: [logs.roleCreate(member, role.name, role.id, color, "Je n'ai pas assé de permissions")]})
                }
            }
        }
    }
}
