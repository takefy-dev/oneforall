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
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        let voiceLog = guildData.get('logs').voice;
        const {logs} = guildData.lang
        if (voiceLog === "Non définie") return voiceLog = null;
        // const action = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(async (audit) => audit.entries.first());
        // if (action.executor.id === client.user.id) return;
        const color = guildData.get('color')
        const channel = guild.channels.cache.get(voiceLog);
        if(!channel) return;
        if (oldState.channelId
 == null && newState.channelId
 != null) {
            // connect
            channel.send({embeds : [logs.voiceConnect(oldState.member, newState.channelId, color)]})
        }
        if (oldState.channelId
 != null && newState.channelId
 == null) {
            channel.send({embeds : [logs.voiceLeave(oldState.member, oldState.channelId
, color)]})
            // disconnect


        }
        if (oldState.channelId
 && newState.channelId
 && oldState.channelId
 !== newState.channelId
) {
            let action = await oldState.guild.fetchAuditLogs({
                type: "MEMBER_MOVE",
            }).then(async (audit) => audit.entries.first());
            // self move

            if(!action || action.executor.id === oldState.id){

                return channel.send({embeds : [logs.voiceChange(oldState.member, oldState.member.user, oldState.channelId
, newState.channelId
, color)]})

            }
            const member = await guild.members.fetch(action.executor.id)

            if (action.extra.channel.id !== oldState.id && action.executor.id !== oldState.id) {
                const user = client.users.cache.get(oldState.id)
                channel.send({embeds : [logs.voiceChange(member, user, oldState.channelId
, newState.channelId
, color)]})


            }


        }
        if (!oldState.selfMute && newState.selfMute && oldState.channelId
 != null) {
            channel.send({embeds : [logs.voiceMute(oldState.member, newState.channelId
, color)]})
        }
        if (oldState.selfMute && !newState.selfMute && newState.channelId
 != null) {
            channel.send({embeds : [logs.voiceUnMute(oldState.member, newState.channelId
, color)]})
        }


    }
}