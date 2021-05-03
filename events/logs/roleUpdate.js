const Event = require('../../structures/Handler/Event');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'roleUpdate',
        });
    }
    async run(client, oldRole, newRole){
        const guild = oldRole.guild;
        if(!guild.config) return
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        let { modLog } = guild.logs;
        const { logs } = client.lang(guild.lang)
        if(modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: "ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        if(action.changes[0].key !== "name") return;
        const channel = guild.channels.cache.get(modLog);
        if(channel && !channel.deleted){
            const color = guild.color
            const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id);
            channel.send(logs.edtionRole(executor, oldRole.id,oldRole.name, newRole.name, color))
        }
    }
}