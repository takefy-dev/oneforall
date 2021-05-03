const Event = require('../../structures/Handler/Event');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildMemberRemove',
        });
    }
    async run(client, member){
        const { guild } = member
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        let { modLog } = guild.logs;
        const { logs } = client.lang(guild.lang)
        if(modLog === "Non définie") return modLog = null;
        const action = await guild.fetchAuditLogs({type: "MEMBER_KICK"}).then(async (audit) => audit.entries.first());
        if(action.executor.id === client.user.id) return;
        const timeOfAction = action.createdAt.getTime();
        const now = new Date().getTime()
        const diff = now - timeOfAction

        if(diff > 1000) return
        const channel = guild.channels.cache.get(modLog);
        if(channel){
            const color = guild.color

            const executor = guild.members.cache.get(action.executor.id) || await guild.members.fetch(action.executor.id)
            channel.send(logs.targetExecutorLogs('kick',executor, action.target, color))
        }
    }
}