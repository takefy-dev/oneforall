const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildMemberRoleAdd',
        });
    }

    async run(client, member, role) {
        let guild = member.guild;
        if(!guild.config) return
        if (!role.permissions.has("KICK_MEMBERS") || !role.permissions.has("BAN_MEMBERS") || !role.permissions.has("ADMINISTRATOR") || !role.permissions.has("MANAGE_CHANNELS") || !role.permissions.has("MANAGE_GUILD") || !role.permissions.has("MANAGE_ROLES") || !role.permissions.has("MENTION_EVERYONE")) return;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guild.color
        let {modLog} = guild.logs;
        let {logs} = client.lang(guild.lang)
        if (modLog === "Non définie") return;


        let action = await guild.fetchAuditLogs({type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => audit.entries.first());
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction
        if (diff > 600 || action.changes[0].key !== "$add") return;
        if (action.executor.id === client.user.id) return

        const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
        const channel = guild.channels.cache.get(modLog)


        if (channel && !channel.deleted) {
            channel.send(logs.memberRole(executor, action.target, role.id, color, '', "ADD"))
        }


    }
}