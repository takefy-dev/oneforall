const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");
module.exports = class guildUpdate extends Event {
    constructor() {
        super({
            name: 'guildUpdate',
        });
    }

    async run(client, oldGuild, newGuild) {

        if (!oldGuild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(oldGuild.id)
        const color = guildData.get('color')
        let {antiraidLog} = guildData.get('logs').antiraid;
        let {logs} = guildData.lang


        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable["nameUpdate"];
        if (!isOn) return;
        let action = await oldGuild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());
        if(action.changes[0].key !== "name") return;
        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `${this.name}`, 'pink');
        if (oldGuild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `${this.name}`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass["nameUpdate"];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `oldGuild owner list or bot owner`}`, `CHANNEL DELETE`, 'pink');
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
                        channel.send(logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, "Je n'ai pas assé de permissions"))
                    }

                }
            }

            let sanction = antiraidConfig.config["nameUpdate"];


            if (member.roles.highest.comparePositionTo(oldGuild.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await oldGuild.members.ban(action.executor.id, {reason: `OneForAll - Type: guildUpdate - changeName`})


                } else if (sanction === 'kick') {
                    member.kick(
                        `OneForAll - Type: guildUpdate - changeName`
                    )


                } else if (sanction === 'unrank') {

                    let roles = []
                    await member.roles.cache
                        .map(role => roles.push(role.id))

                    await member.roles.remove(roles, `OneForAll - Type: guildUpdate - changeName`)
                    if (action.executor.bot) {
                        let botRole = member.roles.cache.filter(r => r.managed)


                        for (const [id] of botRole) {
                            botRole = oldGuild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0, `OneForAll - Type: guildUpdate - changeName`)
                    }


                }


                if(channel && !channel.deleted){
                    channel.send(logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, sanction))
                }

            } else {

                if(channel && !channel.deleted){
                    channel.send(logs.guildNameUpdate(member, oldName, newName, oldGuild.id, color, "Je n'ai pas assé de permissions"))
                }
            }
        }
    }
}
