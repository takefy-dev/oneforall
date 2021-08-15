
module.exports =  {
    name: 'channelUpdate',
    run: async (client, oldChannel, newChannel) => {
        let {guild} = oldChannel;

        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color')
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang


        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable['channelUpdate'];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: "CHANNEL_UPDATE"}).then(async (audit) => audit.entries.first());

        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction

        if (action.executor.id === client.user.id) return client.Logger.log(`No sanction oneforall`, `channelUpdate`, 'pink');
        if (guild.ownerId === action.executor.id) return client.Logger.log(`No sanction crown`, `channelUpdate`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass['channelUpdate'];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return client.Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL DELETE`, 'pink');
        if (diff <= 1000) {

            if (isWlBypass && !isWl || !isWlBypass) {
                const member = await guild.members.fetch(action.executor.id)
                const channel = guild.channels.cache.get(antiraidLog)
                try {
                    oldChannel.edit({
                        type: oldChannel.type,
                        name: oldChannel.name,
                        nsfw: oldChannel.nsfw,
                        topic: oldChannel.topic,
                        bitrate: oldChannel.bitrate,
                        position: oldChannel.rawPosition,
                        parentId: oldChannel.parentId,
                        userLimit: oldChannel.userLimit,
                        manageable: oldChannel.manageable,
                        rateLimitPerUser: oldChannel.rateLimitPerUser
                    }, `OneForAll - Type : channelUpdate`)
                } catch (e) {
                    if (e.toString().toLowerCase().includes('missing permissions')) {
                        if (channel) {
                            channel.send({embeds : [logs.edtionRole(member, oldChannel.id, oldChannel.name, newChannel.name, color, "Je n'ai pas assé de permissions")]})

                        }
                    }
                }

                let sanction = antiraidConfig.config['channelUpdate'];

                if (member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                    if (sanction === 'ban') {
                        await guild.members.ban(action.executor.id, `OneForAll - Type : channelUpdate`)
                    } else if (sanction === 'kick') {
                        await member.kick(
                            `OneForAll - Type: channelUpdate `
                        )
                    } else if (sanction === 'unrank') {
                        await member.roles.set(client.functions.getRoleWithoutSensiblePermissions(member.roles.cache), `OneForAll - Type: channelUpdate`)
                        if (action.executor.bot) {
                            await member.roles.botRole.setPermissions([], `OneForAll - Type: channelUpdate `)
                        }
                    }

                    if (channel && !channel.deleted) {
                        channel.send({embeds : [logs.edtionRole(member, newChannel.id, oldChannel.name, newChannel.name, color, sanction)]})
                    }

                } else {


                    if (channel && !channel.deleted) {
                        channel.send({embeds : [logs.edtionRole(member, newChannel.id, oldChannel.name, newChannel.name, color, "Je n'ai pas assé de permissions")]})

                    }

                }


            }
        }


    }
}
