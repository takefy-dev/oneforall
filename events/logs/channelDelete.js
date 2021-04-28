const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')


module.exports = class channelDelete extends Event {
    constructor() {
        super({
            name: 'channelDelete',
        });
    }

    async run(client, channel) {
        let guild = channel.guild
        if (channel.type === "dm") return;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guild.color;
        let {modLog} = guild.logs;
        let {logs} = client.lang(guild.lang)
        if (modLog === "Non définie") return
        let action = await channel.guild.fetchAuditLogs({type: "CHANNEL_DELETE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return

        const member = guild.members.cache.get(action.executor.id)
        const logsChannel = guild.channels.cache.get(modLog)


        if (logsChannel && !logsChannel.deleted) logsChannel.send(logs.channelDelete(member, channel.name, channel.id, color))

    }


}
;

