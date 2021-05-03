const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
module.exports = class roleUpdate extends Event {
    constructor() {
        super({
            name: 'roleUpdate',
        });
    }

    async run(client, oldRole, newRole) {
        if (oldRole === newRole) return;
        const guild = oldRole.guild;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        if (oldRole.managed && newRole.managed) return;
        const color = guild.color
        let {antiraidLog} = guild.logs;
        let {logs} = client.lang(guild.lang)


        const antiraidConfig = guild.antiraid;
        const isOn = antiraidConfig.enable[this.name];
        if (!isOn) return;

        let action = await guild.fetchAuditLogs({type: "ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        console.log(diff)
        if (diff >= 500) return
        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `roleUpdate`, 'pink');
        if (guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `roleUpdate`, 'pink');

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL DELETE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)

            try {
                await newRole.edit({
                    name: oldRole.name,
                    color: oldRole.hexColor,
                    hoist: oldRole.hoist,
                    position: oldRole.position,
                    permissions: oldRole.permissions,
                    mentionable: oldRole.mentionable
                }, `OneForAll - Type : ${this.name}`)

            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {

                    if (channel) {
                        channel.send(logs.edtionRole(member, oldRole.id, oldRole.name, newRole.name, color, "Je n'ai pas assé de permissions"))

                    }

                }

            }


            let sanction = antiraidConfig.config[this.name];

            if (member.roles.highest.comparePositionTo(oldRole.guild.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: `OneForAll - Type: ${this.name} `})
                } else if (sanction === 'kick') {
                    guild.member(action.executor.id).kick(
                        `OneForAll - Type: roleUpdate `
                    )
                } else if (sanction === 'unrank') {
                    let roles = []
                    await guild.member(action.executor.id).roles.cache
                        .map(role => roles.push(role.id))
                    await guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id).roles.remove(roles, `OneForAll - Type: roleUpdate`)
                    if (action.executor.bot) {
                        let botRole = member.roles.cache.filter(r => r.managed)
                        // let r = guild.roles.cache.get(botRole.id)

                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0, `OneForAll - Type: roleUpdate`)
                    }
                }


                if (channel) {
                    channel.send(logs.edtionRole(member, oldRole.id, oldRole.name, newRole.name, color, sanction))
                }

            } else {
                if (channel) {
                    channel.send(logs.edtionRole(member, oldRole.id, oldRole.name, newRole.name, color, "Je n'ai pas assé de permissions"))

                }


            }
        }
    }

}



