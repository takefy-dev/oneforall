const Discord = require('discord.js')

module.exports = {

    name: 'counter',
    description: "Show the counter creation menu | Afficher le menu de création d'un compteur",
    // Optionnals :
    usage: 'counter',
    category: 'misc',
    aliases: ['compteur'],
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],
    cooldown: 5,

    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color');
        const lang = guildData.lang;
        const msg = await message.channel.send(lang.loading)
        const emoji = ['👥', '🤖', '🔊', '🟢', '⭕', '📖', '✨', '💠', '❌', '✅']
        for (const em of emoji) {
            await msg.react(em)
        }
        let tempCounter = client.functions.copyObject(guildData.get('counter'));
        const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.counter.embedTitle)
            .setDescription(lang.counter.embedDescription(guildData.get('counter')))
            .setTimestamp()
            .setColor(color)
            .setFooter(client.user.username)
        msg.edit({content: null, embeds: [embed]}).then(async m => {
            const collector = m.createReactionCollector({filter, time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === emoji[0]) {
                    message.channel.send(lang.counter.memberChQ).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.channel.send(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.channel.send(lang.counter.disable("de membre")).then((e) => {
                                        tempCounter.member = {
                                            id: undefined,
                                            name: `Non définie`
                                        }
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === 'voice') {

                                    const replyMsg = message.channel.send(lang.counter.successMemberCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })

                                    message.channel.send(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages(dureefiltrer, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                tempCounter.member = {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                }

                                                const replayMsg = message.channel.send(lang.counter.successMemberName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[1]) {
                    message.channel.send(lang.counter.botChQ).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.channel.send(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.channel.send(lang.counter.disable("de bots")).then((e) => {
                                        tempCounter.bot = {
                                            id: undefined,
                                            name: `Non définie`
                                        }
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === 'voice') {

                                    const replyMsg = message.channel.send(lang.counter.successBotCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.channel.send(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages(dureefiltrer, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                tempCounter.bot = {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                }

                                                const replayMsg = message.channel.send(lang.counter.successBotName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })


                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[2]) {
                    message.channel.send(lang.counter.vocalChQ).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.channel.send(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.channel.send(lang.counter.disable("de membre en vocal")).then((e) => {
                                        tempCounter.voice = {
                                            id: undefined,
                                            name: `Non définie`
                                        }

                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === 'voice') {

                                    const replyMsg = message.channel.send(lang.counter.successVocalCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.channel.send(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages(dureefiltrer, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                tempCounter.voice = {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                }
                                                const replayMsg = message.channel.send(lang.counter.successVocalName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[3]) {
                    message.channel.send(lang.counter.onlineChQ).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.channel.send(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.channel.send(lang.counter.disable("de membre en ligne")).then((e) => {
                                        tempCounter.online = {
                                            id: undefined,
                                            name: `Non définie`
                                        }

                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === 'voice') {

                                    const replyMsg = message.channel.send(lang.counter.successOnlineCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.channel.send(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages(dureefiltrer, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                tempCounter.online = {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                }

                                                const replayMsg = message.channel.send(lang.counter.successOnlineName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[4]) {
                    message.channel.send(lang.counter.offlineChQ).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.channel.send(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.channel.send(lang.counter.disable("de membre hors-ligne")).then((e) => {
                                        tempCounter.offline = {
                                            id: undefined,
                                            name: `Non définie`
                                        }
                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === 'voice') {

                                    const replyMsg = message.channel.send(lang.counter.successOfflineCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.channel.send(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages(dureefiltrer, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                tempCounter.offline = {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                }

                                                const replayMsg = message.channel.send(lang.counter.successOfflineName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[5]) {
                    message.channel.send(lang.counter.channelChQ).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.channel.send(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.channel.send(lang.counter.disable("de salons")).then((e) => {
                                        tempCounter.channel = {
                                            id: undefined,
                                            name: `Non définie`
                                        }

                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }

                                if (msg.content !== "off" && ch.type === 'voice') {

                                    const replyMsg = message.channel.send(lang.counter.successChannelCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.channel.send(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages(dureefiltrer, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                tempCounter.channel = {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                }

                                                const replayMsg = message.channel.send(lang.counter.successChannelName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })


                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[6]) {
                    message.channel.send(lang.counter.roleChQ).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.channel.send(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.channel.send(lang.counter.disable("de rôles")).then((e) => {
                                        tempCounter.role = {
                                            id: undefined,
                                            name: `Non définie`
                                        }

                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === 'voice') {

                                    const replyMsg = message.channel.send(lang.counter.successRoleCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.channel.send(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages(dureefiltrer, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                tempCounter.role = {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                }

                                                const replayMsg = message.channel.send(lang.counter.successRoleName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })

                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[7]) {
                    message.channel.send(lang.counter.boostChQ).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                    return message.channel.send(lang.counter.errorNotChannel)
                                }
                                if (msg.content === 'off') {
                                    await message.channel.send(lang.counter.disable("de booster")).then((e) => {
                                        tempCounter.booster = {
                                            id: undefined,
                                            name: `Non définie`
                                        }

                                        updateEmbed()

                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                let ch;
                                if (!isNaN(msg.content) && msg.content !== 'off') {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first() && msg.content !== 'off') ch = msg.mentions.channels.first();
                                if (msg.content !== "off") {
                                    if (ch.type !== 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                        return setTimeout(() => {
                                            e.delete()
                                        }, 2000);
                                    })
                                }
                                if (msg.content !== "off" && ch.type === 'voice') {

                                    const replyMsg = message.channel.send(lang.counter.successBoostCh(ch)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })
                                    message.channel.send(lang.counter.nameQ).then((messageReply) => {
                                        messageReply.channel.awaitMessages(dureefiltrer, {
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        })
                                            .then(async cld => {
                                                let msg = cld.first();
                                                tempCounter.booster = {
                                                    id: ch.id,
                                                    name: `${msg.content}`
                                                }

                                                const replayMsg = message.channel.send(lang.counter.successBoostName(msg.content)).then(rp => {
                                                    setTimeout(async () => {
                                                        await rp.delete();
                                                        await messageReply.delete();
                                                        await msg.delete()
                                                    }, 2000)
                                                })
                                                updateEmbed()
                                            })
                                    })


                                }

                            });
                    })
                }
                if (r.emoji.name === emoji[8]) {
                    message.channel.send(lang.setlogs.cancel).then((mp) => {
                        tempCounter = {};
                        collector.stop();
                        setTimeout(async () => {
                            mp.delete()
                        }, 2000)
                        return msg.delete();

                    })
                }
                if (r.emoji.name === emoji[9]) {
                    message.channel.send(lang.setlogs.save).then(async (mp) => {

                        guildData.set('counter', tempCounter).save()
                        collector.stop();
                        setTimeout(async () => {
                            mp.delete()
                        }, 2000)
                        const {member, voice, online, offline, bot, channel, role, booster} = tempCounter
                        await message.guild.members.fetch();
                        if (member.id) {
                            const memberCh = message.guild.channels.cache.get(member.id)
                            memberCh.setName(`${member.name} ${message.guild.memberCount}`, 'MemberCount')
                        }
                        if (bot.id) {
                            const botCh = message.guild.channels.cache.get(bot.id)
                            botCh.setName(`${bot.name} ${message.guild.members.cache.filter(m => m.user.bot).size}`, 'BotCount')
                        }
                        if (voice.id) {
                            let count = 0;

                            const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
                            for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
                            const voiceCh = message.guild.channels.cache.get(voice.id)
                            voiceCh.setName(`${voice.name} ${count}`, 'VoiceCount')
                        }
                        if (online.id) {
                            const onlineCh = message.guild.channels.cache.get(online.id)
                            onlineCh.setName(`${online.name} ${message.guild.members.cache.filter(member => member.presence.status === "dnd" || member.presence.status === "idle" || member.presence.status === "online").size}`, 'OnlineCount')

                        }
                        if (offline.id) {
                            const offlineCh = message.guild.channels.cache.get(offline.id)
                            offlineCh.setName(`${offline.name} ${message.guild.members.cache.filter(member => member.presence.status == "offline").size}`, 'OfflineCount')
                        }
                        if (channel.id) {
                            const channelCh = message.guild.channels.cache.get(channel.id)
                            channelCh.setName(`${channel.name} ${message.guild.channels.cache.size}`, 'ChannelCount')
                        }
                        if (role.id) {
                            const roleCh = message.guild.channels.cache.get(role.id)
                            roleCh.setName(`${role.name} ${message.guild.roles.cache.size}`, 'RoleCount')
                        }
                        if (booster.id) {
                            const boostCh = message.guild.channels.cache.get(booster.id)
                            boostCh.setName(`${booster.name} ${message.guild.premiumSubscriptionCount || '0'}`, 'BoosterCount')
                        }
                        tempCounter = {};


                        return msg.delete();

                    })
                }

                function updateEmbed() {

                    embed.setDescription(lang.counter.embedDescription(guildData.get('counter')))
                    msg.edit({embeds: [embed]})


                }
            })
        })
    }
};

