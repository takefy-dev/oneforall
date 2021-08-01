

module.exports = {
    name: 'roleCreate',
    run: async (client, role) => {
        if (role.managed) return;
        let guild = role.guild;
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color');
        let {logs} = guildData.lang
        const modLog = guildData.get('logs').mod
        if(modLog === "Non définie") return

        let action = await guild.fetchAuditLogs({type: "ROLE_CREATE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return

        const member = await guild.members.fetch(action.executor.id)
        const channel = guild.channels.cache.get(modLog)

        if (channel && !channel.deleted) {
            channel.send({embeds : [logs.roleCreate(member, role.name, role.id, color)]})
        }


    }
}
