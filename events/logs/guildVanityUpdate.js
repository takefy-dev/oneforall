const Event = require('../../structures/Handler/Event');

module.exports = class guildVanityUpdate extends Event {
    constructor() {
        super({
            name: 'guildVanityUpdate',
        });
    }

    async run(client, guild, oldVanityURL, newVanityURL) {
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        let { modLog } = guild.logs;
        const { logs } = client.lang(guild.lang)
        if(modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        const channel = guild.channels.cache.get(modLog);
        if(channel){
            const color = guild.color

            const executor = guild.members.cache.get(action.executor.id);
            channel.send(logs.guildVanityUpdate(executor, oldVanityURL, newVanityURL, guild.id, color))
        }
    }
}

