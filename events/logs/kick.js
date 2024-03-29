module.exports = {
    name: 'guildMemberRemove',

    run: async (client, member) => {
        const { guild } = member
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        let modLog = guildData.get('logs').mod;
        const { logs } = guildData.lang
        if(modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: "MEMBER_KICK"}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction

        if(diff > 1000) return
        const channel = guild.channels.cache.get(modLog);
        if(channel && !channel.deleted){
            const color = guildData.get('color')

            const executor = await guild.members.fetch(action.executor.id)
            channel.send({embeds : [logs.targetExecutorLogs('kick',executor, action.target, color)]})
        }
    }
}