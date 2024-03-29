module.exports ={
    name: 'guildMemberRoleAdd',
    run: async (client, member, role) => {
        const {guild} = member
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const {enable, blacklistedRoles} = guildData.get('blacklistRole');
        if (!enable && !blacklistedRoles.length && !blacklistedRoles.includes(role.id)) return
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        let action = await guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return  client.Logger.log(`No sanction oneforall`, `bl role`, 'pink');
        if (guild.ownerId
 === action.executor.id) return client.Logger.log(`No sanction crown`, `bl role`, 'pink');
        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        if (isGuildOwner || isBotOwner) return  client.Logger.log(`No sanction  guild owner list or bot owner`, `bl role`, 'pink');
        const executor = await guild.members.fetch(action.executor.id);
        await executor.roles.set(client.functions.getRoleWithoutSensiblePermissions(executor.roles.cache), `Add role blacklist ${role.name}`);
        await member.roles.remove(role, `Add blacklisted role by ${executor.user.username}`)


    }
}
