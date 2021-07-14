const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'kick',
            description: 'Kick a member | Kick un membre',
            usage: 'kick <mention/id>',
            category: 'moderation',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        let member = message.mentions.members.first() || await message.guild.members.resolve(args[0]);
        if (member === message.member) return message.channel.send(lang.kick.errorKickSelf)
        if (!member) return message.channel.send(lang.kick.noKick)
        if (member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) return message.channel.send(lang.errorRl(member.user.tag))

        let reason = args[1];
        if (!reason) reason = lang.kick.noReason;


        member.kick(`Kick by ${message.author.tag}`).then(async () => {
            message.channel.send(lang.kick.success(member));
            const {modLog} = guildData.get('logs').mod;

            const channel = message.guild.channels.cache.get(modLog);
            const guild = message.guild;

            let {logs} = guildData.lang
            const color = guildData.get('color');

            if (channel && !channel.deleted) {
                channel.send(channel.send(logs.targetExecutorLogs("kick", message.member, member, color)))
            }
            const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
            const antiraidConfig = guildData.get('antiraid');
            let antiraidLog = guildData.get('logs').antiraid;
            const isOn = antiraidConfig.enable["antiMassKick"];
            if (!isOn) return;
            if (guild.ownerID === message.author.id) return Logger.log(`No sanction crown`, `kick`, 'pink');
            let isGuildOwner = guildData.isGuildOwner(message.author.id);
            let isBotOwner = client.isOwner(message.author.id);


            let isWlBypass = antiraidConfig.bypass[this.name];
            if (isWlBypass) var isWl = guildData.isGuildWl(message.author.id);
            if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `KICK`, 'pink');


            if (isWlBypass && !isWl || !isWlBypass) {
                const kickLimit = antiraidConfig.config["antiMassKickLimit"]
                const logsChannel = guild.channels.cache.get(antiraidLog)
                const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${message.member.id}`)
                const antiraidLimit = userData.get('antiraidLimit')
                if (!antiraidLimit.kick) {
                    antiraidLimit.kick += 1
                }
                if (antiraidLimit.kick < kickLimit) {
                    antiraidLimit.kick += 1
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send(logs.targetExecutorLogs("kick", message.member, member, color, `${antiraidLimit.kick + 1 === kickLimit ? `Aucun ban restant` : `${antiraidLimit.kick + 1}/${kickLimit}`} before sanction`))
                    }
                } else {
                    let sanction = antiraidConfig.config["antiMassKick"];


                    if (message.member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                        if (sanction === 'ban') {
                            await guild.members.ban(message.author.id, {reason: 'OneForAll - Type : antiMassKick'})
                        } else if (sanction === 'kick') {
                            await message.member.kick(
                                `OneForAll - Type: antiMassKick `
                            )
                        } else if (sanction === 'unrank') {
                            let roles = []
                            await message.member.roles.cache
                                .map(role => roles.push(role.id))

                            await message.member.roles.remove(roles, `OneForAll - Type: antiMassKick`)

                        }
                        if (logsChannel && !logsChannel.deleted) {
                            logsChannel.send(logs.targetExecutorLogs("kick", message.member, member, color, sanction))
                        }
                        antiraidLimit.kick = 0

                    } else {
                        if (logsChannel && !logsChannel.deleted) {
                            logsChannel.send(logs.targetExecutorLogs("kick", message.member, member, color, "Je n'ai pas assé de permissions"))
                        }
                        antiraidLimit.kick = 0

                    }
                    userData.save()
                }
            }
        }).catch(() => {
            message.channel.send(lang.kick.error(member));
        })

    }
}
