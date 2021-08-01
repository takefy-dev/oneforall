module.exports = {
    name: 'guildMemberRoleAdd',
    run: async (client, member, role) => {
        let {guild} = member;
        if (!role.permissions.has("KICK_MEMBERS") || !role.permissions.has("BAN_MEMBERS") || !role.permissions.has("ADMINISTRATOR") || !role.permissions.has("MANAGE_CHANNELS") || !role.permissions.has("MANAGE_GUILD") || !role.permissions.has("MANAGE_ROLES") || !role.permissions.has("MENTION_EVERYONE")) return;
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const color = guildData.get('color')
        const modLog = guildData.get('logs').mod
        let {logs} = guildData.lang
        if (modLog === "Non définie") return;


        let action = await guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        if (diff > 600 || action.changes[0].key !== "$add") return;
        if (action.executor.id === client.user.id) return

        const executor = await guild.members.fetch(action.executor.id)
        const channel = guild.channels.cache.get(modLog)


        if (channel && !channel.deleted) {
            channel.send({embeds: [logs.memberRole(executor, action.target, role.id, color, '', "ADD")]})
        }


    }
}