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
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const color = guildData.get('color');
        const antiraidConfig = guildData.get('antiraid');
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang
        const isOn = antiraidConfig.enable["antiDeco"];
        if (!isOn) return;
        let action = await member.guild.fetchAuditLogs({type: "MEMBER_DISCONNECT"}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        if (diff >= 600) return;

        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `Deco`, 'pink');
        if (guild.ownerId
 === action.executor.id) return Logger.log(`No sanction crown`, `Deco`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const decoLimit = antiraidConfig.config["antiDecoLimit"]
            const executor = await guild.members.fetch(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)
            const executorData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${executor.id}`)
            const antiraidLimit = executorData.get('antiraidLimit');
            antiraidLimit.deco += 1
            antiraidLimit.deco += action.extra.count
            if (antiraidLimit < decoLimit) {
                antiraidLimit.deco += 1
                if (logsChannel && !logsChannel.deleted) {
                    logsChannel.send({embeds : [logs.targetExecutorLogs("déconnecté", executor, member.user, color, `${antiraidLimit + 1 === decoLimit ? `Aucune déconnexion restant` : `${antiraidLimit + 1}/${decoLimit}`} before sanction`)]})
                }
            } else {
                let sanction = antiraidConfig.config["antiDeco"];


                if (executor.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                    if (sanction === 'ban') {
                        await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : antiDeco'}).then(async () => antiraidLimit.deco = 0)
                    } else if (sanction === 'kick') {
                        executor.kick(
                            `OneForAll - Type: antiDeco `
                        ).then(async () => antiraidLimit.deco = 0)
                    } else if (sanction === 'unrank') {
                        await executor.roles.set(client.functions.getRoleWithoutSensiblePermissions(executor.roles.cache)`OneForAll - Type: antiDeco`).then(async () => antiraidLimit.deco = 0)
                        if (action.executor.bot) {
                            let botRole = executor.roles.cache.filter(r => r.managed)
                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            await botRole.setPermissions(0, `OneForAll - Type: antiDeco`)
                        }
                    }
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send({embeds : [logs.targetExecutorLogs("déconnecté", executor, member.user, color, sanction)]})
                    }

                } else {
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send({embeds : [logs.targetExecutorLogs("déconnecté", executor, member.user, color, "Je n'ai pas assé de permissions")]})
                    }
                    antiraidLimit.deco = 0

                }
            }
            executorData.set('antiraidLimit', antiraidLimit).save()


        }
    }
}