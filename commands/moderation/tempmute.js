const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var checkSetup = require('../../function/check/checkSetup');
var embedsColor = require('../../function/embedsColor');
const prettyMilliseconds = require('pretty-ms');
const ms = require('ms');
const { Command } = require('advanced-command-handler');
const mute = require('./mute');
const muteRoleId = new Map();
const guildLang = new Map();
var logsChannelF = require('../../function/fetchLogs');
const logsChannelId = new Map();
const moment = require('moment')
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'tempmute',
    description: 'Tempmute a members | Tempmute un membre',
    // Optionnals :
    usage: '!tempmute <mention/id> <time>',
    category: 'moderation',
    userPermissions: ['MUTE_MEMBERS'],
    clientPermissions: ['MUTE_MEMBERS'],
    cooldown: 4
}, async (client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)
    this.connection = StateManager.connection;
    let isSetup = checkSetup(message.guild.id);
    if (!isSetup) return message.channel.send(lang.error.noSetup);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(lang.tempmute.errorNoMember);

    const muteRole = message.guild.roles.cache.get(muteRoleId.get(message.guild.id));
    if (!muteRole) return message.channel.send(lang.tempmute.errorCantFindRole);

    const time = args[1];
    if (!time || isNaN(ms(time))) return message.channel.send(lang.tempmute.errorTime);

    if (member.roles.cache.has(muteRole.id)) return message.channel.send(lang.tempmute.errorAlreadyMute(member));
    member.roles.add(muteRole).then(async () => {
        const color = guildEmbedColor.get(message.guild.id);

        message.channel.send(lang.tempmute.success(member, time));
        let logChannelId = logsChannelId.get(message.guild.id);
        if (logChannelId != undefined) {
            let logChannel = message.guild.channels.cache.get(logChannelId)

            const logsEmbed = new Discord.MessageEmbed()
                .setTitle("\`❌\` Mute temporaire d'un membre")
                .setDescription(`
					\`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a mute **${member.user.tag}** \`(${member.user.id})\` pendant :\n
                    \`\`\`${time}\`\`\`

					`)
                .setTimestamp()
                .setFooter("🕙")
                .setColor(`${color}`)
            if (logChannel != undefined) {
                logChannel.send(logsEmbed)

            }
            const timeLenght = time.split('').length
            const numberT = parseInt(time.slice(0, timeLenght - 1))
            const dateF = time.split('')[timeLenght - 1].toString()
            const now = moment(Date.now())
            const muteEnd = now.add(numberT, dateF).format("YYYY-MM-DD HH:mm:ss")
            try {
                await this.connection.query(`INSERT INTO tempMute (userId, guildId, mutedAt, muteEnd, rawTime ) VALUES ('${member.user.id}', '${message.guild.id}', NOW(), '${muteEnd}', '${time}')`).then((res) => {
                    this.connection.query(`SELECT * FROM tempMute`).then((result) => {
                        let mutedUser = []
                        result[0].forEach(member => {
                            mutedUser.push(member)
                        })
                        StateManager.emit('tempMute', mutedUser)
                    })
                    // StateManager.emit('tempMute', message.guild.id, [{id:}])
                })

            } catch (err) {
                console.log(err)
            }

        }


    })

    // setTimeout(function () {
    //     if (!member.roles.cache.has(muteRole.id)) return message.channel.send(lang.tempmute.errorUnMute(member, time))
    //     member.roles.remove(muteRole).then(() => {

    //         message.channel.send(lang.tempmute.successUnMute(member, time));
    //         let logChannelId = logsChannelId.get(message.guild.id);
    //         if (logChannelId != undefined) {
    //             let logChannel = message.guild.channels.cache.get(logChannelId)
    //             const logsEmbed = new Discord.MessageEmbed()
    //                 .setTitle("\`❌\` Unmute temporaire d'un membre")
    //                 .setDescription(`
    // 				\`👨‍💻\` Auteur : **${member.user.tag}** \`(${member.user.id})\` est unmute après :\n
    //                 \`\`\`${time}\`\`\`

    // 				`)
    //                 .setTimestamp()
    //                 .setFooter("🕙")
    //                 .setColor(`${color}`)

    //                 .setTimestamp()
    //                 .setFooter("🕙")
    //                 .setColor(`${color}`)
    //             logChannel.send(logsEmbed)
    //         }
    //     })
    // }, ms(time))


});

embedsColor(guildEmbedColor);
logsChannelF(logsChannelId, 'mod');

StateManager.on('addMuteRole', (guildId, muteRole) => {
    muteRoleId.set(guildId, muteRole);
})

StateManager.on('muteIdFetched', (guildId, muteRole) => {
    muteRoleId.set(guildId, muteRole);
})
langF(guildLang);
