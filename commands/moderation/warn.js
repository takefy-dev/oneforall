const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var logsChannelF = require('../../function/fetchLogs');
const logsChannelId = new Map();
var langF = require('../../function/lang')
const warnSanction = new Map();
var checkSetup = require('../../function/check/checkSetup');
const muteRoleId = new Map();
module.exports = new Command({
    name: 'warn',
    description: 'Warn a member | Warn un membre',
    // Optionnals :
    usage: '!warn [clear/list/remove] <mention/id/> [amountToClear or all / numberOfTheWarnToRemove] [reason]',
    category: 'moderation',
    tags: ['guildOnly'],
    userPermissions: ['BAN_MEMBERS'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 3
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    let logChannel
    let logChannelId = logsChannelId.get(message.guild.id);
    if (logChannelId != undefined) {
        logChannel = message.guild.channels.cache.get(logChannelId)

    }
    let warnedUser;
    if (args[0] !== 'clear' || args[0] !== 'list' || args[0] !== 'remove') warnedUser = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (args[0] === 'clear' || args[0] === 'list' || args[0] === 'remove') {
        warnedUser = await message.mentions.members.first() || message.guild.members.cache.get(args[1])
    }

    let reason = args.slice(1).join(' ')
    if (!reason) reason = `Aucune raison donnée`
    let warn;
    const warnBan = warnSanction.get(message.guild.id).ban
    const warnKick = warnSanction.get(message.guild.id).kick
    const warnMute = warnSanction.get(message.guild.id).mute
    // const warn = { userId: '10000', warnedAmount : warnedAmount + 1  }
    await this.connection.query(`SELECT * FROM warn WHERE userId = ${warnedUser.user.id} AND guildId = '${message.guild.id}'`).then(async (res) => {
        if (args[0] !== 'list' && args[0] !== 'clear' && args[0] !== 'remove') {
            if (res[0].length === 0) {
                warn = { warnedAmount: 1, reason: [reason] }
                await this.connection.query(`INSERT INTO warn (userId, guildId, warn) VALUES ('${warnedUser.user.id}', '${message.guild.id}', '${JSON.stringify(warn)}')`).then(async () => {
                    await warnedUser.createDM().then((dm) => {
                        dm.send(lang.warn.warnDm(message.author.tag, reason, 1)).then(() => {
                            user.deleteDM()
                        }).catch(() => { });

                    })
                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle("\`💢\` Ajout d'un warn à un membre")
                        .setDescription(`
                        \`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a warn :\n
                        \`\`\`${warnedUser.user.tag}\`\`\`
                        \`🧾\`Warns : 1 | ${reason}
                        `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    if (logChannel != undefined) {
                        logChannel.send(logsEmbed)

                    }
                    message.channel.send(lang.warn.warnSuccess(warnedUser.user.tag, reason, warn.warnedAmount))
                })
            } else {
                const dbWarn = JSON.parse(res[0][0].warn)
                const tempReason = dbWarn.reason
                tempReason.push(reason)
                warn = { warnedAmount: dbWarn.warnedAmount + 1, reason: tempReason }
                await this.connection.query(`UPDATE warn SET warn='${JSON.stringify(warn)}' WHERE guildId = '${message.guild.id}' AND userId = '${warnedUser.user.id}'`).then(async () => {
                    console.log(dbWarn)
                    message.channel.send(lang.warn.warnSuccess(warnedUser.user.tag, reason, warn.warnedAmount))
                    await warnedUser.createDM().then((dm) => {
                        dm.send(lang.warn.warnDm(message.author.tag, reason, warn.warnedAmount)).then(() => {
                            warnedUser.deleteDM()


                        }).catch(() => { });
                    })
                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle("\`💢\` Ajout d'un warn à un membre")
                        .setDescription(`
                     \`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a warn :\n
                    \`\`\`${warnedUser.user.tag}\`\`\`
                    \`🧾\`Warns : ${warn.warnedAmount} | ${warn.reason.join(', ')}
                    `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    if (logChannel != undefined) {
                        logChannel.send(logsEmbed)

                    }
                })

            }
        } else if (args[0] === 'list') {
            let count = 1
            const warnReason = res[0][0] === undefined ? lang.warn.noWarn : JSON.parse(res[0][0].warn).reason.map(r => `__${count++}__ ${lang.warn.reason}: ${r}`)
            const listEmbed = new Discord.MessageEmbed()
                .setTitle(lang.warn.listTitle(warnedUser.user.tag))
                .setDescription(warnReason)
                .setTimestamp()
                .setColor(`${color}`)
                .setFooter(warnedUser.user.tag, warnedUser.user.displayAvatarURL({ dynamic: true }))
            message.channel.send(listEmbed)
        } else if (args[0] === "clear") {
            if (res[0][0] === undefined) return message.channel.send(lang.warn.nothingToClear)
            if (args[2] === 'all') {
                await this.connection.query(`DELETE FROM warn WHERE guildId = '${message.guild.id}' AND userId = '${warnedUser.user.id}'`).then(() => {
                    message.channel.send(lang.warn.successClear(warnedUser.user.tag))
                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle("\`💢\` Suppression de warn à un membre")
                        .setDescription(`
                     \`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a supprimé des warns à :\n
                    \`\`\`${warnedUser.user.tag}\`\`\`
                    \`🧾\`Tout les warns
                    `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    if (logChannel != undefined) {
                        logChannel.send(logsEmbed)

                    }
                })
            } else {
                if (isNaN(args[2])) return message.channel.send(lang.warn.onlyNumber)
                let reasonLenght = 0
                const dbWarn = JSON.parse(res[0][0].warn)
                for (const reason in dbWarn.reason) reasonLenght++
                if (parseInt(args[2]) > reasonLenght) return message.channel.send(lang.warn.amountHigherThanWarnTotal).then(mp => mp.delete({ timeout: 4000 }))
                const removeReason = dbWarn.reason.splice(0, reasonLenght - parseInt(args[2]))
                const newWarn = { warnedAmount: dbWarn.warnedAmount - args[2], reason: removeReason }
                await this.connection.query(`UPDATE warn SET warn='${JSON.stringify(newWarn)}' WHERE guildId = '${message.guild.id}' AND userId = '${warnedUser.user.id}'`).then(() => {
                    message.channel.send(lang.warn.successClearAmount(warnedUser.user.tag, args[2]))
                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle("\`💢\` Suppression de warn à un membre")
                        .setDescription(`
                    \`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a supprimé des warns à :\n
                    \`\`\`${warnedUser.user.tag}\`\`\`
                    \`🧾\`Nombre supprimé : ${args[2]}
                    `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    if (logChannel != undefined) {
                        logChannel.send(logsEmbed)

                    }
                })
            }

        } else if (args[0] === "remove") {
            let count = 1
            if (isNaN(args[2])) return message.channel.send(lang.warn.onlyNumber)
            if (res[0][0] === undefined) return message.channel.send(lang.warn.nothingToClear)
            JSON.parse(res[0][0].warn).reason.map(r => count++)
            if (parseInt(args[2]) > count || parseInt(args[2]) === 0) return message.channel.send(lang.warn.warnNotFound).then(mp => mp.delete({ timeout: 4000 }))
            const dbWarn = JSON.parse(res[0][0].warn)
            const warnDelete = dbWarn.reason[parseInt(args[2]) - 1]
            dbWarn.reason.splice(parseInt(args[2]) - 1, 1)
            const newWarn = { warnedAmount: dbWarn.warnedAmount - 1, reason: dbWarn.reason }
            await this.connection.query(`UPDATE warn SET warn='${JSON.stringify(newWarn)}' WHERE guildId = '${message.guild.id}' AND userId = '${warnedUser.user.id}'`).then(() => {
                const logsEmbed = new Discord.MessageEmbed()
                    .setTitle("\`💢\` Suppression de warn à un membre")
                    .setDescription(`
                \`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a supprimé le warn à:\n
                \`\`\`${warnedUser.user.tag}\`\`\`
                \`🧾\`Numéro du warn supprimé : ${args[2]} | ${warnDelete}
                `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                if (logChannel != undefined) {
                    logChannel.send(logsEmbed)

                }
                message.channel.send(lang.warn.successDelete(warnedUser.user.tag, args[2]))
            })
        }



    })
    if (args[0] !== 'clear' && args[0] !== 'list' && args[0] !== 'remove') {
        if (warn.warnedAmount >= warnBan && warnedUser.bannable && warnBan !== '0') {

            await warnedUser.createDM().then((dm) => {
                dm.send(lang.warn.banDm(warn.warnedAmount, message.guild.name)).then(() => {
                    user.deleteDM()
                    message.guild.members.ban(warnedUser, { reason: `Limite de warn ban atteinte (${warnBan}) ${warnedUser.user.tag} a donc été ban` }).then(async () => {
                        await this.connection.query(`DELETE FROM warn WHERE guildId = '${message.guild.id}' AND userId='${warnedUser.user.id}'`)
                        const logsEmbed = new Discord.MessageEmbed()
                            .setTitle("\`💢\` Ajout d'un bannissement")
                            .setDescription(`
                        \`👨‍💻\` Auteur : **${warnedUser.user.tag}** \`(${warnedUser.user.id})\` a été banni après:\n
                        \`\`\`${warnBan} warn(s)\`\`\`
                        `)
                            .setTimestamp()
                            .setFooter("🕙")
                            .setColor(`${color}`)
                        if (logChannel != undefined) {
                            logChannel.send(logsEmbed)

                        }
                    })
                }).catch(() => { });

            })

        } else if (warn.warnedAmount >= warnKick && warnedUser.kickable && warnKick !== '0') {
            await warnedUser.createDM().then((dm) => {
                dm.send(lang.warn.kickDm(warn.warnedAmount, message.guild.name)).then(() => {
                    user.deleteDM()
                    message.guild.member(warnedUser.user.id).kick({ reason: `Limite de warn kick atteinte (${warnKick}) ${warnedUser.user.tag} a donc été kick` })

                }).catch(() => { });

            })
            const logsEmbed = new Discord.MessageEmbed()
                .setTitle("\`💢\` Ajout d'une exclusion")
                .setDescription(`
                        \`👨‍💻\` Auteur : **${warnedUser.user.tag}** \`(${warnedUser.user.id})\` a été kick après:\n
                        \`\`\`${warnKick} warn(s)\`\`\`
                        `)
                .setTimestamp()
                .setFooter("🕙")
                .setColor(`${color}`)
            if (logChannel != undefined) {
                logChannel.send(logsEmbed)

            }
        } else if (warn.warnedAmount >= warnMute && warnedUser.kickable && warnMute !== '0') {
            let isSetup = checkSetup(message.guild.id);
            if (!isSetup) return message.channel.send(lang.error.noSetup);
            await warnedUser.createDM().then((dm) => {
                dm.send(lang.warn.muteDm(warn.warnedAmount, message.guild.name)).then(() => {
                    user.deleteDM()
                }).catch(() => { });

            })
            if (!warnedUser.roles.cache.has(muteRoleId.get(message.guild.id))) {
                warnedUser.roles.add(muteRoleId.get(message.guild.id), { reason: `Limite de warn kick atteinte (${warnMute}) ${warnedUser.user.tag} a donc été mute` }).then(() => {
                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle("\`💢\` Mute d'un membre&")
                        .setDescription(`
                    \`👨‍💻\` Auteur : **${warnedUser.user.tag}** \`(${warnedUser.user.id})\` a été mute après:\n
                    \`\`\`${warnMute} warn(s)\`\`\`
                    `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    if (logChannel != undefined) {
                        logChannel.send(logsEmbed)

                    }
                })

            }
        }
    }


});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('warnSanction', (guildId, warnArray) => {
    warnSanction.set(guildId, warnArray)
})
StateManager.on('warnU', (guildId, warnArray) => {
    warnSanction.set(guildId, warnArray)
})
StateManager.on('addMuteRole', (guildId, muteRole) => {
    muteRoleId.set(guildId, muteRole);
})

StateManager.on('muteIdFetched', (guildId, muteRole) => {
    muteRoleId.set(guildId, muteRole);
})
logsChannelF(logsChannelId, 'mod');
