module.exports = {
    name: 'roleUpdate',
    run: async (client, oldRole, newRole) => {
        const guild = oldRole.guild;
        if (!guild.config) return
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        let modLog = guildData.get('logs').mod;
        const {logs} = guildData.lang
        if (modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: "ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return;
        if (action.changes[0].key !== "name") return;
        const channel = guild.channels.cache.get(modLog);
        if (channel && !channel.deleted) {
            const color = guildData.get('color')
            const executor = await guild.members.fetch(action.executor.id);
            channel.send({embeds: [logs.edtionRole(executor, oldRole.id, oldRole.name, newRole.name, color)]})
        }
    }
}