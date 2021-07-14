const StateManager = require('../../utils/StateManager');
const logsChannelId = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'ban',
            description: 'Ban a user from the server | Bannir un membre du serveur',
            usage: 'ban <mention / id> [reason]',
            category: 'moderation',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['BAN_MEMBERS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {


        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const color = guildData.get('color')

        const user = message.mentions.users.first() || await client.users.resolve(args[0])
        console.log(user)
        if (user.id === message.author.id) {
            return await message.channel.send(lang.ban.errorBanSelf).then(mp => mp.delete({timeout: 4000}));
        }
        // const banned = await message.guild.fetchBans();
        // if(banned.some((m) => m.user.id === user.id)){
        //     return message.channel.send(lang.ban.alreadyBan(user)).then(mp => mp.delete({ timeout: 4000}))
        // }

        let reason = args.slice(1).join(" ");
        if (!reason) {
            reason = `Ban par ${message.author.tag}`
        }

        const member = await message.guild.members.fetch(user.id).catch(() => {
        });
        if (member) {
            const memberPosition = member.roles.highest.position;
            const moderationPosition = message.member.roles.highest.position;
            if (message.guild.ownerID !== message.author.id && !(moderationPosition > memberPosition) && !client.isOwner(message.author.id)) {
                return message.channel.send(lang.ban.errorRl(user)).then(mp => mp.delete({timeout: 4000}));
            }
            if (!member.bannable) {
                return message.channel.send(lang.ban.errorRl(user)).then(mp => mp.delete({timeout: 4000}));
            }
        }

        await user.createDM().then((dm) => {
            dm.send(lang.ban.dm(message.guild.name, message.author.username)).then(() => {
                user.deleteDM()
            }).catch(() => {
            });

        })


        message.guild.members.ban(user, {reason}).then(async () => {
            message.channel.send(lang.ban.success(user));

            const modLog = guildData.get('logs').logs;
            const channel = message.guild.channels.cache.get(modLog);
            const guild = message.guild;

            let {logs} = guildData.lang
            const color = guildData.get('color');

            if (channel && !channel.deleted) {
                channel.send(channel.send(logs.targetExecutorLogs("ban", message.member, user, color)))
            }
            const antiraidConfig = guildData.get('antiraid');
            let antiraidLog = guildData.get('logs').antiraid;
            const isOn = antiraidConfig.enable["antiMassBan"];
            if (!isOn) return;
            if (guild.ownerID === message.author.id) return Logger.log(`No sanction crown`, `MassBAN`, 'pink');
            let isGuildOwner = guildData.isGuildOwner(message.author.id);
            let isBotOwner = client.isOwner(message.author.id);


            let isWlBypass = antiraidConfig.bypass["antiMassBan"];
            if (isWlBypass) var isWl = guildData.isGuildWl(message.author.id);
            if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


            if (isWlBypass && !isWl || !isWlBypass) {
                const banLimit = antiraidConfig.config["antiMassBanLimit"]
                const logsChannel = guild.channels.cache.get(antiraidLog)
                const userData = client.managers.userManager.get(`${message.guild.id}-${message.author.id}`)
                const antiraidLimit = userData.get('antiraidLimit')
                if (!antiraidLimit.ban) {
                    antiraidLimit.ban += 1

                }

                if (antiraidLimit.ban < banLimit) {
                    antiraidLimit.ban += 1
                    if (logsChannel && !logsChannel.deleted) {
                        logsChannel.send(logs.targetExecutorLogs("ban", message.member, member, color, `${antiraidLimit.ban + 1 === banLimit ? `Aucun ban restant` : `${antiraidLimit.ban + 1}/${banLimit}`} before sanction`))
                    }
                } else {
                    let sanction = antiraidConfig.config["antiMassBan"];


                    if (message.member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                        if (sanction === 'ban') {
                            await guild.members.ban(message.author.id, {reason: 'OneForAll - Type : antiMassBan'})
                        } else if (sanction === 'kick') {
                            await message.member.kick(
                                `OneForAll - Type: antiMassBan `
                            )
                        } else if (sanction === 'unrank') {
                            let roles = []
                            await message.member.roles.cache
                                .map(role => roles.push(role.id))

                            await message.member.roles.remove(roles, `OneForAll - Type: antiMassBan`)

                        }
                        if (logsChannel && !logsChannel.deleted) {
                            logsChannel.send(logs.targetExecutorLogs("ban", message.member, user, color, sanction))
                        }
                        antiraidLimit.ban = 0

                    } else {
                        if (logsChannel && !logsChannel.deleted) {
                            logsChannel.send(logs.targetExecutorLogs("ban", message.member, user, color, "Je n'ai pas assé de permissions"))
                        }
                        antiraidLimit.ban = 0

                    }
                }
                userData.save()
            }
        })


    }
};

