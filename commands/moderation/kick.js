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

        const color = message.guild.color
          const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (member === message.member) return message.channel.send()
        if (!member) return message.channel.send(lang.kick.noKick)
        if (member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) return message.channel.send(lang.errorRl(member.user.tag))

        let reason = args[1];
        if (!reason) reason = lang.kick.noReason;


        member.kick(`Kick by ${message.author.tag}`).then(async () => {
            const {modLog} = message.guild.logs;

            const channel = message.guild.channels.cache.get(modLog);
            const guild = message.guild;

            let {logs} = client.lang(guild.lang)
            const color = guild.color;

            if (channel && !channel.deleted) {
                channel.send(channel.send(logs.targetExecutorLogs("kick", message.member, member, color)))
            }
            const antiraidConfig = guild.antiraid;
            let {antiraidLog} = guild.logs;
            const isOn = antiraidConfig.enable["antiMassKick"];
            if (!isOn) return;
            if (guild.ownerID === message.author.id) return Logger.log(`No sanction crown`, `kick`, 'pink');
            let isGuildOwner = guild.isGuildOwner(message.author.id);
            let isBotOwner = client.isOwner(message.author.id);


            let isWlBypass = antiraidConfig.bypass[this.name];
            if (isWlBypass) var isWl = guild.isGuildWl(message.author.id);
            if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `KICK`, 'pink');


            if (isWlBypass && !isWl || !isWlBypass) {
                const kickLimit = antiraidConfig.config["antiMassKickLimit"]
                const logsChannel = guild.channels.cache.get(antiraidLog)
                if (!guild.antiraidLimit.has(message.author.id)) {
                    await guild.updateAntiraidLimit(message.author.id, 0, 0, 1);

                }
                const {deco, ban, kick} = guild.antiraidLimit.get(message.author.id)
                if (kick < kickLimit) {
                    await guild.updateAntiraidLimit(message.author.id, deco, ban, kick + 1);
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send(logs.targetExecutorLogs("kick", message.member, member, color, `${kick + 1 === kickLimit ? `Aucun ban restant` : `${kick + 1}/${kickLimit}`} before sanction`))
                    }
                } else {
                    let sanction = antiraidConfig.config["antiMassKick"];


                    if (message.member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                        if (sanction === 'ban') {
                            await guild.members.ban(message.author.id, {reason: 'OneForAll - Type : antiMassKick'})
                        } else if (sanction === 'kick') {
                            guild.member(message.author.id).kick(
                                `OneForAll - Type: antiMassKick `
                            )
                        } else if (sanction === 'unrank') {
                            let roles = []
                            await guild.member(message.author.id).roles.cache
                                .map(role => roles.push(role.id))

                            await guild.members.cache.get(message.author.id).roles.remove(roles, `OneForAll - Type: antiMassKick`)

                        }
                        if (logsChannel && !logsChannel.deleted) {
                            logsChannel.send(logs.targetExecutorLogs("kick", message.member, member, color, sanction))
                        }
                        await guild.updateAntiraidLimit(message.author.id, deco, ban, 0)

                    } else {
                        if (logsChannel && !logsChannel.deleted) {
                            logsChannel.send(logs.targetExecutorLogs("kick", message.member, member, color, "Je n'ai pas assé de permissions"))
                        }
                        await guild.updateAntiraidLimit(message.author.id, deco, ban, 0)

                    }
                }
                message.channel.send(lang.kick.success(member));
            }
        }).catch(() => {
            message.channel.send(lang.kick.error(member));
        })

    }
}
