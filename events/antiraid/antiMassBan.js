const Event = require('../../structures/Handler/Event');
const { Logger } = require('advanced-command-handler')

module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildBanAdd',
        });
    }
    async run(client, guild, user){
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guild.color;
        const antiraidConfig = guild.antiraid;
        let {antiraidLog} = guild.logs;
        let {logs} = client.lang(guild.lang)
        const isOn = antiraidConfig.enable["antiMassBan"];
        if(!isOn) return;
        let action = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id)  return Logger.log(`No sanction oneforall`, `MassBAN`, 'pink');
        if(guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `MassBAN`, 'pink');

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass["antiMassBan"];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const banLimit = antiraidConfig.config["antiMassBanLimit"]
            const member = guild.members.cache.get(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)

            if(!guild.antiraidLimit.has(action.executor.id)){
                await guild.updateAntiraidLimit(action.executor.id, 0, 1, 0);

            }
            const { deco, ban, kick } = guild.antiraidLimit.get(action.executor.id)

            if(ban < banLimit){
                await guild.updateAntiraidLimit(action.executor.id, deco, ban+1, kick);
                if(logsChannel && !logsChannel.deleted){
                    logsChannel.send(logs.targetExecutorLogs("ban", member, action.target, color, `${ban + 1 === banLimit ? `Aucun ban restant` : `${ban+1}/${banLimit}`} before sanction`))
                }
            }else{
                let sanction = antiraidConfig.config["antiMassBan"];


                if (member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                    if (sanction === 'ban') {
                        await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : antiMassBan'})
                    } else if (sanction === 'kick') {
                        guild.member(action.executor.id).kick(
                            `OneForAll - Type: antiMassBan `
                        )
                    } else if (sanction === 'unrank') {
                        let roles = []
                        await guild.member(action.executor.id).roles.cache
                            .map(role => roles.push(role.id))

                        await guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: antiMassBan`)
                        if (action.executor.bot) {
                            let botRole = member.roles.cache.filter(r => r.managed)


                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            await botRole.setPermissions(0, `OneForAll - Type: antiMassBan`)
                        }
                    }
                    if(logsChannel && !logsChannel.deleted){
                        logsChannel.send(logs.targetExecutorLogs("ban", member, action.target, color, sanction))
                    }
                    await guild.updateAntiraidLimit(action.executor.id, deco, 0, kick)

                }else{
                    if(logsChannel && !logsChannel.deleted){
                        logsChannel.send(logs.targetExecutorLogs("ban", member, action.target, color, "Je n'ai pas assé de permissions"))
                    }
                    await guild.updateAntiraidLimit(action.executor.id, deco, 0, kick)

                }
            }


        }
    }
}