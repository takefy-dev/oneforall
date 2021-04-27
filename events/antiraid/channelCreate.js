
const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')


module.exports = class channelCreate extends Event {
    constructor() {
        super({
            name: 'channelCreate',
        });
    }

    async run(client, channel) {
        let guild = channel.guild
        if (channel.type === "dm") return;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guild.color;
        const antiraidConfig = guild.antiraid;
        let {antiraidLog} = guild.logs;
        let {logs} = client.lang(guild.lang)
        const isOn = antiraidConfig.enable[this.name];
        if(!isOn) return;

        let action = await channel.guild.fetchAuditLogs({type: "CHANNEL_CREATE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id)  return Logger.log(`No sanction oneforall`, `CHANNEL Create`, 'pink');
        if(guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `CHANNEL Create`, 'pink');

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const member = guild.members.cache.get(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)

            try {
                channel.delete(`OneForall - Type : ${this.name}`)
            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if(logsChannel && !logsChannel.deleted){
                        logsChannel.send(logs.channelCreate(member, channel.name, channel.id, color, "Je n'ai pas assé de permissions"))
                    }
                }
            }

            let sanction = antiraidConfig.config[this.name];


            if (member.roles.highest.comparePositionTo(channel.guild.me.roles.highest) <= 0) {
                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : channelCreate'})
                } else if (sanction === 'kick') {
                    guild.member(action.executor.id).kick(
                        `OneForAll - Type: channelCreate `
                    )
                } else if (sanction === 'unrank') {
                    let roles = []
                    await guild.member(action.executor.id).roles.cache
                        .map(role => roles.push(role.id))

                    await guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: channelCreate`)
                    if (action.executor.bot) {
                        let botRole = member.roles.cache.filter(r => r.managed)


                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0, `OneForAll - Type: channelCreate`)
                    }
                }


                if(logsChannel && !logsChannel.deleted) logsChannel.send(logs.channelCreate(member, channel.name, channel.id, color, sanction))
            } else {

                if(logsChannel && !logsChannel.deleted){
                    logsChannel.send(logs.channelCreate(member, channel.name, channel.id, color, "Je n'ai pas assé de permissions"))
                }
            }
        }

    }
};

