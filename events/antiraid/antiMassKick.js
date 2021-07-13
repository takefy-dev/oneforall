const Event = require('../../structures/Handler/Event');
const { Logger } = require('advanced-command-handler')

module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildMemberRemove',
        });
    }
    async run(client, member){
        const guild = member.guild;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color');
        const antiraidConfig = guildData.get('antiraid');
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang
        const isOn = antiraidConfig.enable["antiKick"];
        if(!isOn) return;
        let action = await guild.fetchAuditLogs({type: "MEMBER_KICK"}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        if(diff >= 600) return
        if (action.executor.id === client.user.id)  return Logger.log(`No sanction oneforall`, `masskick`, 'pink');
        if(guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `masskick`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const kickLimit = antiraidConfig.config["antiKickLimit"]
            const member = await guild.members.resolve(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)
            const userData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`)
            const antiraidLimit = userData.get('antiraidLimit')
            if(!antiraidLimit.kick){
                antiraidLimit.kick +=1
            }


            if(antiraidLimit.kick < kickLimit){
                antiraidLimit.kick +=1
                if(logsChannel && !logsChannel.deleted){
                    logsChannel.send(logs.targetExecutorLogs("kick", member, action.target, color, `${antiraidLimit.kick + 1 === kickLimit ? `Aucun kick restant` : `${antiraidLimit.kick+1}/${kickLimit}`} before sanction`))
                }
            }else{
                let sanction = antiraidConfig.config["antiKick"];


                if (member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                    if (sanction === 'ban') {
                        await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : antiMassKick'}).then(async () => antiraidLimit.kick = 0)
                    } else if (sanction === 'kick') {
                       member.kick(
                            `OneForAll - Type: antiMassKick `
                        ).then(async () => antiraidLimit.kick = 0)
                    } else if (sanction === 'unrank') {
                        let roles = []
                        await member.roles.cache
                            .map(role => roles.push(role.id))

                        member.roles.remove(roles, `OneForAll - Type: antiMassKick`).then(async () => antiraidLimit.kick = 0)
                        if (action.executor.bot) {
                            let botRole = member.roles.cache.filter(r => r.managed)


                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            await botRole.setPermissions(0, `OneForAll - Type: antiMassKick`)
                        }
                    }
                    if(logsChannel && !logsChannel.deleted){
                        logsChannel.send(logs.targetExecutorLogs("kick", member, action.target, color, sanction))
                    }

                }else{
                    if(logsChannel && !logsChannel.deleted){
                        logsChannel.send(logs.targetExecutorLogs("kick", member, action.target, color, "Je n'ai pas assé de permissions"))
                    }
                    antiraidLimit.kick = 0

                }
            }
            userData.save()


        }
    }
}