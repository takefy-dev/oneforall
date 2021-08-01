const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')

module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildBanAdd',
        });
    }

    async run(client, guild, user) {
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color');
        const antiraidConfig = guildData.get('antiraid');
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.get('logs')
        const isOn = antiraidConfig.enable["antiMassBan"];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `MassBAN`, 'pink');
        if (guild.ownerId
 === action.executor.id) return Logger.log(`No sanction crown`, `MassBAN`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass["antiMassBan"];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const banLimit = antiraidConfig.config["antiMassBanLimit"]
            const member = await guild.members.fetch(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)
            const userData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`)
            const antiraidLimit = userData.get('antiraidLimit')
            if (!antiraidLimit.ban) {
                antiraidLimit.ban += 1
            }

            if (antiraidLimit.ban < banLimit) {
                antiraidLimit.ban += 1
                if (logsChannel && !logsChannel.deleted) {
                    logsChannel.send({embeds : [logs.targetExecutorLogs("ban", member, action.target, color, `${antiraidLimit.ban + 1 === banLimit ? `Aucun ban restant` : `${antiraidLimit.ban + 1}/${banLimit}`} before sanction`)]})
                }
            } else {
                let sanction = antiraidConfig.config["antiMassBan"];


                if (member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                    if (sanction === 'ban') {
                        await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : antiMassBan'})
                    } else if (sanction === 'kick') {
                     await member.kick(
                         `OneForAll - Type: antiMassBan `
                     )
                    } else if (sanction === 'unrank') {
                        await member.roles.set(client.functions.getRoleWithoutSensiblePermissions(member.roles.cache), `OneForAll - Type: antiMassBan`)
                        if (action.executor.bot) {
                            let botRole = member.roles.cache.filter(r => r.managed)


                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            await botRole.setPermissions(0, `OneForAll - Type: antiMassBan`)
                        }
                    }
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send({embeds: [logs.targetExecutorLogs("ban", member, action.target, color, sanction)]})
                    }
                    antiraidLimit.ban = 0

                } else {
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send({embeds : [logs.targetExecutorLogs("ban", member, action.target, color, "Je n'ai pas assé de permissions")]})
                    }
                    antiraidLimit.ban = 0

                }
            }
            userData.save()

        }
    }
}