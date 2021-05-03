const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'voiceChannelLeave',
        });
    }

    async run(client, member, channel) {
        const guild = member.guild;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guild.color;
        const antiraidConfig = guild.antiraid;
        let {antiraidLog} = guild.logs;
        let {logs} = client.lang(guild.lang)
        const isOn = antiraidConfig.enable["antiDeco"];
        if (!isOn) return;
        let action = await member.guild.fetchAuditLogs({type: "MEMBER_DISCONNECT"}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        if (diff >= 600) return;

        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `Deco`, 'pink');
        if (guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `Deco`, 'pink');

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const decoLimit = antiraidConfig.config["antiDecoLimit"]
            const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)

            if (!guild.antiraidLimit.has(action.executor.id)) {
                await guild.updateAntiraidLimit(action.executor.id, 1, 0, 0).then(res => console.log(res))
            }
            let {deco, ban, kick} = guild.antiraidLimit.get(action.executor.id)
            deco += action.extra.count
            if (deco < decoLimit) {
                await guild.updateAntiraidLimit(action.executor.id, deco + 1, ban, kick);
                if (logsChannel && !logsChannel.deleted) {
                    logsChannel.send(logs.targetExecutorLogs("déconnecté", executor, member.user, color, `${deco + 1 === decoLimit ? `Aucune déconnexion restant` : `${deco + 1}/${decoLimit}`} before sanction`))
                }
            } else {
                let sanction = antiraidConfig.config["antiDeco"];


                if (executor.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                    if (sanction === 'ban') {
                        await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : antiDeco'}).then(async () => await guild.updateAntiraidLimit(action.executor.id, 0, ban, kick))
                    } else if (sanction === 'kick') {
                        guild.member(action.executor.id).kick(
                            `OneForAll - Type: antiDeco `
                        ).then(async () => await guild.updateAntiraidLimit(action.executor.id, 0, ban, kick))
                    } else if (sanction === 'unrank') {
                        let roles = []
                        await guild.member(action.executor.id).roles.cache
                            .map(role => roles.push(role.id))

                        await guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id).roles.remove(roles, `OneForAll - Type: antiDeco`).then(async () => await guild.updateAntiraidLimit(action.executor.id, 0, ban, kick))
                        if (action.executor.bot) {
                            let botRole = executor.roles.cache.filter(r => r.managed)
                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            await botRole.setPermissions(0, `OneForAll - Type: antiDeco`)
                        }
                    }
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send(logs.targetExecutorLogs("déconnecté", executor, member.user, color, sanction))
                    }

                } else {
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send(logs.targetExecutorLogs("déconnecté", executor, member.user, color, "Je n'ai pas assé de permissions"))
                    }
                    await guild.updateAntiraidLimit(action.executor.id, 0, ban, kick)

                }
            }


        }
    }
}