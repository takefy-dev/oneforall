
module.exports = {
    name: 'channelCreate',
    run: async (client, channel)=> {
        if (channel.type === "dm") return;
        let {guild} = channel
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const color = guildData.get('color');
        let modLog = guildData.get('logs').mod;
        let {logs} = guildData.lang
        if (modLog === "Non définie") return
        let action = await channel.guild.fetchAuditLogs({type: "CHANNEL_CREATE"}).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return
        const member = await guild.members.fetch(action.executor.id)
        const logsChannel = guild.channels.cache.get(modLog)
        if (logsChannel && !logsChannel.deleted) logsChannel.send({embeds : [logs.channelCreate(member, channel.name, channel.id, color)]})

    }
};

