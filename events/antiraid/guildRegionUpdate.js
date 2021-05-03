const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");

module.exports = class guildRegionUpdate extends Event {
    constructor() {
        super({
            name: 'guildRegionUpdate',
        });
    }

    async run(client, guild, oldRegion, newRegion) {

        const color = guild.color
        let {antiraidLog} = guild.logs;
        let {logs} = client.lang(guild.lang)


        const antiraidConfig = guild.antiraid;
        const isOn = antiraidConfig.enable["regionUpdate"];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());
        if (action.changes[0].key !== "name") return;
        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `${this.name}`, 'pink');
        if (guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `${this.name}`, 'pink');

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass["regionUpdate"];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL DELETE`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)

            try {
                await guild.setRegion(oldRegion, `OneForAll - Type: guildUpdate - changeRegion`)
            } catch (e) {

                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if (channel && !channel.deleted) {
                        channel.send(logs.changeRegion(member, oldRegion, newRegion, color, "Je n'ai pas assé de permissions"))
                    }
                }
            }

            let sanction = antiraidConfig.config["regionUpdate"];




            if (member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: "OneForAll - Type: guildUpdate - changeRegion"})


                } else if (sanction === 'kick') {
                    guild.member(action.executor.id).kick(
                        `OneForAll - Type: guildUpdate - changeRegion`
                    )


                } else if (sanction === 'unrank') {

                    let roles = []
                     await guild.member(action.executor.id).roles.cache
                        .map(role => roles.push(role.id))
                    await guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id).roles.remove(roles, `OneForAll - Type: guildUpdate - changeRegion`)
                    if (action.executor.bot) {
                        let botRole = member.roles.cache.filter(r => r.managed)

                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0, `OneForAll - Type: guildUpdate - changeRegion`)
                    }


                }


                if(channel && !channel.deleted){
                    channel.send(logs.changeRegion(member, oldRegion, newRegion, color, sanction))
                }

            } else {

                if (channel && !channel.deleted) {
                    channel.send(logs.changeRegion(member, oldRegion, newRegion, color, "Je n'ai pas assé de permissions"))
                }
            }
        }
    }
};

