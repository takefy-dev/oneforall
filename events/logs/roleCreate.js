const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");

module.exports = class roleCreate extends Event {
    constructor() {
        super({
            name: 'roleCreate',
        });
    }

    async run(client, role) {
        if (role.managed) return;
        let guild = role.guild;
        if(!guild.config) return
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guild.color
        let {modLog} = guild.logs;
        let {logs} = client.lang(guild.lang)

        if(modLog === "Non définie") return

        let action = await guild.fetchAuditLogs({type: "ROLE_CREATE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return

        const member = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
        const channel = guild.channels.cache.get(modLog)

        if (channel && !channel.deleted) {
            channel.send(logs.roleCreate(member, role.name, role.id, color))
        }


    }
}
