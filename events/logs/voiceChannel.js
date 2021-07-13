const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
        });
    }

    async run(client, oldState, newState) {
        const guild = oldState.guild;
        if(!oldState.guild.config) return
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        let voiceLog = guildData.get('logs').voice;
        const {logs} = guildData.lang
        if (voiceLog === "Non définie") return voiceLog = null;
        // const action = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(async (audit) => audit.entries.first());
        // if (action.executor.id === client.user.id) return;
        const color = guildData.get('color')
        const channel = guild.channels.cache.get(voiceLog);
        if(!channel) return;
        if (oldState.channelID == null && newState.channelID != null) {
            // connect
            channel.send(logs.voiceConnect(oldState.member, newState.channelID, color))
        }
        if (oldState.channelID != null && newState.channelID == null) {
            channel.send(logs.voiceLeave(oldState.member, oldState.channelID, color))
            // disconnect


        }
        if (oldState.channelID != null && newState.channelID != null && oldState.channelID !== newState.channelID) {
            let action = await oldState.guild.fetchAuditLogs({
                type: "MEMBER_MOVE",
            }).then(async (audit) => audit.entries.first());
            const {executor, target} = action
            // self move
            const member = await guild.members.resolve(executor.id)
            if(!action || executor.id === oldState.id){
                console.log("ok")
                return channel.send(logs.voiceChange(member, member.user, oldState.channelID, newState.channelID, color))

            }

            if (action.extra.channel.id !== oldState.id && executor.id !== oldState.id) {
                const user = client.users.cache.get(oldState.id)
                channel.send(logs.voiceChange(member, user, oldState.channelID, newState.channelID, color))


            }


        }
        if (!oldState.selfMute && newState.selfMute && oldState.channelID != null) {
            channel.send(logs.voiceMute(oldState.member, newState.channelID, color))
        }
        if (oldState.selfMute && !newState.selfMute && newState.channelID != null) {
            channel.send(logs.voiceUnMute(oldState.member, newState.channelID, color))
        }


    }
}