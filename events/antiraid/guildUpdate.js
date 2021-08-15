module.exports ={
    name: 'guildUpdate',
    run: async (client, oldGuild, newGuild) => {

        if (!oldGuild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(oldGuild.id)
        const color = guildData.get('color')
        let {antiraidLog} = guildData.get('logs').antiraid;
        let {logs} = guildData.lang


        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable["nameUpdate"];
        if (!isOn) return;
        let action = await oldGuild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());
        if(action.changes[0].key !== "name") return;
        if (action.executor.id === client.user.id) return client.Logger.log(`No sanction oneforall`, `nameUpdate`, 'pink');
        if (oldGuild.ownerId
 === action.executor.id) return client.Logger.log(`No sanction crown`, `nameUpdate`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass["nameUpdate"];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return client.Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `oldGuild owner list or bot owner`}`, `CHANNEL DELETE`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const member = await oldGuild.members.fetch(action.executor.id)
            const channel = oldGuild.channels.cache.get(antiraidLog)
            const oldName = action.changes[0].old;
            const newName = action.changes[0].new
            try {
                await oldGuild.setName(oldName, `OneForAll - Type: guildUpdate - changeName`)
            } catch (e) {

                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if(channel && !channel.deleted){
                        channel.send({embeds : [logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, "Je n'ai pas assé de permissions")]})
                    }

                }
            }

            let sanction = antiraidConfig.config["nameUpdate"];


            if (member.roles.highest.comparePositionTo(oldGuild.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await oldGuild.members.ban(action.executor.id, {reason: `OneForAll - Type: guildUpdate - changeName`})


                } else if (sanction === 'kick') {
                    await member.kick(
                        `OneForAll - Type: guildUpdate - changeName`
                    )


                } else if (sanction === 'unrank') {

                    await member.roles.set(client.functions.getRoleWithoutSensiblePermissions(member.roles.cache), `OneForAll - Type: guildUpdate - changeName`)
                    if (action.executor.bot) {
                        await member.roles.botRole.setPermissions([], `OneForAll - Type: guildUpdate - changeName`)
                    }


                }


                if(channel && !channel.deleted){
                    channel.send({embeds : [logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, sanction)]})
                }

            } else {

                if(channel && !channel.deleted){
                    channel.send({embeds : [logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, "Je n'ai pas assé de permissions")]})
                }
            }
        }
    }
}
