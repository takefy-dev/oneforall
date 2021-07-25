const Event = require('../../structures/Handler/Event');

const fetch = require('node-fetch');
const {Logger} = require("advanced-command-handler");
module.exports = class guildVanityUpdate extends Event {
    constructor() {
        super({
            name: 'guildVanityUpdate',
        });
    }

    async run(client, guild, oldVanityURL, newVanityURL) {
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color')
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang


        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable["vanityUpdate"];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());
        if (action.changes[0].key !== 'vanity_url_code') return;
        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `${this.name}`, 'pink');
        if (guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `${this.name}`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `VANITY UPDATE`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const member = await guild.members.fetch(action.executor.id)
            const channel = guild.channels.cache.get(antiraidLog)
            try {
                await fetch(`https://discord.com/api/v8/guilds/${guild.id}/vanity-url`, {
                    "credentials": "include",
                    "headers": {
                        "accept": "*/*",
                        "authorization": "Bot " + client.token,

                        "content-type": "application/json",
                    },
                    "referrerPolicy": "no-referrer-when-downgrade",
                    "body": JSON.stringify({
                        "code": oldVanityURL
                    }),
                    "method": "PATCH",
                    "mode": "cors"
                })
            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {

                    if (newVanityURL !== null) {
                        if (channel && !channel.deleted) {
                            channel.send(logs.guildVanityUpdate(member, oldVanityURL, newVanityURL, guild.id, color, "Je n'ai pas assé de permissions"))
                        }
                    } else {
                        if (channel && !channel.deleted) {
                            channel.send(logs.guildVanityUpdate(member, oldVanityURL, "None", guild.id, color, "Je n'ai pas assé de permissions"))
                        }
                    }

                }
            }

            let sanction = antiraidConfig.config["vanityUpdate"];


            if (member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {

                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: `OneForAll - Type: guildUpdate - vanityUrl`})


                } else if (sanction === 'kick') {
                    member.kick(
                        `OneForAll - Type: guildUpdate - vanityUrl`
                    )


                } else if (sanction === 'unrank') {

                    let roles = []
                    await member.roles.cache
                        .map(role => roles.push(role.id))

                    await member.roles.remove(roles, `OneForAll - Type: guildUpdate - vanityUrl`)
                    if (action.executor.bot) {
                        let botRole = member.roles.cache.filter(r => r.managed)
                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0, `OneForAll - Type: guildUpdate - vanityUrl`)
                    }


                }


                if (channel && !channel.deleted) {
                    if (newVanityURL != null) {
                        channel.send(logs.guildVanityUpdate(member, oldVanityURL, newVanityURL, guild.id, color, sanction))
                    } else {
                        channel.send(logs.guildVanityUpdate(member, oldVanityURL, "None", guild.id, color, sanction))
                    }

                }

            } else {
                if (newVanityURL != null) {
                    if (channel && !channel.deleted) {
                        channel.send(logs.guildVanityUpdate(member, oldVanityURL, newVanityURL, guild.id, color, "Je n'ai pas assé de permissions"))
                    }
                } else {
                    if (channel && !channel.deleted) {
                        channel.send(logs.guildVanityUpdate(member, oldVanityURL, "None", guild.id, color, "Je n'ai pas assé de permissions"))
                    }
                }

            }
        }
    }

}
;



