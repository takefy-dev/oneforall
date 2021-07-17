const Command = require('../../structures/Handler/Command');
const Discord = require('discord.js')
const {Collection} = require("discord.js");
let hexColorRegex = require('hex-color-regex');
const getEmoji = require('get-random-emoji')
const {Util} = require("discord.js");

const fetch = require('node-fetch');
const {extractEmoji, isEmoji} = require('extract-emoji')
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'role-embed',
            description: 'Auto create a reaction role with embed | Auto creer un reactrole avec son embed',
            category: 'misc',
            usage: 'role-embed <sexe/situation/age/color>',
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_MESSAGES'],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const availableTypes = ['sexe', 'situation', 'age', 'color'];
        const type = args[0];
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        let color = guildData.get('color');
        const reactRole = {channel: 'Non définie', message: 'Non définie', emojiRoleMapping: new Collection()};
        if (!availableTypes.includes(type)) return message.channel.send(lang.roleEmbed.typeError(type, availableTypes.join(', ')));
        const roleEmbedArgs = type === 'sexe' || type === 'age' ? [undefined, undefined] : type === 'situation' ? [undefined, undefined, undefined] : [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
        let finalEmbed = lang.roleEmbed.embeds[type](...roleEmbedArgs, color)
        const embedBuilder = new Discord.MessageEmbed()
            .setTitle(lang.embedBuilder.title)
            .setDescription(`${lang.embedBuilder.description}\n{roles} to put roles `)
            .addField(`\`✏\``, lang.embedBuilder.titleField, true)
            .addField(`\`📝\``, lang.embedBuilder.descriptionField, true)
            .addField(`\`🗣\``, lang.embedBuilder.authorField, true)
            .addField(`\`🖍\``, lang.embedBuilder.footerField, true)
            .addField(`\`💶\``, lang.embedBuilder.thumbnailField, true)
            .addField(`\`🖼\``, lang.embedBuilder.imageField, true)
            .addField(`\`🌐\``, lang.embedBuilder.urlField, true)
            .addField(`\`🎨\``, lang.embedBuilder.colorField, true)
            .addField(`\`⏲\``, lang.embedBuilder.timestampField, true)
            .addField(`\`©\``, lang.embedBuilder.copyField, true)
            .setTimestamp()
            .setFooter(client.user.tag)
            .setColor(`${color}`);
        const embedBuilderMsg = await message.channel.send(embedBuilder)
        const filter = (reaction, user) => roleChooserEmojis.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id;
            };
        const msg = await message.channel.send(finalEmbed)
        await msg.react('✏')
        await msg.react('📝')
        await msg.react('🗣')
        await msg.react('🖍')
        await msg.react('💶')
        await msg.react('🖼')
        await msg.react('🌐')
        await msg.react('🎨')
        await msg.react('⏲')
        await msg.react('©')
        let filterEmbed = (reaction, user) => ['✏', '📝', '🗣', '🖍', '🖼', '✅', '💶', '🌐', '🎨', '❌', '⏲', '©'].includes(reaction.emoji.name) && user.id === message.author.id;
        const collectorEmbed = msg.createReactionCollector(filterEmbed, {time: 900000});
        collectorEmbed.on('collect', async r => {
            await r.users.remove(message.author);
            if (r.emoji.name === '✏') {
                await message.channel.send(lang.embedBuilder.titleMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let msg = cld.first();
                            finalEmbed.embed.title = msg.content
                            mp.delete()
                            updateEmbedBuilder()
                            await msg.delete()


                        });
                })
            } else if (r.emoji.name === '📝') {
                await message.channel.send(lang.embedBuilder.descriptionMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let msg = cld.first();
                            finalEmbed.embed.description = msg.content
                            mp.delete()
                            updateEmbedBuilder()
                            await msg.delete()

                        });
                })
            } else if (r.emoji.name === '🗣') {
                await message.channel.send(lang.embedBuilder.authorMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let msg = cld.first();
                            finalEmbed.embed.author.name = msg.content
                            mp.delete()
                            updateEmbedBuilder()
                            await msg.delete()

                        });
                })
            } else if (r.emoji.name === '🖍') {
                await message.channel.send(lang.embedBuilder.footerMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let msg = cld.first();
                            finalEmbed.embed.footer.text = msg.content
                            mp.delete()
                            updateEmbedBuilder()
                            await msg.delete()

                        });
                })
            } else if (r.emoji.name === '💶') {
                await message.channel.send(lang.embedBuilder.thumbnailMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let link;
                            let msg = cld.first();
                            if (msg.attachments.size > 0) {
                                msg.attachments.forEach(attachment => {
                                    fetch(`https://api.imgur.com/3/upload/`, {
                                        "credentials": "include",
                                        "headers": {
                                            "accept": "*/*",
                                            "authorization": "Client-ID f09340971a82a72",
                                        },
                                        "referrerPolicy": "no-referrer-when-downgrade",
                                        'body': `${attachment.url}`,
                                        "method": "POST",


                                    }).then(res => res.json())
                                        .then(async (json) => {
                                            finalEmbed.embed.thumbnail.url = json.data.link;
                                            await client.functions.sleep(1000)

                                            // await ()
                                        })

                                })
                            } else if (msg.content) {


                                if (!msg.content.includes('i.imgur.com') && !msg.content.includes('tenor.com')) {
                                    await fetch(`https://api.imgur.com/3/upload/`, {
                                        "credentials": "include",
                                        "headers": {
                                            "accept": "*/*",
                                            "authorization": "Client-ID f09340971a82a72",
                                        },
                                        "referrerPolicy": "no-referrer-when-downgrade",
                                        'body': `${msg.content}`,
                                        "method": "POST",


                                    }).then(res => res.json())
                                        .then(async (json) => {
                                            finalEmbed.embed.thumbnail.url = json.data.link;
                                            await client.functions.sleep(1000)

                                            // await ()
                                        })
                                } else {
                                    await client.functions.sleep(1000)

                                    finalEmbed.embed.thumbnail.url = msg.content;
                                }

                            }
                            updateEmbedBuilder()
                            mp.delete()
                            await msg.delete()

                        });
                })
            } else if (r.emoji.name === '🖼') {
                await message.channel.send(lang.embedBuilder.imageMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let link;
                            let msg = cld.first();
                            if (msg.attachments.size > 0) {
                                msg.attachments.forEach(attachment => {
                                    fetch(`https://api.imgur.com/3/upload/`, {
                                        "credentials": "include",
                                        "headers": {
                                            "accept": "*/*",
                                            "authorization": "Client-ID f09340971a82a72",
                                        },
                                        "referrerPolicy": "no-referrer-when-downgrade",
                                        'body': `${attachment.url}`,
                                        "method": "POST",


                                    }).then(res => res.json())
                                        .then(async (json) => {
                                            finalEmbed.embed.image.url = json.data.link
                                            await client.functions.sleep(1000)

                                            // await ()
                                        })


                                })
                            } else if (msg.content) {
                                if (!msg.content.includes('i.imgur.com') && !msg.content.includes('tenor.com')) {

                                    await fetch(`https://api.imgur.com/3/upload/`, {
                                        "credentials": "include",
                                        "headers": {
                                            "accept": "*/*",
                                            "authorization": "Client-ID f09340971a82a72",
                                        },
                                        "referrerPolicy": "no-referrer-when-downgrade",
                                        'body': `${msg.content}`,
                                        "method": "POST",


                                    }).then(res => res.json())
                                        .then(async (json) => {
                                            finalEmbed.embed.image.url = json.data.link
                                            await client.functions.sleep(1000)


                                            // await ()
                                        })


                                } else {
                                    await client.functions.sleep(1000)
                                    finalEmbed.embed.image.url = msg.content
                                }
                                updateEmbedBuilder()
                                mp.delete()

                                await msg.delete()
                            }
                        });
                })
            } else if (r.emoji.name === '🌐') {
                await message.channel.send(lang.embedBuilder.urlMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let msg = cld.first()
                            if (!msg.content.toLowerCase().startsWith('http') || !msg.content.toLowerCase().startsWith('https')) return message.channel.send(lang.embedBuilder.errorUrl)
                            finalEmbed.embed.url = msg.content
                            mp.delete()
                            updateEmbedBuilder()
                            await msg.delete()

                        });
                })
            } else if (r.emoji.name === '🎨') {
                await message.channel.send(lang.embedBuilder.colorMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let msg = cld.first();
                            const rouge = '#FF0000'
                            const vert = '#1BFF00'
                            const jaune = '#FBFF00'
                            const violet = '#A000FC'
                            const rose = '#FC00D6'
                            const noir = '#000000'
                            const blanc = '#FDFEFE'
                            const bleu = '#0017FC'
                            const orange = '#FC9500'
                            const invisible = '#36393F'
                            let embedColor;
                            if (msg.content === 'rouge') {
                                embedColor = rouge
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'vert') {
                                embedColor = vert
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'jaune') {
                                embedColor = jaune
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'violet') {
                                embedColor = violet
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'rose') {
                                embedColor = rose
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'noir') {
                                embedColor = noir
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'blanc') {
                                embedColor = blanc
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'bleu') {
                                embedColor = bleu
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'orange') {
                                embedColor = orange
                                mp.delete()
                                msg.delete()
                            } else if (msg.content === 'invisible') {
                                embedColor = invisible
                                mp.delete()
                                msg.delete()

                            } else if (hexColorCheck(msg.content)) {
                                embedColor = msg.content
                                mp.delete()
                                msg.delete()
                            } else {
                                msg.delete()
                                mp.delete()
                                message.channel.send(lang.embedBuilder.errorColor)
                            }
                            finalEmbed.embed.color = embedColor
                            updateEmbedBuilder()


                        });
                })
            } else if (r.emoji.name === '⏲') {
                await message.channel.send(lang.embedBuilder.timestampMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let msg = cld.first();
                            if (msg.content.toLowerCase() === 'oui') {
                                finalEmbed.embed.timestamp = new Date()
                                mp.delete()
                                await msg.delete()
                            } else if (msg.content.toLowerCase() === 'non') {
                                delete finalEmbed.embed.embed.timestamp
                                mp.delete()
                                await msg.delete()
                            } else if (msg.content.toLowerCase() !== 'non' || msg.content.toLowerCase() !== 'oui') {
                                await msg.delete()
                                mp.delete()
                                message.channel.send(lang.error.YesNo)
                            }

                            updateEmbedBuilder()

                        });
                })
            } else if (r.emoji.name === '©') {
                let ch;
                let embedMsg;
                await message.channel.send(lang.embedBuilder.copyMsg).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                        .then(async cld => {
                            let msg = cld.first();
                            // if(isNaN(msg)) return message.channel.send(`Veuilez entrer un id valide !`).then(() =>{
                            //     msg.delete()
                            // })
                            // embedMsg = message.guild.channels
                            try {
                                ch = await msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                                await mp.delete();
                                await msg.delete();
                            } catch (err) {
                                console.log(err)
                                return await message.channel.send(lang.embedBuilder.errorChannel).then(async () => {
                                    await mp.delete()
                                    await msg.delete();
                                })
                            }
                            await message.channel.send(lang.embedBuilder.messageId).then(id => {
                                id.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                                    .then(async cld => {
                                        let msg = cld.first();
                                        if (isNaN(msg)) return message.channel.send(lang.embedBuilder.errorWrongId).then(() => {
                                            mp.delete();
                                            msg.delete()
                                        })
                                        try {
                                            embedMsg = await ch.messages.fetch(msg.content)
                                            mp.delete();
                                            // msg.delete()
                                            // console.log(embedMsg.embeds[0].author.name)
                                            finalEmbed.embed = embedMsg.embeds[0];
                                            updateEmbedBuilder()

                                        } catch (err) {
                                            return await message.channel.send(lang.embedBuilder.errorMessage(ch)).then(async () => {
                                                await mp.delete()
                                                await msg.delete();
                                            })
                                        }

                                    });
                            })
                        });

                })


            }
        })
        collectorEmbed.on('end', async (collected, reason) => {
            if (reason === 'time') {
                message.channel.send(lang.error.timeout)
            }

        });


        const toSearch = lang.roleEmbed.toSearch[type];
        let roles = [];
        for (const search of toSearch) {
            const find = message.guild.roles.cache.find(role => role.name.toLowerCase().includes(search))
            if (find) roles.push(find.id)
        }
        if (roles.length > 10)
            roles = roles.splice(0, 10);

        const roleChooserEmbed = lang.roleEmbed.potentialRoles(roles, type, client.users.resolve(message.author.id).displayAvatarURL({dynamic: true}), color)
        const roleChooserMessage = await message.channel.send(roleChooserEmbed);
        const roleChooserEmojis = ['➕', '➖', '❌', '✅']
        if (roles.length > 0) {
            for (let i = 1; i <= roles.length; i++) {
                let emoji = client.functions.numberToEmoji(i);
                roleChooserEmojis.push(emoji)
            }
        }
        updateEmbedBuilder()
        function updateEmbedBuilder() {

            if (finalEmbed.embed.description && roles.length > 0)
                finalEmbed.embed.description = finalEmbed.embed.description.replace(/{roles}/g, roles.map((role, i) => `<@&${role}>`).join('\n'))
            msg.edit(finalEmbed)

        }

        for await(const em of roleChooserEmojis) await roleChooserMessage.react(em);
        const collector = roleChooserMessage.createReactionCollector(filter, {time: 900000});
        collector.on('collect', async r => {
            await r.users.remove(message.author);
            const emojisLenght = roleChooserEmojis.length
            if (r.emoji.name !== roleChooserEmojis[0] && r.emoji.name !== roleChooserEmojis[1] && r.emoji.name !== roleChooserEmojis[2] && r.emoji.name !== roleChooserEmojis[3]) {
                const index = client.functions.emojiToNumber(r.emoji.name);
                const question = await message.channel.send(lang.roleEmbed.changeRoleQ)
                question.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                    .then(async cld => {
                        let msg = cld.first();
                        if (!msg.mentions.roles.first() && isNaN(msg.content)) return message.channel.send(lang.roleEmbed.errorNoRole).then((reply) => {
                            setTimeout(async () => {
                                await question.delete()
                                await msg.delete()
                                await reply.delete()
                            }, 2000);
                        })
                        let role = msg.mentions.roles.first() || message.guild.roles.cache.get(msg.content);

                        if (!role) return message.channel.send(lang.roleEmbed.errorNoRole).then((reply) => {
                            setTimeout(async () => {
                                await question.delete()
                                await msg.delete()
                                await reply.delete()
                            }, 2000);
                        })
                        if (client.functions.roleHasSensiblePermissions(role.permissions)) {
                            const replyMsg = await message.channel.send(lang.reactionRole.tryToPermsRole);
                            const raidLog = guildData.get('logs').antiraid;
                            const raidLogChannel = message.guild.channels.cache.get(raidLog);
                            if (raidLogChannel && !raidLogChannel.deleted) {
                                raidLogChannel.send('@everyone', lang.logs.reactRolePerm(message.member, color, msg.id, `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`))
                            }
                            return setTimeout(async () => {
                                await replyMsg.delete();
                                await msg.delete()
                                return await question.delete()
                            }, 2000)
                        }
                        if (role.managed) return message.channel.send(lang.error.managed).then((reply) => {
                            setTimeout(async () => {
                                await question.delete()
                                await msg.delete()
                                await reply.delete()
                            }, 2000)
                        })
                        roles[parseInt(index) - 1] = role.id;
                        const reply = await message.channel.send(lang.roleEmbed.successChangeRole(role.name))
                        updateEmbed()

                        setTimeout(async () => {
                            await question.delete()
                            await msg.delete()
                            await reply.delete()
                        }, 2000)
                    });
            } else {
                if (r.emoji.name === roleChooserEmojis[0]) {
                    if (roles.length >= 10 || roles.length >= toSearch.length) return message.channel.send(lang.roleEmbed.maxRoleReach).then((reply) => {
                        setTimeout(async () => {
                            await reply.delete()
                        }, 2000);
                    })
                    const question = await message.channel.send(lang.roleEmbed.addRoleQ)
                    question.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                        .then(async cld => {
                            const msg = cld.first()
                            if (!msg.mentions.roles.first() && isNaN(msg.content)) return message.channel.send(lang.roleEmbed.errorNoRole).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000);
                            })
                            let role = msg.mentions.roles.first() || message.guild.roles.cache.get(msg.content);
                            if (!role) return message.channel.send(lang.roleEmbed.errorNoRole).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000);
                            })
                            if (client.functions.roleHasSensiblePermissions(role.permissions)) {
                                const replyMsg = await message.channel.send(lang.reactionRole.tryToPermsRole);
                                const raidLog = guildData.get('logs').antiraid;
                                const raidLogChannel = message.guild.channels.cache.get(raidLog);
                                if (raidLogChannel && !raidLogChannel.deleted) {
                                    raidLogChannel.send('@everyone', lang.logs.reactRolePerm(message.member, color, msg.id, `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`))
                                }
                                return setTimeout(async () => {
                                    await replyMsg.delete();
                                    await msg.delete()
                                    return await question.delete()
                                }, 2000)
                            }
                            if (role.managed) return message.channel.send(lang.error.managed).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000)
                            })


                            roles.push(role.id);
                            await roleChooserMessage.react(client.functions.numberToEmoji(roles.length))
                            message.channel.send(lang.roleEmbed.successAddRole(role.name)).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000)
                            })
                            updateEmbed()
                        })
                }
                if (r.emoji.name === roleChooserEmojis[1]) {
                    const question = await message.channel.send(lang.roleEmbed.removeRoleQ)
                    question.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                        .then(async cld => {
                            const msg = cld.first()
                            if (!msg.mentions.roles.first() && isNaN(msg.content)) return message.channel.send(lang.roleEmbed.errorNoRole).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000);
                            })
                            let role = msg.mentions.roles.first() || message.guild.roles.cache.get(msg.content);
                            if (!role) return message.channel.send(lang.roleEmbed.errorNoRole).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000);
                            })
                            if (role.managed) return message.channel.send(lang.error.managed).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000)
                            })

                            roles = roles.filter(rl => rl !== role.id);
                            await roleChooserMessage.reactions.cache.find(react => react.emoji.name === client.functions.numberToEmoji(roles.length + 1)).remove()
                            updateEmbed()
                            updateEmbedBuilder()

                            message.channel.send(lang.roleEmbed.successRemoveRole(role.name)).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000)
                            })
                        })
                }
                if (r.emoji.name === roleChooserEmojis[2]) {
                    collector.stop('react')
                }
                if (r.emoji.name === roleChooserEmojis[3]) {
                    if(roles.length < 1 || roles.length < toSearch.length) return message.channel.send(`No roles are selected or not enought roles`)
                    const question = await message.channel.send(lang.roleEmbed.sendEmbedQ)
                    question.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                        .then(async cld => {
                            const msg = cld.first()
                            if (!msg.mentions.channels.first() && isNaN(msg.content)) return message.channel.send(lang.roleEmbed.errorNoRole).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000);
                            })
                            let channel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content);
                            if (!channel || channel.deleted) return message.channel.send(lang.roleEmbed.errorNoRole).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000);
                            })
                            reactRole.channel = channel.id
                            message.channel.send(lang.roleEmbed.successChannel(channel)).then((reply) => {
                                setTimeout(async () => {
                                    await question.delete()
                                    await msg.delete()
                                    await reply.delete()
                                }, 2000)
                            })

                            let emojiCollector;
                            let emoji
                            for (let i = 0; i < roles.length; i++) {
                                const roleID = roles[i]
                                const role = message.guild.roles.cache.get(roleID)
                                let normalEmoji = extractEmoji(role.name)[0];
                                if (normalEmoji && isEmoji(normalEmoji) && !reactRole.emojiRoleMapping.has(normalEmoji)) reactRole.emojiRoleMapping.set(normalEmoji, role.id)
                                else {
                                    const questionEmoji = await message.channel.send(lang.roleEmbed.emojiNotFoundOnrole(role.name))
                                    emojiCollector = questionEmoji.channel.createMessageCollector(dureefiltrer, {
                                        time: 1000 * 15,
                                        max: 1
                                    })
                                    emojiCollector.on('collect', async (msg) => {
                                        let parsedEmoji = Util.parseEmoji(msg.content);
                                        if (!parsedEmoji.id) {
                                            if (reactRole.emojiRoleMapping.has(parsedEmoji.name)) {
                                                const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                emojiCollector.stop()
                                                return setTimeout(async () => {
                                                    await replyMsg.delete();
                                                    await msg.delete()
                                                    return await questionEmoji.delete()
                                                }, 2000)
                                            }
                                            emoji = parsedEmoji.name
                                            reactRole.emojiRoleMapping.set(parsedEmoji.name, role.id)

                                            emojiCollector.stop(`finish-${i}-${role.id}`)

                                            setTimeout(async () => {
                                                await msg.delete()
                                                questionEmoji.delete()
                                                questionEmoji.delete()
                                            }, 2000)

                                        } else {
                                            if (client.botperso) {
                                                emoji = client.emojis.cache.get(parsedEmoji.id)


                                            } else {
                                                await client.shard.broadcastEval(`this.emojis.cache.get('${emoji.id}')`).then((result) => {
                                                    emoji = result.filter(em => em !== null)[0]
                                                })
                                            }
                                            if (!emoji) {
                                                await message.channel.send(lang.reactionRole.emojiDoesNotExist).then(async mp => {
                                                    mp.channel.awaitMessages(dureefiltrer, {
                                                        max: 1,
                                                        time: 50000,
                                                        errors: ['time']
                                                    })
                                                        .then(async cld => {
                                                            const name = cld.first().content;
                                                            let link = `https://cdn.discordapp.com/emojis/${parsedEmoji.id}.${parsedEmoji.animated ? "gif" : "png"}`
                                                            message.guild.emojis.create(link, name, {reason: `emoji add par ${message.author.username}`}).then(async (em) => {
                                                                message.channel.send(lang.addemoji.success(name))
                                                                emoji = em
                                                                if (reactRole.emojiRoleMapping.has(em.id)) {
                                                                    const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                                    return setTimeout(async () => {
                                                                        await replyMsg.delete();
                                                                        await msg.delete()
                                                                        return await mp.delete()
                                                                    }, 2000)
                                                                }
                                                                reactRole.emojiRoleMapping.set(em.id, role.id)
                                                                setTimeout(async () => {
                                                                    await msg.delete()
                                                                    mp.delete()
                                                                    questionEmoji.delete()
                                                                }, 2000)
                                                            })

                                                        })
                                                })
                                                emojiCollector.stop(`finish-${i}-${role.id}`)
                                            } else {
                                                if (reactRole.emojiRoleMapping.has(emoji.id)) {
                                                    const replyMsg = await message.channel.send(lang.reactionRole.emojiAlready);
                                                    emojiCollector.stop()
                                                    return setTimeout(async () => {
                                                        await replyMsg.delete();
                                                        await msg.delete()
                                                        return await questionEmoji.delete()
                                                    }, 2000)
                                                }

                                                emojiCollector.stop(`finish-${i}-${role.id}`)
                                                reactRole.emojiRoleMapping.set(emoji.id, role.id)
                                                setTimeout(async () => {
                                                    await msg.delete()
                                                    questionEmoji.delete()
                                                    questionEmoji.delete()
                                                }, 2000)
                                            }

                                        }
                                    })


                                }
                            }

                            const template = lang.roleEmbed.embeds[type](...roles, color)
                            finalEmbed = finalEmbed === template ? template : finalEmbed
                            updateEmbedBuilder()
                            const reactRoleMessage = await message.guild.channels.cache.get(reactRole.channel).send(finalEmbed)
                            await msg.delete()
                            embedBuilderMsg.delete()
                            reactRole.message = reactRoleMessage.id;
                            if (!emojiCollector) {
                                for (const [key, value] of reactRole.emojiRoleMapping) {
                                    await reactRoleMessage.react(`${key}`)
                                }
                                reactRole.emojiRoleMapping = Object.fromEntries(reactRole.emojiRoleMapping);
                                guildData.set('reactroles', [...guildData.get('reactroles'), reactRole]).save()
                                console.log(guildData.get('reactroles'))
                            } else {
                                emojiCollector.on('end', async (collected, reason) => {
                                    if (collected.size < 1) return;
                                    if (reason.includes('finish')) {
                                        let indexOfOriginalPosition = parseInt(reason.split('-')[1]);
                                        let roleId = reason.split('-')[2];
                                        let i = 0;
                                        let tempMap = new Collection()
                                        for (const [key, value] of reactRole.emojiRoleMapping) {
                                            if (i !== indexOfOriginalPosition) {

                                                tempMap.set(key, value);
                                            } else {
                                                tempMap.set(emoji.id ? emoji.id : emoji, roleId)
                                                tempMap.set(key, value)
                                            }
                                            i++
                                        }
                                        for (const [key, value] of tempMap) {
                                            await reactRoleMessage.react(key)
                                        }
                                        reactRole.emojiRoleMapping = Object.fromEntries(tempMap);
                                        guildData.set('reactroles', [...guildData.get('reactroles'), reactRole]).save()

                                    }
                                })
                            }
                            await msg.delete()
                            await reactRoleMessage.delete()
                            return message.channel.send(lang.reactionRole.success)

                        })


                }
            }
        })
        collector.on('end', async (collected, reason) => {
            await msg.delete()
            await roleChooserMessage.delete()
        })


        function updateEmbed() {
            roleChooserMessage.edit(lang.roleEmbed.potentialRoles(roles, type, client.users.resolve(message.author.id).displayAvatarURL({dynamic: true}), color))
        }

        function hexColorCheck(a) {
            let check = hexColorRegex().test(a);
            let checkVerify = false;
            if (check) {
                checkVerify = true;
            }
            return checkVerify;
        }

    }
}