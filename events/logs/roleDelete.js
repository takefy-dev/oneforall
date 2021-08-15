
module.exports = {

            name: 'roleDelete',


    run: async (client, role) => {
        if (role.managed) return;
        let guild = role.guild;
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const color = guildData.get('color')
        const modLog = guildData.get('logs').mod
        let {logs} = guildData.lang


        if(modLog === "Non définie") return

        let action = await guild.fetchAuditLogs({type: "ROLE_DELETE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return client.Logger.log(`No sanction oneforall`, `role Delete`, 'pink');

        const member = await guild.members.fetch(action.executor.id)
        const channel = guild.channels.cache.get(modLog)

        if (channel && !channel.deleted) {
            channel.send({embeds : [logs.roleDelete(member, role.name, role.id, color)]})
        }


    }
}
