module.exports = {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        if (!member.user.bot) return
        const guild = member.guild;
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color');
        const antiraidConfig = guildData.get('antiraid');
        let antiraidLog = guildData.get('logs').antiraid
        let {logs} = guildData.lang
        const isOn = antiraidConfig.enable["antiBot"];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: "BOT_ADD"}).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return client.Logger.log(`No sanction oneforall`, `BOT ADD`, 'pink');
        if (guild.ownerId === action.executor.id) return client.Logger.log(`No sanction crown`, `BOT ADD`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass["antiBot"];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `BOT ADD`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const executor = await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)
            if (!guild.me.permissions.has("KICK_MEMBERS")) {
                if (channel && !channel.deleted) {
                    channel.send({
                        embeds: [logs.botAdd(executor, member.user.username, member.id, color, "Je n'ai pas assé de permissions")]
                    })
                }
                return
            } else {
                member.kick(`OneForAll - Type : BotAdd`)
            }


            let sanction = antiraidConfig.config['antiBot'];
            if (sanction === 'ban') {
                await guild.members.ban(action.executor.id, {reason: `OneForAll - Type : BotAdd`})
            } else if (sanction === 'kick') {
                await executor.kick(
                    `OneForAll - Type: BotAdd `
                )
            } else if (sanction === 'unrank') {

                await executor.roles.set(client.functions.getRoleWithoutSensiblePermissions(executor.roles.cache), `OneForAll - Type: BotAdd`)
                if (action.executor.bot) {
                    await executor.roles.botRole.setPermissions([], `OneForAll - Type: BotAdd `)
                }
            }

            if (channel && !channel.deleted) {

                channel.send({
                    embeds: [logs.botAdd(executor, member.user.username, member.id, color, sanction)]
                })
            }


        }
    }
}