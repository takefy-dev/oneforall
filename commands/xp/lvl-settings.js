const Command = require('../../structures/Handler/Command');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'lvl-settings',
            description: 'Manage the settings for levels | Gerer les paramètre pour le système de levels',
            category: 'xp',
            usage: 'lvl-settings',
            aliases: ['lvl-config', 'lvl-setting'],
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly: true,
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const lang = guildData.lang;
        const color = guildData.get('color');
        let tempConfig = client.functions.copyObject(guildData.get('level'))
        const fistMsg = await message.channel.send(lang.loading)
        const emojis = ['💌', '➕', '➖', '💝', '❌', '✅']
        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        for (const em of emojis) await fistMsg.react(em)
        fistMsg.edit({content: null,embeds : [lang.levelSettings.embed(tempConfig, client.functions.enableEmoji(tempConfig.cumulRoles)).setColor(color)]}).then(async m => {
            const collector = m.createReactionCollector({filter, time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === emojis[0]) {
                    message.channel.send(lang.levelSettings.question.channelQuestion).then(mp => {
                        let channel;
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(cld => {
                                const msg = cld.first();
                                if (msg.content === 'cancel') {
                                    msg.delete()
                                    mp.delete()
                                    return message.channel.send(lang.cancel)
                                }
                                if (msg.content === "off") {
                                    msg.delete()
                                    mp.delete()
                                    tempConfig.lvlMessage = {message: 'Non définie', channel: 'Non définie'}
                                    return updateEmbed()
                                }
                                channel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                                if (!channel) return message.channel.send(lang.xpSettings.error.notChannel).then((rp) => {
                                    setTimeout(() => {
                                        mp.delete()
                                        rp.delete()
                                        msg.delete()
                                    }, 3000)
                                })

                                message.channel.send(lang.levelSettings.question.messageQuestion).then(mps => {
                                    mps.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                                        .then(cld => {
                                            const msg = cld.first();

                                            if (msg.content === "help") {
                                                msg.delete()
                                                mp.delete()
                                                mps.delete()
                                                return message.channel.send(`{memberMention}\n{memberTag}\n{memberLvl}\n{memberXp}\n{memberLbPosition}`)
                                            }
                                            tempConfig.lvlMessage.message = msg.content
                                            tempConfig.lvlMessage.channel = channel.id;
                                            updateEmbed()

                                            setTimeout(() => {
                                                mp.delete()
                                                msg.delete()
                                                mps.delete()
                                            }, 3000)
                                        })
                                })
                            })
                    })
                }
                if(r.emoji.name === emojis[1]){
                    message.channel.send(lang.levelSettings.question.roleQuestion).then(mp => {
                        let role;
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                const msg = cld.first();
                                if (msg.content === 'cancel') {
                                    await msg.delete()
                                    mp.delete()
                                    return message.channel.send(lang.cancel)
                                }
                                role = msg.mentions.roles.first() || message.guild.roles.cache.get(msg.content)
                                if (!role) return message.channel.send(lang.levelSettings.error.noRole).then((rp) => {
                                    setTimeout(() => {
                                        mp.delete()
                                        rp.delete()
                                        msg.delete()
                                    }, 3000)
                                })
                                if (role.managed) {
                                    const replyMsg = await message.channel.send(lang.reactionRole.managedRole);
                                    return setTimeout(async () => {
                                        await replyMsg.delete();
                                        await msg.delete()
                                        return await mp.delete()
                                    }, 2000)
                                }
                                if(client.functions.roleHasSensiblePermissions(role.permissions)){
                                    const replyMsg = await message.channel.send(lang.reactionRole.tryToPermsRole);
                                    const raidLog = guildData.get('logs').antiraid;
                                    const raidLogChannel = message.guild.channels.cache.get(raidLog);
                                    if(raidLogChannel && !raidLogChannel.deleted){
                                        raidLogChannel.send('@everyone', lang.logs.reactRolePerm(message.member, color, msg.id, `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`))
                                    }
                                    return setTimeout(async () => {
                                        await replyMsg.delete();
                                        await msg.delete()
                                        return await mp.delete()
                                    }, 2000)
                                }

                                const roleLevel = tempConfig.roleLevel.find(roleLvl => roleLvl.role === role.id)
                                if(roleLevel) return message.channel.send(lang.levelSettings.error.roleAlready(role.name)).then((rp) => {
                                    setTimeout(() => {
                                        mp.delete()
                                        rp.delete()
                                        msg.delete()
                                    }, 3000)
                                })
                                message.channel.send(lang.levelSettings.question.levelQuestion(role.name)).then(mps => {
                                    mps.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                                        .then(cld => {
                                            const msg = cld.first();
                                            if(isNaN(msg.content)) return message.channel.send(lang.levelSettings.error.notNumber).then((rp) => {
                                                setTimeout(() => {
                                                    mp.delete()
                                                    rp.delete()
                                                    msg.delete()
                                                }, 3000)

                                            })
                                            tempConfig.roleLevel.push({role: role.id, level : msg.content})
                                            updateEmbed()
                                            setTimeout(() => {
                                                mp.delete()
                                                msg.delete()
                                                mps.delete()
                                            }, 3000)

                                        })
                                })
                            })
                    })
                }
                if(r.emoji.name === emojis[2]){
                    message.channel.send(lang.levelSettings.question.roleQuestionRm).then(mp => {
                        mp.channel.awaitMessages({filter: dureefiltrer, max: 1, time: 30000, errors: ['time']})
                            .then(cld => {
                                const msg = cld.first();
                                if (msg.content === 'cancel') {
                                    msg.delete()
                                    mp.delete()
                                    return message.channel.send(lang.cancel)
                                }
                                const role = msg.mentions.roles.first() || message.guild.roles.cache.get(msg.content)
                                if (!role) return message.channel.send(lang.levelSettings.error.noRole).then((rp) => {
                                    setTimeout(() => {
                                        mp.delete()
                                        rp.delete()
                                        msg.delete()
                                    }, 3000)
                                })
                                const roleLevel = tempConfig.roleLevel.find(roleLvl => roleLvl.role === role.id)
                                if(!roleLevel) return message.channel.send(lang.levelSettings.error.roleNot(role.name)).then((rp) => {
                                    setTimeout(() => {
                                        mp.delete()
                                        rp.delete()
                                        msg.delete()
                                    }, 3000)
                                })
                                tempConfig.roleLevel = tempConfig.roleLevel.filter(roleLvl => roleLvl.role !== role.id)
                                updateEmbed()
                                setTimeout(() => {
                                    mp.delete()
                                    msg.delete()
                                }, 3000)
                            })
                    })
                }
                if(r.emoji.name === emojis[3]){
                    tempConfig.cumulRoles = !tempConfig.cumulRoles
                    updateEmbed()
                }
                if(r.emoji.name === emojis[4]){
                    collector.stop('cancel')
                }
                if(r.emoji.name === emojis[5]){
                    guildData.set('level', tempConfig).save().then(() => {
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
            fistMsg.edit({embeds : [lang.levelSettings.embed(tempConfig, client.functions.enableEmoji(tempConfig.cumulRoles)).setColor(color)]})
        }
    }

}