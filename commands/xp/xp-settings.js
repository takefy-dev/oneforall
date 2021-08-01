module.exports = {

    name: 'xp-settings',
    description: 'Configure the settings for the xp (amount per msg/amount per s voc) | Configure les paramètre pour le gain xp (gain par msg/gain par s voc',
    category: 'xp',
    usage: 'xp-settings',
    aliases: ['xp-setting', 'xp-config'],
    clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    userPermissions: ['ADMINISTRATOR'],
    guildOwnerOnly: true,
    cooldown: 4,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const lang = guildData.lang;
        const color = guildData.get('color');
        let tempConfig = client.functions.copyObject(guildData.get('xp'))
        const fistMsg = await message.channel.send(lang.loading)
        const emojis = ['💦', '💮', '🉐', '💤', '💹', '💨', '❌', '✅']
        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        for (const em of emojis) await fistMsg.react(em)
        fistMsg.edit({
            content: null,
            embeds: [lang.xpSettings.embed(tempConfig, client.functions.enableEmoji(tempConfig.enable)).setColor(color)]
        }).then(async m => {
            const collector = m.createReactionCollector({filter, time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === emojis[0]) {
                    message.channel.send(lang.xpSettings.question.xpPerMsg).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(cld => {
                                const msg = cld.first();
                                if (msg.content === 'cancel') {
                                    msg.delete()
                                    mp.delete()
                                    return message.channel.send(lang.cancel)
                                }
                                if (msg.content.length > 7) return

                                if (msg.content.includes('-')) {
                                    const value = msg.content.split('-')
                                    const min = value[0]
                                    const max = value[1]
                                    if (!min && isNaN(min) || !max && isNaN(max)) return message.channel.send(lang.xpSettings.error.wrongRange).then((rp) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            rp.delete()
                                            msg.delete()
                                        }, 3000)
                                    })
                                    tempConfig.xpPerMsg = msg.content
                                } else if (isNaN(msg.content)) {
                                    return message.channel.send(lang.xpSettings.error.notNumber).then((rp) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            rp.delete()
                                            msg.delete()
                                        }, 3000)

                                    })

                                } else {
                                    tempConfig.xpPerMsg = parseInt(msg.content)
                                }
                                setTimeout(() => {
                                    mp.delete()
                                    msg.delete()
                                }, 3000)
                                updateEmbed()


                            })
                    })
                }
                if (r.emoji.name === emojis[1]) {
                    message.channel.send(lang.xpSettings.question.xpPerVoc).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(cld => {
                                const msg = cld.first();
                                if (msg.content === 'cancel') {
                                    msg.delete()
                                    mp.delete()
                                    return message.channel.send(lang.cancel)
                                }
                                if (msg.content.length > 7) return
                                if (msg.content.includes('-')) {
                                    const value = msg.content.split('-')
                                    const min = value[0]
                                    const max = value[1]
                                    if (!min && isNaN(min) || !max && isNaN(max)) return message.channel.send(lang.xpSettings.error.wrongRange).then((rp) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            rp.delete()
                                            msg.delete()
                                        }, 3000)
                                    })
                                    tempConfig.xpPerSVoc = msg.content
                                } else if (isNaN(msg.content)) {
                                    return message.channel.send(lang.xpSettings.error.notNumber).then((rp) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            rp.delete()
                                            msg.delete()
                                        }, 3000)

                                    })

                                } else {
                                    tempConfig.xpPerSVoc = parseInt(msg.content)
                                }
                                setTimeout(() => {
                                    mp.delete()
                                    msg.delete()
                                }, 3000)
                                updateEmbed()
                            })
                    })
                }
                if (r.emoji.name === emojis[2]) {
                    message.channel.send(lang.xpSettings.question.allowChannel).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(cld => {
                                const msg = cld.first();
                                if (msg.content === 'cancel') {
                                    msg.delete()
                                    mp.delete()
                                    return message.channel.send(lang.cancel)
                                }
                                const channel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                                if (!channel && msg.content !== "all") return message.channel.send(lang.xpSettings.error.notChannel).then((rp) => {
                                    setTimeout(() => {
                                        mp.delete()
                                        rp.delete()
                                        msg.delete()
                                    }, 3000)
                                })
                                if (channel && !tempConfig.allowChannels.includes(channel.id)) {
                                    if (tempConfig.allowChannels.includes("all")) tempConfig.allowChannels = []
                                    if (tempConfig.forbidChannels.includes(channel.id)) tempConfig.forbidChannels = tempConfig.forbidChannels.filter(id => id !== channel.id)
                                    tempConfig.allowChannels.push(channel.id)
                                } else if (msg.content === "all") tempConfig.allowChannels = ['all']

                                setTimeout(() => {
                                    mp.delete()
                                    msg.delete()
                                }, 3000)
                                updateEmbed()
                            })
                    })
                }
                if (r.emoji.name === emojis[3]) {
                    message.channel.send(lang.xpSettings.question.forbidChannel).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(cld => {
                                const msg = cld.first();
                                if (msg.content === 'cancel') {
                                    msg.delete()
                                    mp.delete()
                                    return message.channel.send(lang.cancel)
                                }
                                const channel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                                if (!channel && msg.content !== "all") return message.channel.send(lang.xpSettings.error.notChannel).then((rp) => {
                                    setTimeout(() => {
                                        mp.delete()
                                        rp.delete()
                                        msg.delete()

                                    }, 3000)
                                })
                                if (channel && !tempConfig.forbidChannels.includes(channel.id)) {
                                    if (tempConfig.forbidChannels.includes("all")) tempConfig.forbidChannels = []
                                    if (tempConfig.allowChannels.includes(channel.id)) tempConfig.allowChannels = tempConfig.allowChannels.filter(id => id !== channel.id)

                                    tempConfig.forbidChannels.push(channel.id)
                                } else if (msg.content === "all") tempConfig.forbidChannels = ['all']

                                setTimeout(() => {
                                    mp.delete()
                                    msg.delete()
                                }, 3000)
                                updateEmbed()
                            })
                    })
                }
                if (r.emoji.name === emojis[4]) {
                    const temp = {}
                    message.channel.send(lang.xpSettings.question.multiplierChannel).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(cld => {
                                const msg = cld.first();
                                if (msg.content === 'cancel') {
                                    msg.delete()
                                    mp.delete()
                                    return message.channel.send(lang.cancel)
                                }

                                const channel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                                if (!channel) return message.channel.send(lang.xpSettings.error.notChannel).then((rp) => {
                                    setTimeout(() => {
                                        mp.delete()
                                        rp.delete()
                                        msg.delete()
                                    }, 3000)
                                })
                                temp.channel = channel.id
                                message.channel.send(lang.xpSettings.question.multiplier).then(mp => {
                                    mp.channel.awaitMessages({
                                        filter: dureefiltrer,
                                        max: 1,
                                        time: 30000,
                                        errors: ['time']
                                    })
                                        .then(cld => {
                                            const msg = cld.first();
                                            if (msg.content === 'cancel') {
                                                msg.delete()
                                                mp.delete()
                                                return message.channel.send(lang.cancel)
                                            }
                                            if (msg.content.length > 7) return
                                            if (msg.content.includes('-')) {
                                                const value = msg.content.split('-')
                                                const min = value[0]
                                                const max = value[1]
                                                if (!min && isNaN(min) || !max && isNaN(max)) return message.channel.send(lang.xpSettings.error.wrongRange).then((rp) => {
                                                    setTimeout(() => {
                                                        mp.delete()
                                                        rp.delete()
                                                        msg.delete()
                                                    }, 3000)
                                                })
                                                temp.boost = msg.content
                                            } else if (isNaN(msg.content)) {
                                                return message.channel.send(lang.xpSettings.error.notNumber).then((rp) => {
                                                    setTimeout(() => {
                                                        mp.delete()
                                                        rp.delete()
                                                        msg.delete()
                                                    }, 3000)

                                                })

                                            } else {
                                                temp.boost = parseInt(msg.content)
                                            }
                                            setTimeout(() => {
                                                mp.delete()
                                                msg.delete()

                                            }, 3000)

                                            tempConfig.multiplerChannels = tempConfig.multiplerChannels.filter(boost => boost.channel !== temp.channel)

                                            if (temp.boost !== 0) {
                                                tempConfig.multiplerChannels.push(temp)

                                            }
                                            updateEmbed()
                                        })

                                })


                            })


                    })
                }
                if (r.emoji.name === emojis[5]) {
                    tempConfig.enable = !tempConfig.enable
                    message.guild.channels.cache.filter(channel => channel.type === "voice" && channel.members.size > 0).map(channel => channel.members).forEach(members => members.forEach(member => {
                        if (tempConfig.enable)
                            client.managers.voiceManager.addVoice(`${message.guild.id}-${member.id}`, member);
                        else
                            client.managers.voiceManager.delete(`${message.guild.id}-${member.id}`);

                    }))

                    updateEmbed()
                }
                if (r.emoji.name === emojis[6]) {
                    collector.stop('cancel')
                }
                if (r.emoji.name === emojis[7]) {
                    guildData.set('xp', tempConfig).save().then(() => {
                        message.channel.send(lang.xpSettings.save)
                        fistMsg.delete()
                    })
                }
            })
            collector.on('end', async (_, reason) => {
                if (reason === 'cancel') {
                    message.channel.send(lang.cancel).then((m) => {
                        setTimeout(() => {
                            fistMsg.delete()
                            m.delete()
                        }, 3000)
                    })
                }
            })
        })

        function updateEmbed() {
            fistMsg.edit({embeds: [lang.xpSettings.embed(tempConfig, client.functions.enableEmoji(tempConfig.enable)).setColor(color)]})
        }


    }
}