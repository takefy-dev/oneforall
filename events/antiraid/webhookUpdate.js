const Discord = require('discord.js')
const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");

module.exports = class webhookUpdate extends Event {
    constructor() {
        super({
            name: 'webhookUpdate',
        });
    }

    async run(client, channel) {
        let guild = channel.guild

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color')
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang


        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable[this.name];
        if (!isOn) return;
        let action = await guild.fetchAuditLogs({
            type: "WEBHOOK_CREATE",
            limit: 1
        }).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id) return Logger.log(`No sanction oneforall`, `${this.name}`, 'pink');
        if (guild.ownerId
 === action.executor.id) return Logger.log(`No sanction crown`, `${this.name}`, 'pink');

        let isGuildOwner = guildData.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);

        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guildData.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `wb update`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const executor = await guild.members.fetch(action.executor.id)
            const logsChannel = guild.channels.cache.get(antiraidLog)
            try {
                await channel.delete(`OneForAll - Type : webhookCreate`);
                var newChannel = await channel.clone({
                    reason: `OneForAll - Type : webhookCreate`,
                    parent: channel.parent
                })
                await newChannel.setPosition(channel.rawPosition)

                if (newChannel) {
                    const embed = new Discord.MessageEmbed()
                        .setDescription('👩‍💻 Une création de webhook a été détecté le channel a donc été renew [oneforall antiraid](https://discord.gg/rdrTpVeGWX)')
                        .setColor(color)
                        .setTimestamp()
                        .setFooter(client.user.username)
                    newChannel.send({embeds: [embed]})
                }


            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {
                    if (logsChannel && newChannel) {
                        logsChannel.send({embeds : [logs.webhookCreate(executor, newChannel.id, color, "Je n'ai pas assé de permissions")]})
                    }
                }
            }

            let sanction = antiraidConfig.config[this.name];

            if (executor.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                if (sanction === 'ban') {
                    await guild.members.ban(action.executor.id, {reason:`OneForAll - webhookCreate`})


                } else if (sanction === 'kick') {
                    await executor.kick(
                        `OneForAll - Type: webhookCreate `
                    )


                } else if (sanction === 'unrank') {
                    await executor.roles.set(client.functions.getRoleWithoutSensiblePermissions(executor.roles.cache), `OneForAll - Type: webhookCreate`)
                    if (action.executor.bot) {
                        let botRole = executor.roles.cache.filter(r => r.managed)
                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        await botRole.setPermissions(0, `OneForAll - Type: webhookCreate`)
                    }


                }

                if (logsChannel && newChannel) {
                    logsChannel.send({embeds: [logs.webhookCreate(executor, newChannel.id, color, sanction)]})
                }
            } else {
                if (logsChannel && newChannel) {
                    logsChannel.send({embeds : [logs.webhookCreate(executor, newChannel.id, color, "Je n'ai pas assé de permissions")]})
                }
            }
        }
    }
}

