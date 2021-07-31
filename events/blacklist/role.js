const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildMemberRoleAdd',
        });
    }

    async run(client, member, role) {
        const {guild} = member
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const {enable, blacklistedRoles} = guildData.get('blacklistRole');
        if (!enable && !blacklistedRoles.length && !blacklistedRoles.includes(role.id)) return
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        let action = await guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `${this.name}`, 'pink');
        if (guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `${this.name}`, 'pink');
        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        if (isGuildOwner || isBotOwner) return Logger.log(`No sanction  guild owner list or bot owner`, `bl role`, 'pink');
        const executor = await guild.members.fetch(action.executor.id);
        await executor.roles.set(client.functions.getRoleWithoutSensiblePermissions(executor.roles.cache), `Add role blacklist ${role.name}`);
        await member.roles.remove(role, `Add blacklisted role by ${executor.user.username}`)


    }
}