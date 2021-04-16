const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
var checkOwner = require('../../function/check/botOwner');
const guildOwner = new Map();
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'setlogs',
    description: 'Setup the logs channel | Configurer le logs',
    usage: '!setlogs',
    tags: ['guildOnly'],
    category: 'owners',
    cooldown: 5
}, async (client, message, args) => {
    let modLog = new Map();
    let msgLog = new Map();
    let raidLog = new Map();
    let voiceLog = new Map();
    this.connection = StateManager.connection;
    let owner = message.guild.ownerID;
    
    if(client.BotPerso){
        const fs = require('fs');
        const path = './config.json';
        if (fs.existsSync(path)) {
            owner = require('../../config.json').owner;
        } else {
            owner = process.env.OWNER
        }
    }
    const lang = require(`../../lang/${message.guild.lang}`)
    const color = message.guild.color

    if (!client.isGuildOwner(message.guild.id, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)

    await this.connection.query(`SELECT modLog, msgLog, voiceLog, antiraidLog FROM guildConfig WHERE guildId = '${message.guild.id}'`).then((result) => {
        modLog.set(message.guild.id, result[0][0].modLog)
        msgLog.set(message.guild.id, result[0][0].msgLog)
        voiceLog.set(message.guild.id, result[0][0].voiceLog)
        raidLog.set(message.guild.id, result[0][0].antiraidLog)
    })

    const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
        dureefiltrer = response => { return response.author.id === message.author.id };
    const setlogsMsg = await message.channel.send(lang.loading)
    const reaction = ['1️⃣', '2️⃣', '3️⃣', '4️⃣','❌', '✅']
    for (reac of reaction) await setlogsMsg.react(reac)
    const logsEmbed = new Discord.MessageEmbed()
        .setTitle(lang.setlogs.embedTitle)
        .setDescription(lang.setlogs.embedDescription(raidLog.get(message.guild.id), modLog.get(message.guild.id), voiceLog.get(message.guild.id), msgLog.get(message.guild.id)))
        .setTimestamp()
        .setColor(`${color}`)
        .setFooter(client.user.username)
    setlogsMsg.edit(' ', logsEmbed)
        .then(async m => {
            const collector = m.createReactionCollector(filter, { time: 900000 });
            collector.on('collect', async r => {
                r.users.remove(message.author);
                if (r.emoji.name == '1️⃣') {
                    message.channel.send(lang.setlogs.raidChQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                            .then(async cld => {
                                var msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                    return message.channel.send(lang.setlogs.errorNotChannel)
                                }
                                if (msg.content == 'off') {
                                    await message.channel.send(lang.setlogs.disable("raid")).then((e) => {
                                        raidLog.set(message.guild.id, 'Non définie');
                                        updateEmbed()

                                        return setTimeout(() => { e.delete() }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content)&& msg.content != 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                                if (msg.content != "off") {

                                    const replyMsg = message.channel.send(lang.setlogs.successRaidCh(ch)).then((replyMSG) => {
                                        updateEmbed()
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                        }, 2000)

                                    })
                                raidLog.set(message.guild.id, ch.id)

                                }

                            });
                    })
                } else if (r.emoji.name == '2️⃣') {
                    message.channel.send(lang.setlogs.modChQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                            .then(async cld => {
                                var msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                    return message.channel.send(lang.setlogs.errorNotChannel)
                                }
                                if (msg.content == 'off') {
                                    await message.channel.send(lang.setlogs.disable("modération")).then((e) => {
                                        modLog.set(message.guild.id, 'Non définie');
                                        updateEmbed()

                                        return setTimeout(() => { e.delete() }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content)&& msg.content != 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                                if (msg.content != "off") {

                                    const replyMsg = message.channel.send(lang.setlogs.successModCh(ch)).then((replyMSG) => {
                                        updateEmbed()
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                        }, 2000)

                                    })
                                    modLog.set(message.guild.id, ch.id)

                                }

                                console.log(modLog)
                            });
                    })
                } else if (r.emoji.name == '3️⃣') {
                    message.channel.send(lang.setlogs.vocChQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                            .then(async cld => {
                                var msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                    return message.channel.send(lang.setlogs.errorNotChannel)
                                }
                                if (msg.content == 'off') {
                                    await message.channel.send(lang.setlogs.disable("vocal")).then((e) => {
                                        voiceLog.set(message.guild.id, 'Non définie');
                                        updateEmbed()

                                        return setTimeout(() => { e.delete() }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content != 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content != 'off') ch = msg.mentions.channels.first();
                                if (msg.content != "off") {
                                    const replyMsg = message.channel.send(lang.setlogs.successVocCh(ch)).then((replyMSG) => {
                                        updateEmbed()
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                        }, 2000)

                                    })
                                    voiceLog.set(message.guild.id, ch.id)
                                }


                            });
                    })
                } else if (r.emoji.name == '4️⃣') {
                    message.channel.send(lang.setlogs.msgChQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                            .then(async cld => {
                                var msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                    return message.channel.send(lang.setlogs.errorNotChannel)
                                }
                                if (msg.content == 'off') {
                                    await message.channel.send(lang.setlogs.disable("messages")).then((e) => {
                                        msgLog.set(message.guild.id, 'Non définie');
                                        updateEmbed()

                                        return setTimeout(() => { e.delete() }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content)&& msg.content != 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                                if (msg.content != "off") {

                                    const replyMsg = message.channel.send(lang.setlogs.successMsgCh(ch)).then((replyMSG) => {
                                        updateEmbed()
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                        }, 2000)

                                    })
                                msgLog.set(message.guild.id, ch.id)

                                }

                            });
                    })
                
                } else if (r.emoji.name == '❌') {
                    message.channel.send(lang.setlogs.cancel).then((mp) => {
                        voiceLog.delete(message.guild.id);
                        msgLog.delete(message.guild.id);
                        raidLog.delete(message.guild.id);
                        modLog.delete(message.guild.id);
                        collector.stop();
                        setTimeout(async () => { mp.delete() }, 2000)
                        return setlogsMsg.delete();

                    })
                } else if (r.emoji.name == '✅') {
                    message.channel.send(lang.setlogs.save).then((mp) => {
                        this.connection.query(`UPDATE guildConfig SET antiraidLog = '${raidLog.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                        this.connection.query(`UPDATE guildConfig SET modLog = '${modLog.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                        this.connection.query(`UPDATE guildConfig SET voiceLog = '${voiceLog.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                        this.connection.query(`UPDATE guildConfig SET msgLog = '${msgLog.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                        collector.stop();
                        setTimeout(async () => { mp.delete() }, 2000)
                        StateManager.emit('raidLogUp', message.guild.id, raidLog.get(message.guild.id))
                        StateManager.emit('modLogUp', message.guild.id, modLog.get(message.guild.id))
                        StateManager.emit('voiceLogUp', message.guild.id, voiceLog.get(message.guild.id))
                        StateManager.emit('msgLogUp', message.guild.id, msgLog.get(message.guild.id))
                        voiceLog.delete(message.guild.id);
                        msgLog.delete(message.guild.id);
                        raidLog.delete(message.guild.id);
                        modLog.delete(message.guild.id);
                        return setlogsMsg.delete();

                    })
                }
            })
            function updateEmbed() {
                logsEmbed.setDescription(lang.setlogs.embedDescription(raidLog.get(message.guild.id), modLog.get(message.guild.id), voiceLog.get(message.guild.id), msgLog.get(message.guild.id)))
                setlogsMsg.edit(logsEmbed)
                // msgembed.addField(`\`🕙\`  Durée`, `${prettyMilliseconds(time.get(message.guild.id))}`, true)
                // msgembed.addField(`\`🏷️\`  Salon`, `<#${channel}>`, true)
                // msgembed.addField(`\`🕵️\` Gagnant imposé`, `<@${win}>`, true)
                // msgembed.addField(`\`🔊\` Présence en vocal`, `${voice}`, true)
                // msgembed.addField(`\`🎁\` Gain`, `${gains}`, true)

            }
        })

    // message.channel.send(lang.setlogs.channelQ)
    // const responseLogsChannel = await message.channel.awaitMessages(m => m.author.id === message.author.id, {max : 1, timeout: 30000, errors: ['time']}).catch(() => {message.channel.send("Opération annulée pas de réponse après 30s")})
    // const CollectedLogsChannel = responseLogsChannel.first()
    // if(CollectedLogsChannel.content.toLowerCase()  == "cancel") return message.channel.send(lang.cancel)


    // let channelLogs = CollectedLogsChannel.mentions.channels.first();
    // const guildId = message.guild.id;

    // try {

    //     await this.connection.query(
    //         `UPDATE guildConfig SET antiraidLogs = '${channelLogs.id}' WHERE guildId = '${guildId}'`
    //     );


    //     message.channel.send(lang.setlogs.success(channelLogs))
    //     StateManager.emit('addAntiraidLogs', guildId, channelLogs.id);

    // } catch(err) {
    //     console.log(err)
    //     message.channel.send(lang.setlogs.error(channelLogs))
    // }

});

embedsColor(guildEmbedColor);
StateManager.on('ownerUpdate', (guildId, data) => {
    guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) => {
    guildOwner.set(guildId, data);

})
langF(guildLang);
