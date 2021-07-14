const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");

module.exports = class roleDelete extends Event {
    constructor() {
        super({
            name: 'roleDelete',
        });
    }

    async run(client, role) {
        if (role.managed) return;
        let guild = role.guild;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const color = guildData.get('color')
        const modLog = guildData.get('logs').mod
        let {logs} = guildData.lang


        if(modLog === "Non définie") return

        let action = await guild.fetchAuditLogs({type: "ROLE_DELETE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `${this.name}`, 'pink');

        const member = await guild.members.resolve(action.executor.id)
        const channel = guild.channels.cache.get(modLog)

        if (channel && !channel.deleted) {
            channel.send(logs.roleDelete(member, role.name, role.id, color))
        }


    }
}
