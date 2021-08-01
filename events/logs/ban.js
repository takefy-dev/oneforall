module.exports = {
    name: 'guildBanAdd',
    run: async (client, guild, user) =>{
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        let modLog  = guildData.get('logs').mod;
        const { logs } = guildData.lang
        if(modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        const channel = guild.channels.cache.get(modLog);
        if(channel){
            const color = guildData.get('color')
            const executor = await guild.members.fetch(action.executor.id);
            channel.send({embeds : [logs.targetExecutorLogs('ban',executor, action.target, color)]})
        }
    }
}