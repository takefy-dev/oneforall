const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildMemberRoleRemove',
        });
    }

    async run(client, member, role) {
        let guild = member.guild;
        if (!role.permissions.has("KICK_MEMBERS") || !role.permissions.has("BAN_MEMBERS") || !role.permissions.has("ADMINISTRATOR") || !role.permissions.has("MANAGE_CHANNELS") || !role.permissions.has("MANAGE_GUILD") || !role.permissions.has("MANAGE_ROLES") || !role.permissions.has("MENTION_EVERYONE")) return;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guild.color
        let {antiraidLog} = guild.logs;
        let {logs} = client.lang(guild.lang)


        const antiraidConfig = guild.antiraid;
        const isOn = antiraidConfig.enable["roleAdd"];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        if(diff > 600 || action.changes[0].key !== "$remove") return;
        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `${this.name}`, 'pink');
        if (guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `${this.name}`, 'pink');

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `${this.name}`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const executor = guild.members.cache.get(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)
            try {
                await member.roles.add(role, `OneForAll - Type : Role remove`)
            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if (channel) {
                        channel.send(logs.memberRole(executor, action.target, role.id, color, "Je n'ai pas assé de permissions", "REMOVE"))
                    }
                }
            }
            let sanction = antiraidConfig.config["roleAdd"];

            if (executor.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, `OneForAll - Type : removeRemove`)
                } else if (sanction=== 'kick') {
                    guild.member(action.executor.id).kick(
                        `OneForAll - Type: roleRemove `
                    )
                } else if (sanction === 'unrank') {
                    let roles = []
                    await guild.member(action.executor.id).roles.cache
                        .map(role => roles.push(role.id))

                    await guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: roleRemove`)
                    if (action.executor.bot) {
                        let botRole = executor.roles.cache.filter(r => r.managed)
                        // let r = guild.roles.cache.get(botRole.id)

                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0, `OneForAll - Type: roleRemove`)
                    }
                }

                if (channel) {
                    channel.send(logs.memberRole(executor, action.target, role.id, color, sanction, "REMOVE"))
                }

            } else {


                if (channel) {
                    channel.send(logs.memberRole(executor, action.target, role.id, color, "Je n'ai pas assé de permissions", "REMOVE"))


                }

            }
        }
    }
}