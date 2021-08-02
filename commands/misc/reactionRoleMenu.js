const {Util, Collection, MessageActionRow, MessageSelectMenu} = require('discord.js'),
    Discord = require('discord.js')

module.exports = {

    name: 'reactrole',
    description: "Show the react role menu création | Affiche le menu de création d'un reactrole",
    usage: 'reactrole',
    category: 'moderation',
    tags: ['guildOnly'],
    clientPermissions: ['SEND_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS'],
    userPermissions: ['ADMINISTRATOR'],
    cooldown: 5,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        let guildReactRoles = guildData.get('reactroles');
        const color = guildData.get('color')
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('reactrole')
                    .setPlaceholder(`Create your reactrole`)
                    .addOptions(lang.reactionRole.selectMenu)
            )
        const reactRole = {channel: 'Non définie', message: 'Non définie', emojiRoleMapping: new Collection()};
        const embed = {
            title: 'Configuration',
            fields: [
                {
                    name: 'Channel',
                    value: reactRole.channel
                },
                {
                    name: 'Message',
                    value: reactRole.message
                },
                {
                    name: 'Role with emoji',
                    value: 'Non définie'
                },
            ],
            color,
            timestamessageQuestion : new Date()
        }
        const panel = await message.channel.send({
            embeds: [embed], components: [row]
        })
        const filter = (interaction) => interaction.customId === 'reactrole' && interaction.user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const collector = panel.channel.createMessageComponentCollector({filter, time: 90000});
        collector.on('collect', async (interaction) => {
            const value = interaction.values[0]
            if (value === 'channel') {
                const messageQuestion = await message.channel.send(lang.reactionRole.chQ);
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                })
                await interaction.deferUpdate()
                await messageQuestion.channel.awaitMessages({
                    filter: dureefiltrer,
                    limit: 1,
                    max: 1,
                    time: 60000,

                    errors: ['time']
                }).then(async (cld) => {
                    const msg = cld.first()
                    await messageQuestion.delete()
                    await msg.delete()
                    row.components[0].setDisabled(false)
                    await panel.edit({
                        components: [row]
                    })
                    if (msg.content !== 'cancel') {
                        const tempChannel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content);
                        if(!tempChannel ||  tempChannel.deleted) return message.channel.send(lang.reactionRole.invalidChannel).then((rp) => {
                            setTimeout(() => {
                                rp.delete()
                            }, 3500)
                        })
                        reactRole.channel = tempChannel.id;
                        await updateEmbed()
                        message.channel.send(lang.reactionRole.successCh(tempChannel)).then((rp)=> {
                            setTimeout(() => {
                                rp.delete()
                            }, 3500)
                        });
                    }
                })

            }
            if(value === 'message'){
                const messageQuestion = await message.channel.send(lang.reactionRole.msgIdQ);
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                })
                await interaction.deferUpdate()
                await messageQuestion.channel.awaitMessages({
                    filter: dureefiltrer,
                    limit: 1,
                    max: 1,
                    time: 60000,

                    errors: ['time']
                }).then(async (cld) => {
                    const msg = cld.first()
                    await messageQuestion.delete()
                    await msg.delete()
                    row.components[0].setDisabled(false)
                    await panel.edit({
                        components: [row]
                    })
                    if (msg.content !== 'cancel') {
                        if (isNaN(msg.content)) return message.channel.send(lang.reactionRole.notId).then(rp => setTimeout(() => {
                            rp.delete()
                            msg.delete()
                            messageQuestion.delete()
                        }, 2000))
                        if (reactRole.channel === 'Non définie' || !message.guild.channels.cache.get(reactRole.channel)) return message.channel.send(lang.reactionRole.noChannel).then(rp => setTimeout(() => {
                            rp.delete()
                            msg.delete()
                            messageQuestion.delete()
                        }, 2000))
                        const messageFetched = await message.guild.channels.cache.get(reactRole.channel).messages.fetch(msg.content)
                        if (guildReactRoles && guildReactRoles.find(react => react.message === messageFetched.id)) {
                            return await message.channel.send(lang.reactionRole.alreadyReact).then(rp => setTimeout(() => {
                                rp.delete()
                                msg.delete()
                                messageQuestion.delete()
                            }, 2000))
                        }
                        reactRole.message = messageFetched.id
                        await updateEmbed();
                        setTimeout(async () => {
                            await messageQuestion.delete();
                            await msg.delete();
                        }, 2000)
                    }
                })

            }
            if(value === 'add-role'){
                const messageQuestion = await message.channel.send(lang.reactionRole.roleQ);
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                })
                await interaction.deferUpdate()
                await messageQuestion.channel.awaitMessages({
                    filter: dureefiltrer,
                    limit: 1,
                    max: 1,
                    time: 60000,

                    errors: ['time']
                }).then(async (cld) => {
                    const msg = cld.first()
                    await messageQuestion.delete()
                    await msg.delete()
                    row.components[0].setDisabled(false)
                    await panel.edit({
                        components: [row]
                    })
                    if (msg.content !== 'cancel') {
                        let role;
                        if (msg.content.toLowerCase() === "cancel") {
                            const reply = await message.channel.send(lang.cancel)
                            return setTimeout(async () => {
                                await reply.delete();
                                await msg.delete()
                                return await messageQuestion.delete()
                            }, 2000)
                        } else if (!msg.mentions.roles.first() && isNaN(msg.content)) {
                            const replyMsg = await message.channel.send(lang.reactionRole.noRole);
                            return setTimeout(async () => {
                                await replyMsg.delete();
                                await msg.delete()
                                return await messageQuestion.delete()
                            }, 2000)
                        } else if (!isNaN(msg.content)) {
                            role = message.guild.channels.cache.get(msg.content);

                        } else if (msg.mentions.roles.first()) role = msg.mentions.roles.first();
                        if (role && role.managed) {
                            const replyMsg = await message.channel.send(lang.reactionRole.managedRole);
                            return setTimeout(async () => {
                                await replyMsg.delete();
                                await msg.delete()
                                return await messageQuestion.delete()
                            }, 2000)
                        }
                        if (role && client.functions.roleHasSensiblePermissions(role.permissions)) {
                            const replyMsg = await message.channel.send(lang.reactionRole.tryToPermsRole);
                            const raidLog = guildData.get('logs').antiraid;
                            const raidLogChannel = message.guild.channels.cache.get(raidLog);
                            if (raidLogChannel && !raidLogChannel.deleted) {
                                raidLogChannel.send({content:'@everyone', embeds : [lang.logs.reactRolePerm(message.member, color, msg.id, `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)]})
                            }
                            return setTimeout(async () => {
                                await replyMsg.delete();
                                await msg.delete()
                                return await messageQuestion.delete()
                            }, 2000)
                        }
                        for (const [key, value] of reactRole.emojiRoleMapping) {
                            if (value === role.id) {
                                const replyMsg = await message.channel.send(lang.reactionRole.roleAlready);
                                return setTimeout(async () => {
                                    await replyMsg.delete();
                                    await msg.delete()
                                    return await messageQuestion.delete()
                                }, 2000)
                            }

                        }

                        await message.channel.send(lang.reactionRole.emojiQ).then(async messageQuestions => {
                            messageQuestions.channel.awaitMessages({
                                filter: dureefiltrer,
                                max: 1,
                                time: 50000,
                                errors: ['time']
                            })
                                .then(async cld => {
                                    let msg = cld.first();
                                    let emoji = Util.parseEmoji(msg.content);
                                    if (!emoji.id) {
                                        if (reactRole.emojiRoleMapping.has(emoji.name)) {
                                            const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                            return setTimeout(async () => {
                                                await replyMsg.delete();
                                                await msg.delete()
                                                return await messageQuestion.delete()
                                            }, 2000)
                                        }
                                        reactRole.emojiRoleMapping.set(emoji.name, role.id)
                                        await updateEmbed()
                                        setTimeout(async () => {
                                            await msg.delete()
                                            messageQuestion.delete()
                                            messageQuestions.delete()
                                        }, 2000)

                                    } else {
                                        let emojis;
                                        if (client.botperso) {
                                            emojis = client.emojis.cache.get(emoji.id)

                                        } else {
                                            await client.cluster.broadcastEval(`this.emojis.cache.get('${emoji.id}')`).then((result) => {
                                                emojis = result.find(em => em !== null)
                                            })
                                        }
                                        if (!emojis) {
                                            await message.channel.send(lang.reactionRole.emojiDoesNotExist).then(async messageQuestion => {
                                                messageQuestion.channel.awaitMessages({
                                                    filter: dureefiltrer,
                                                    max: 1,
                                                    time: 50000,
                                                    errors: ['time']
                                                })
                                                    .then(async cld => {
                                                        const name = cld.first().content;
                                                        let link = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`
                                                        message.guild.emojis.create(link, name, {reason: `emoji add par ${message.author.username}`}).then(async (em) => {
                                                            message.channel.send(lang.addemoji.success(name))
                                                            let emojis = message.guild.emojis.cache.get(em.id)
                                                            if (reactRole.emojiRoleMapping.has(emojis.id)) {
                                                                const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                                return setTimeout(async () => {
                                                                    await replyMsg.delete();
                                                                    await msg.delete()
                                                                    return await messageQuestion.delete()
                                                                }, 2000)
                                                            }
                                                            reactRole.emojiRoleMapping.set(emojis.id, role.id)
                                                            await updateEmbed()
                                                            setTimeout(async () => {
                                                                await msg.delete()
                                                                messageQuestion.delete()
                                                                messageQuestions.delete()
                                                            }, 2000)
                                                        })

                                                    })
                                            })

                                        } else {
                                            if (reactRole.emojiRoleMapping.has(emojis.id)) {
                                                const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                return setTimeout(async () => {
                                                    await replyMsg.delete();
                                                    await msg.delete()
                                                    return await messageQuestion.delete()
                                                }, 2000)
                                            }
                                            reactRole.emojiRoleMapping.set(emojis.id, role.id)
                                            await updateEmbed()
                                            setTimeout(async () => {
                                                await msg.delete()
                                                messageQuestion.delete()
                                                messageQuestions.delete()
                                            }, 2000)
                                        }

                                    }


                                });
                        })
                    }
                })
            }
            if(value === 'del-role'){
                const messageQuestion = await message.channel.send(lang.reactionRole.roleDelQ);
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                })
                await interaction.deferUpdate()
                await messageQuestion.channel.awaitMessages({
                    filter: dureefiltrer,
                    limit: 1,
                    max: 1,
                    time: 60000,

                    errors: ['time']
                }).then(async (cld) => {
                    const msg = cld.first()
                    await messageQuestion.delete()
                    await msg.delete()
                    row.components[0].setDisabled(false)
                    await panel.edit({
                        components: [row]
                    })
                    if (msg.content !== 'cancel') {
                        let msg = cld.first();
                        let role;
                        if (reactRole.emojiRoleMapping.size === 0) {
                            const reply = await message.channel.send(lang.reactionRole.noRole)
                            return setTimeout(async () => {
                                await reply.delete();
                                await msg.delete()
                                return await messageQuestion.delete()
                            }, 2000)

                        }
                        if (msg.content.toLowerCase() === "cancel") {
                            const reply = await message.channel.send(lang.cancel)
                            return setTimeout(async () => {
                                await reply.delete();
                                await msg.delete()
                                return await messageQuestion.delete()
                            }, 2000)
                        } else if (!msg.mentions.roles.first() && isNaN(msg.content)) {
                            const replyMsg = await message.channel.send(lang.reactionRole.noRole);
                            return setTimeout(async () => {
                                await replyMsg.delete();
                                await msg.delete()
                                return await messageQuestion.delete()
                            }, 2000)
                        } else if (!isNaN(msg.content)) role = message.guild.roles.cache.get(msg.content)
                        else if (msg.mentions.roles.first() && msg.content !== "cancel") role = msg.mentions.roles.first();
                        if (role && role.managed) {
                            const replyMsg = await message.channel.send(lang.reactionRole.managedRole);
                            return setTimeout(async () => {
                                await replyMsg.delete();
                                await msg.delete()
                                return await messageQuestion.delete()
                            }, 2000)
                        }
                        for (const [key, value] of reactRole.emojiRoleMapping) {
                            if (value !== role.id) {
                                const replyMsg = await message.channel.send(lang.reactionRole.roleNotFound);
                                return setTimeout(async () => {
                                    await replyMsg.delete();
                                    await msg.delete()
                                    return await messageQuestion.delete()
                                }, 2000)
                            }
                            if (value === role.id) {
                                reactRole.emojiRoleMapping.delete(key)
                            }
                        }
                        await updateEmbed()
                        setTimeout(async () => {
                            await msg.delete();
                            return await messageQuestion.delete();
                        }, 2000)
                    }
                })
            }
            if(value === 'delete'){
                const messageQuestion = await message.channel.send(lang.reactionRole.msgDeleteQ);
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                })
                await interaction.deferUpdate()
                await messageQuestion.channel.awaitMessages({
                    filter: dureefiltrer,
                    limit: 1,
                    max: 1,
                    time: 60000,

                    errors: ['time']
                }).then(async (cld) => {
                    const msg = cld.first()
                    await messageQuestion.delete()
                    await msg.delete()
                    row.components[0].setDisabled(false)
                    await panel.edit({
                        components: [row]
                    })
                    if (msg.content !== 'cancel') {
                        if(isNaN(msg.content)) return
                        const toDelete = guildReactRoles.find(reactrole => reactrole.message === msg.content);
                        if(!toDelete)return message.channel.send(lang.reactionRole.notChannelReactrole).then((rp) => {
                            setTimeout(() => {
                                msg.delete()
                                messageQuestion.delete()
                                rp.delete()
                            }, 3500)
                        })
                        const fetchMessage = await message.guild.channels.cache.get(toDelete.channel).messages.fetch(toDelete.message);
                        if(fetchMessage){
                            await fetchMessage.reactions.removeAll()
                        }
                        guildReactRoles = guildReactRoles.filter(react => react.message !== msg.content)
                        guildData.set('reactrole', guildReactRoles).save()
                        await message.channel.send(lang.reactionRole.successDel).then(async (replyMSG) => {
                            setTimeout(async () => {
                                await replyMSG.delete();
                                await messageQuestion.delete();
                                return await msg.delete()
                            }, 2000)
                        })
                        await updateEmbed()
                    }
                })
            }
            if(value === 'save'){
                if (reactRole.message === "Non définie") {
                    return await message.channel.send(lang.reactionRole.noMsg).then(async (replyMSG) => {
                        setTimeout(async () => {
                            return await replyMSG.delete();
                        }, 2000)
                    })
                } else if (reactRole.emojiRoleMapping.size === 0) {
                    return await message.channel.send(lang.reactionRole.noEmoji).then(async (replyMSG) => {
                        setTimeout(async () => {
                            return await replyMSG.delete();

                        }, 2000)
                    })
                }
                const fetchedMsg = await message.guild.channels.cache.get(reactRole.channel).messages.fetch(reactRole.message)
                for (const [key, value] of reactRole.emojiRoleMapping) {
                    await fetchedMsg.react(`${key}`)
                }
                reactRole.emojiRoleMapping = Object.fromEntries(reactRole.emojiRoleMapping);
                guildData.set('reactroles', [...guildData.get('reactroles'), reactRole]).save()
                panel.delete()
                return message.channel.send(lang.reactionRole.success)
            }
        })
        async function updateEmbed() {
            let emojiArray;
            let emoji = []
            let channelMsg = reactRole.channel
            if (!isNaN(channelMsg)) channelMsg = `<#${channelMsg}>`
            if (reactRole.emojiRoleMapping.size !== 0) {
                emojiArray = Object.fromEntries(reactRole.emojiRoleMapping)

                if (emojiArray.length === 0) {
                    emoji.push('Non définie')
                } else {
                    for (const [key, value] of Object.entries(emojiArray)) {
                        let emojis
                        if (!isNaN(key)) {

                            if (client.botperso) {
                                const ee = client.emojis.cache.get(key)
                                if (ee.animated) {
                                    emojis = `<a:${ee.name}:${ee.id}>・<@&${value}>\n`
                                } else {
                                    emojis = `<:${ee.name}:${ee.id}>・<@&${value}>\n`

                                }

                            } else {
                                await client.cluster.broadcastEval(`this.emojis.cache.get('${key}')`).then((result) => {
                                    const ee = result.filter(em => em !== null)[0]
                                    if (ee.animated) {
                                        emojis = `<a:${ee.name}:${ee.id}>・<@&${value}>\n`
                                    } else {
                                        emojis = `<:${ee.name}:${ee.id}>・<@&${value}>\n`

                                    }
                                })
                            }


                        } else {
                            emojis = `${key}・<@&${value}>\n`
                        }
                        emoji.push(emojis)
                    }
                }

            } else {
                emoji.push('Non définie')
            }
            embed.fields[0].value = channelMsg;
            embed.fields[1].value = reactRole.message;
            embed.fields[2].value = emoji.join('\n');
            panel.edit({embeds: [embed]})
        }
        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                const replyMsg = await message.channel.send(lang.error.timeout)
                setTimeout(
                    () => {
                        replyMsg.delete()
                    }, 2000
                )
            }
        })

    }
};


