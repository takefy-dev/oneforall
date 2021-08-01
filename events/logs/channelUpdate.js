module.exports ={
    name: 'channelUpdate',
    run: async (client, oldChannel, newChannel) =>{
        const guild = oldChannel.guild;
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        let modLog = guildData.get('logs').mod;
        const { logs } = guildData.lang
        if(modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: "CHANNEL_UPDATE"}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        if(action.executor.bot) return
        if(action.changes[0].key !== "name") return;
        const channel = guild.channels.cache.get(modLog);
        if(channel){
            const color = guildData.get('color')
            const executor = await guild.members.fetch(action.executor.id);
            channel.send({embeds : [logs.edtionChannel(executor, oldChannel.id,oldChannel.name, newChannel.name, color)]})
        }
    }
}