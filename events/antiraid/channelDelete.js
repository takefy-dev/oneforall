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
        if (!guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color');
        const antiraidConfig = guildData.get('antiraid');
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang
        const isOn = antiraidConfig.enable[this.name];
        if (!isOn) return;

        let action = await channel.guild.fetchAuditLogs({type: "CHANNEL_DELETE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `CHANNEL Create`, 'pink');
        if (guild.ownerId
 === action.executor.id) return Logger.log(`No sanction crown`, `CHANNEL Create`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const member = await guild.members.fetch(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)

            try {
                await guild.channels.create(channel.name, {
                    reason: `OneForall - Type : ${this.name}`,
                    type: channel.type,
                    topic: channel.topic,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate,
                    userLimit: channel.userLimit,
                    parent: channel.parent,
                    permissionOverwrites: channel.permissionOverwrites,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    position: channel.rawPosition

                })
            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send({embeds : [logs.channelDelete(member, channel.name, channel.id, color, "Je n'ai pas assé de permissions")]})
                    }
                }
            }

            let sanction = antiraidConfig.config[this.name];


            if (member.roles.highest.comparePositionTo(channel.guild.me.roles.highest) <= 0) {
                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason: 'OneForAll - Type : channelDelete'})
                } else if (sanction === 'kick') {
                    await member.kick(
                        `OneForAll - Type: channelDelete `
                    )
                } else if (sanction === 'unrank') {
                    await member.roles.set(client.functions.getRoleWithoutSensiblePermissions(member.roles.cache),`OneForAll - Type: channelDelete`)
                    if (action.executor.bot) {
                        await member.roles.botRole.setPermissions([], `OneForAll - Type: channelDelete`)
                    }
                }


                if (logsChannel && !logsChannel.deleted) logsChannel.send({embeds : [logs.channelDelete(member, channel.name, channel.id, color, sanction)]})
            } else {

                if (logsChannel && !logsChannel.deleted) {
                    logsChannel.send({embeds : [logs.channelDelete(member, channel.name, channel.id, color, "Je n'ai pas assé de permissions")]})
                }
            }
        }

    }
};

