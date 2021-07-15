const chs = new Map();
const msgId = new Map();
const {Util} = require('discord.js')
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
const {Collection} = require("discord.js");

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'reactrole',
            description: "Show the react role menu création | Affiche le menu de création d'un reactrole",
            usage: 'reactrole',
            category: 'moderation',
            tags: ['guildOnly'],
            clientPermissions: ['SEND_MESSAGES', 'ADD_REACTIONS', 'EMBED_LINKS'],
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        let guildReactRoles = guildData.get('reactroles');
        const lang = guildData.lang;
        const reactRole = {channel: 'Non définie', message: 'Non définie', emojiRoleMapping: new Collection()};
        const color = guildData.get('color')
        const msg = await message.channel.send(lang.loading)
        const emojisReact = ['📖', '🆔', '💠', '🚫', '📛', '❌', '✅'];
        for (const em of emojisReact) await msg.react(em);

        let embed = new Discord.MessageEmbed()
            .setTitle(lang.reactionRole.embedTitle)
            .setDescription(lang.reactionRole.embedDescription(reactRole.channel, reactRole.message, ['Non définie']))
            .setFooter(client.user.tag)
            .setTimestamp()
            .setColor(`${color}`);

        const filter = (reaction, user) => emojisReact.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };

        msg.edit("", embed).then(async m => {
            const collector = m.createReactionCollector(filter, {time: 900000});
            collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === emojisReact[0]) {
                        await message.channel.send(lang.reactionRole.chQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 50000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    let channel;
                                    if (msg.content.toLowerCase() === "cancel") {
                                        const reply = await message.channel.send(lang.cancel)
                                        await reply.delete({timeout: 2000})
                                        await msg.delete({timeout: 2000})
                                        return await mp.delete({timeout: 2000})
                                    } else if (!msg.mentions.channels.first() && isNaN(msg.content)) {
                                        const replyMsg = await message.channel.send(lang.counter.errorNotChannel);
                                        await replyMsg.delete({timeout: 2000});
                                        await msg.delete({timeout: 2000})
                                        return await mp.delete({timeout: 2000})
                                    } else if (!isNaN(msg.content)) {

                                        channel = message.guild.channels.cache.get(msg.content);


                                    } else if (msg.mentions.channels.first()) channel = msg.mentions.channels.first();
                                    if (channel.type !== 'text') {
                                        await message.channel.send(lang.reactionRole.notText).then((e) => {
                                            return setTimeout(() => {
                                                e.delete()
                                            }, 2000)
                                        })
                                    } else {
                                        const replyMsg = message.channel.send(lang.reactionRole.successCh(channel)).then((replyMSG) => {
                                            reactRole.channel = channel.id

                                            setTimeout(async () => {
                                                await replyMSG.delete();
                                                await mp.delete();
                                                await msg.delete()
                                            }, 2000)
                                            updateEmbed()


                                        })
                                    }


                                });
                        })
                    } else if (r.emoji.name === emojisReact[1]) {
                        await message.channel.send(lang.reactionRole.msgIdQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 50000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (msg.content.toLowerCase() === 'cancel') return message.channel.send(lang.cancel)
                                    if (isNaN(msg.content)) return message.channel.send(lang.reactionRole.notId).then(rp => setTimeout(() => {
                                        rp.delete()
                                        msg.delete()
                                        mp.delete()
                                    }, 2000))

                                    if (reactRole.channel === 'Non définie' || !message.guild.channels.cache.get(reactRole.channel)) return message.channel.send(lang.reactionRole.noChannel).then(rp => setTimeout(() => {
                                        rp.delete()
                                        msg.delete()
                                        mp.delete()
                                    }, 2000))


                                    const messageFetched = await message.guild.channels.cache.get(reactRole.channel).messages.fetch(msg.content)


                                    setTimeout(async () => {
                                        await mp.delete();
                                        await msg.delete();
                                    }, 2000)
                                    if (guildReactRoles && guildReactRoles.find(react => react.message === messageFetched.id)) {
                                        return await message.channel.send(lang.reactionRole.alreadyReact).then(rp => setTimeout(() => {
                                            rp.delete()
                                            msg.delete()
                                            mp.delete()
                                        }, 2000))
                                    }
                                    reactRole.message = messageFetched.id
                                    await updateEmbed();


                                });
                        })
                    } else if (r.emoji.name === emojisReact[2]) {

                        await message.channel.send(lang.reactionRole.roleQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 50000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    let role;
                                    if (msg.content.toLowerCase() === "cancel") {
                                        const reply = await message.channel.send(lang.cancel)
                                        return setTimeout(async () => {
                                            await reply.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    } else if (!msg.mentions.roles.first() && isNaN(msg.content)) {
                                        const replyMsg = await message.channel.send(lang.reactionRole.noRole);
                                        return setTimeout(async () => {
                                            await replyMsg.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    } else if (!isNaN(msg.content)) {
                                        role = message.guild.channels.cache.get(msg.content);

                                    } else if (msg.mentions.roles.first()) role = msg.mentions.roles.first();
                                    if (role && role.managed) {
                                        const replyMsg = await message.channel.send(lang.reactionRole.managedRole);
                                        return setTimeout(async () => {
                                            await replyMsg.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    }
                                    if(role && client.functions.roleHasSensiblePermissions(role.permissions)){
                                        const replyMsg = await message.channel.send(lang.reactionRole.tryToPermsRole);
                                        const raidLog = guildData.get('logs').antiraid;
                                        const raidLogChannel = message.guild.channels.cache.get(raidLog);
                                        if(raidLogChannel && !raidLogChannel.deleted){
                                            raidLogChannel.send( lang.logs.reactRolePerm(message.member, color, msg.id, `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`))
                                        }
                                        return setTimeout(async () => {
                                            await replyMsg.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    }
                                    for (const [key, value] of reactRole.emojiRoleMapping) {
                                        if (value === role.id) {
                                            const replyMsg = await message.channel.send(lang.reactionRole.roleAlready);
                                            return setTimeout(async () => {
                                                await replyMsg.delete();
                                                await msg.delete()
                                                return await mp.delete()
                                            }, 2000)
                                        }

                                    }

                                    await message.channel.send(lang.reactionRole.emojiQ).then(async mps => {
                                        mps.channel.awaitMessages(dureefiltrer, {max: 1, time: 50000, errors: ['time']})
                                            .then(async cld => {
                                                let msg = cld.first();
                                                let emoji = Util.parseEmoji(msg.content);
                                                if (!emoji.id) {
                                                    if (reactRole.emojiRoleMapping.has(emoji.name)) {
                                                        const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                        return setTimeout(async () => {
                                                            await replyMsg.delete();
                                                            await msg.delete()
                                                            return await mp.delete()
                                                        }, 2000)
                                                    }
                                                    reactRole.emojiRoleMapping.set(emoji.name, role.id)
                                                    updateEmbed()
                                                    setTimeout(async () => {
                                                        await msg.delete()
                                                        mp.delete()
                                                        mps.delete()
                                                    }, 2000)

                                                } else {
                                                    let emojis;
                                                    if (client.botperso) {
                                                        emojis = client.emojis.cache.get(emoji.id)

                                                    } else {
                                                        await client.shard.broadcastEval(`this.emojis.cache.get('${emoji.id}')`).then((result) => {
                                                            emojis = result.filter(em => em !== null)[0]
                                                        })
                                                    }
                                                    if (!emojis) {
                                                        await message.channel.send(lang.reactionRole.emojiDoesNotExist).then(async mp => {
                                                            mp.channel.awaitMessages(dureefiltrer, {
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
                                                                                return await mp.delete()
                                                                            }, 2000)
                                                                        }
                                                                        reactRole.emojiRoleMapping.set(emojis.id, role.id)
                                                                        updateEmbed()
                                                                        setTimeout(async () => {
                                                                            await msg.delete()
                                                                            mp.delete()
                                                                            mps.delete()
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
                                                                return await mp.delete()
                                                            }, 2000)
                                                        }
                                                        reactRole.emojiRoleMapping.set(emojis.id, role.id)
                                                        updateEmbed()
                                                        setTimeout(async () => {
                                                            await msg.delete()
                                                            mp.delete()
                                                            mps.delete()
                                                        }, 2000)
                                                    }

                                                }


                                            });
                                    })
                                });
                        })

                    } else if (r.emoji.name === emojisReact[3]) {
                        await message.channel.send(lang.reactionRole.roleDelQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 50000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    let role;
                                    if (reactRole.emojiRoleMapping.size === 0) {
                                        const reply = await message.channel.send(lang.reactionRole.noRole)
                                        return setTimeout(async () => {
                                            await reply.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)

                                    }
                                    if (msg.content.toLowerCase() === "cancel") {
                                        const reply = await message.channel.send(lang.cancel)
                                        return setTimeout(async () => {
                                            await reply.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    } else if (!msg.mentions.roles.first() && isNaN(msg.content)) {
                                        const replyMsg = await message.channel.send(lang.reactionRole.noRole);
                                        return setTimeout(async () => {
                                            await replyMsg.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    } else if (!isNaN(msg.content)) role = message.guild.roles.cache.get(msg.content)
                                    else if (msg.mentions.roles.first() && msg.content !== "cancel") role = msg.mentions.roles.first();
                                    if (role && role.managed) {
                                        const replyMsg = await message.channel.send(lang.reactionRole.managedRole);
                                        return setTimeout(async () => {
                                            await replyMsg.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    }
                                    for (const [key, value] of reactRole.emojiRoleMapping) {
                                        if (value !== role.id) {
                                            const replyMsg = await message.channel.send(lang.reactionRole.roleNotFound);
                                            return setTimeout(async () => {
                                                await replyMsg.delete();
                                                await msg.delete()
                                                return await mp.delete()
                                            }, 2000)
                                        }
                                        if (value === role.id) {
                                            reactRole.emojiRoleMapping.delete(key)
                                        }
                                    }
                                    updateEmbed()
                                    setTimeout(async () => {
                                        await msg.delete();
                                        return await mp.delete();
                                    }, 2000)
                                });
                        })
                    } else if (r.emoji.name === emojisReact[4]) {
                        message.channel.send(lang.reactionRole.cancel).then((mp) => {
                            msgId.delete(message.guild.id);
                            chs.delete(message.guild.id);
                            reactRole.emojiRoleMapping.clear();
                            collector.stop('user_stop');
                            setTimeout(async () => {
                                mp.delete()
                            }, 2000)
                            return msg.delete();

                        })


                    } else if (r.emoji.name === emojisReact[5]) {
                        await message.channel.send(lang.reactionRole.chDeleteQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 50000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    let channel;
                                    if (msg.content.toLowerCase() === "cancel") {
                                        const reply = await message.channel.send(lang.cancel)
                                        return setTimeout(async () => {
                                            await reply.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    } else if (!msg.mentions.channels.first() && isNaN(msg.content)) {
                                        const replyMsg = await message.channel.send(lang.counter.errorNotChannel);
                                        return setTimeout(async () => {
                                            await replyMsg.delete();
                                            await msg.delete()
                                            return await mp.delete()
                                        }, 2000)
                                    } else if (!isNaN(msg.content))
                                        channel = message.guild.channels.cache.get(msg.content)
                                    else if (msg.mentions.channels.first() && msg.content !== "cancel") channel = msg.mentions.channels.first();
                                    if (channel.type !== 'text') return await message.channel.send(lang.reactionRole.notText).then((e) => {
                                        return e.delete({timeout: 2000})
                                    })
                                    await message.channel.send(lang.reactionRole.successCh(channel)).then((replyMSG) => {
                                        setTimeout(async () => {
                                            await replyMSG.delete();
                                            await mp.delete();
                                            await msg.delete()
                                        }, 2000)

                                    })

                                    await message.channel.send(lang.reactionRole.msgDeleteQ).then((mp) => {
                                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 50000, errors: ['time']})
                                            .then(async cld => {
                                                let msg = cld.first();
                                                if (msg.content.toLowerCase() === "cancel") {
                                                    const reply = await message.channel.send(lang.cancel)
                                                    return setTimeout(async () => {
                                                        await reply.delete();
                                                        await msg.delete()
                                                        return await mp.delete()
                                                    }, 2000)
                                                } else if (isNaN(msg.content)) {
                                                    return await message.channel.send(lang.reactionRole.invalid).then((replyMSG) => {
                                                        setTimeout(async () => {
                                                            await replyMSG.delete();
                                                            await mp.delete();
                                                            await msg.delete()
                                                        }, 2000)
                                                    })
                                                } else {
                                                    let fetchedMsg = await channel.messages.fetch(msg.content)
                                                    if (fetchedMsg) {

                                                        guildReactRoles = guildReactRoles.filter(react => react.message !== fetchedMsg.id)
                                                        guildData.set('reactrole', guildReactRoles).save()
                                                        const reply = await message.channel.send(lang.reactionRole.successDel).then(async (replyMSG) => {
                                                            setTimeout(async () => {
                                                                await replyMSG.delete();
                                                                await mp.delete();
                                                                return await msg.delete()
                                                            }, 2000)
                                                        })
                                                        await fetchedMsg.reactions.removeAll()


                                                    }
                                                }
                                            })

                                    })

                                })

                        })
                    } else if (r.emoji.name === emojisReact[6]) {
                        if (msgId.get(message.guild.id) === "Non définie") {
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
                        msg.delete()
                        return message.channel.send(lang.reactionRole.success)

                    }

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
                                            await client.shard.broadcastEval(`this.emojis.cache.get('${key}')`).then((result) => {
                                                const ee  = result.filter(em => em !== null)[0]
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

                        embed.setDescription(lang.reactionRole.embedDescription(channelMsg, reactRole.message, emoji))
                        msg.edit(embed)
                    }

                }
            );
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
        });


    }
};


