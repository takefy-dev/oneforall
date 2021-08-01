const Discord = require('discord.js')

module.exports = {

    name: 'setlogs',
    description: 'Setup the logs channel | Configurer le logs',
    usage: 'setlogs',
    tags: ['guildOnly'],
    category: 'owners',
    guildOwnerOnly: true,
    cooldown: 4,

    run: async (client, message, args) => {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const tempLogs = client.functions.copyObject(guildData.get('logs'))

        const lang = guildData.lang;
        const color = guildData.get('color')
        const logs = message.guild.logs;


        const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const setlogsMsg = await message.channel.send(lang.loading)
        const reaction = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌', '✅']
        for (let reac of reaction)
            await setlogsMsg.react(reac)

        const logsEmbed = new Discord.MessageEmbed()
            .setTitle(lang.setlogs.embedTitle)
            .setDescription(lang.setlogs.embedDescription(tempLogs.antiraid, tempLogs.mod, tempLogs.voice, tempLogs.message))
            .setTimestamp()
            .setColor(`${color}`)
            .setFooter(client.user.username)
        setlogsMsg.edit({embeds: [logsEmbed]})
            .then(async m => {
                const collector = m.createReactionCollector({filter, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === '1️⃣') {
                        message.channel.send(lang.setlogs.raidChQ).then(mp => {
                            mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                        return message.channel.send(lang.setlogs.errorNotChannel)
                                    }
                                    if (msg.content === 'off') {
                                        await message.channel.send(lang.setlogs.disable("raid")).then((e) => {
                                            tempLogs.antiraid = 'Non définie'
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

                                        const replyMsg = message.channel.send(lang.setlogs.successRaidCh(ch)).then((replyMSG) => {
                                            updateEmbed()
                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                            }, 2000)

                                        })
                                        tempLogs.antiraid = ch.id

                                    }

                                });
                        })
                    } else if (r.emoji.name === '2️⃣') {
                        message.channel.send(lang.setlogs.modChQ).then(mp => {
                            mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                        return message.channel.send(lang.setlogs.errorNotChannel)
                                    }
                                    if (msg.content === 'off') {
                                        await message.channel.send(lang.setlogs.disable("modération")).then((e) => {
                                            tempLogs.mod = 'Non définie'
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

                                        const replyMsg = message.channel.send(lang.setlogs.successModCh(ch)).then((replyMSG) => {
                                            updateEmbed()
                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                            }, 2000)

                                        })
                                        tempLogs.mod = ch.id;

                                    }

                                });
                        })
                    } else if (r.emoji.name === '3️⃣') {
                        message.channel.send(lang.setlogs.vocChQ).then(mp => {
                            mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                        return message.channel.send(lang.setlogs.errorNotChannel)
                                    }
                                    if (msg.content === 'off') {
                                        await message.channel.send(lang.setlogs.disable("vocal")).then((e) => {
                                            tempLogs.voice = 'Non définie'
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
                                        const replyMsg = message.channel.send(lang.setlogs.successVocCh(ch)).then((replyMSG) => {
                                            updateEmbed()
                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                            }, 2000)

                                        })
                                        tempLogs.voice = ch.id
                                    }


                                });
                        })
                    } else if (r.emoji.name === '4️⃣') {
                        message.channel.send(lang.setlogs.msgChQ).then(mp => {
                            mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content !== 'off') {
                                        return message.channel.send(lang.setlogs.errorNotChannel)
                                    }
                                    if (msg.content === 'off') {
                                        await message.channel.send(lang.setlogs.disable("messages")).then((e) => {
                                            tempLogs.message = 'Non définie'
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

                                        const replyMsg = message.channel.send(lang.setlogs.successMsgCh(ch)).then((replyMSG) => {
                                            updateEmbed()
                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                            }, 2000)

                                        })
                                        tempLogs.message = ch.id;

                                    }

                                });
                        })

                    } else if (r.emoji.name === '❌') {
                        message.channel.send(lang.setlogs.cancel).then((mp) => {
                            collector.stop();
                            setTimeout(async () => {
                                mp.delete()
                            }, 2000)
                            return setlogsMsg.delete();

                        })
                    } else if (r.emoji.name === '✅') {
                        message.channel.send(lang.setlogs.save).then(async (mp) => {
                            guildData.set('logs', tempLogs).save().then(async () => {
                                collector.stop();
                                setTimeout(async () => {
                                    mp.delete()
                                }, 2000)
                                return setlogsMsg.delete();
                            })


                        })
                    }
                })

                function updateEmbed() {
                    logsEmbed.setDescription(lang.setlogs.embedDescription(tempLogs.antiraid, tempLogs.mod, tempLogs.voice, tempLogs.message))
                    setlogsMsg.edit(logsEmbed)


                }
            })


    }
}
