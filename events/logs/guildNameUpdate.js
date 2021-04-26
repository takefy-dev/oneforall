const Event = require('../../structures/Handler/Event');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildUpdate',
        });
    }
    async run(client, oldGuild, newGuild){
        if (!oldGuild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        let { modLog } = oldGuild.logs;
        const { logs } = client.lang(oldGuild.lang)
        if(modLog === "Non définie") return modLog = null;
        const action = await oldGuild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        if(action.changes[0].key !== "name") return
        const channel = oldGuild.channels.cache.get(modLog);
        if(channel){
            const color = oldGuild.color
            const executor = oldGuild.members.cache.get(action.executor.id);
            channel.send(logs.guildNameUpdate(executor, oldGuild.name, newGuild.name, oldGuild.id, color))
        }
    }
}