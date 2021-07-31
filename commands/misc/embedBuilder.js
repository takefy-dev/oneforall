const url = new Map();
const fetch = require('node-fetch');
const colorNameToHex = require('colornames')
let hexColorRegex = require('hex-color-regex');
const Command = require('../../structures/Handler/Command');
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'embed',
            description: "Show the embed creation tool | Affiche l'outil de création d'un embed",
            usage: 'embed',
            category: 'misc',
            aliases: ['embedcreator', 'embed'],
            tags: ['guildOnly'],
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['MANAGE_MESSAGES'],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const imgUrImage = async (image) => {
            const request = await fetch(`https://api.imgur.com/3/upload/`, {
                "credentials": "include",
                "headers": {
                    "accept": "*/*",
                    "authorization": "Client-ID f09340971a82a72",
                },
                "referrerPolicy": "no-referrer-when-downgrade",
                'body': `${image}`,
                "method": "POST",
            })
            return request.json()
        }
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        let embed = {
            description: lang.embedBuilder.descriptionRequired,
            author: {},
            thumbnail: {},
            image: {},
            footer: {},
        }
        const editEmbed = await message.channel.send({embed})
        const msg = await message.channel.send(lang.embedBuilder.loading)
        const emojis = ['✏', '📝', '🗣', '🖍', '💶', '🖼', '🌐', '🎨', '⏲', '©', '❌', '✅',]
        for (const em of emojis) await msg.react(em)
        const embedBuilder = new Discord.MessageEmbed()
            .setTitle(lang.embedBuilder.title)
            .setDescription(lang.embedBuilder.description)
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
            .addField(`\`❌\``, lang.embedBuilder.cancelField, true)
            .addField(`\`✅\``, lang.embedBuilder.sendField, true)
            .setTimestamp()
            .setFooter(client.user.tag)
            .setColor(color);
        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.member.id === message.member.id
            };
        msg.edit("", embedBuilder).then(async m => {
            const collector = m.createReactionCollector(filter, {time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === '✏') {
                    await message.channel.send(lang.embedBuilder.titleMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                embed.title = msg.content;
                                mp.delete()
                                updateEmbed()
                                await msg.delete()
                            });
                    })
                } else if (r.emoji.name === '📝') {
                    await message.channel.send(lang.embedBuilder.descriptionMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                embed.description = msg.content
                                mp.delete()
                                updateEmbed()
                                await msg.delete()

                            });
                    })
                } else if (r.emoji.name === '🗣') {
                    await message.channel.send(lang.embedBuilder.authorMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                embed.author.name = msg.content
                                mp.delete()
                                updateEmbed()
                                await msg.delete()
                                await message.channel.send(lang.embedBuilder.authorUrl).then(mp => {
                                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                                        .then(async cld => {
                                            let msg = cld.first();
                                            mp.delete()
                                            await msg.delete()
                                            if (!msg.content.toLowerCase().startsWith('http') && !msg.content.toLowerCase().startsWith('https') && msg.content.toLowerCase() !== 'no') return message.channel.send(lang.embedBuilder.errorUrl)

                                            if (msg.content.toLowerCase() !== 'no') {
                                                embed.author.url = msg.content
                                            } else {
                                                delete embed.author.url
                                            }
                                            updateEmbed()

                                            await message.channel.send(lang.embedBuilder.authorIcon).then(mp => {
                                                mp.channel.awaitMessages(dureefiltrer, {
                                                    max: 1,
                                                    time: 60000,
                                                    errors: ['time']
                                                })
                                                    .then(async cld => {
                                                        let msg = cld.first();
                                                        if (msg.content.toLowerCase() !== 'no') {

                                                            if (msg.attachments.size > 0) {
                                                                const imgData = await imgUrImage(msg.attachments.first().url)
                                                                embed.author.icon_url = imgData.data.link
                                                            } else if (msg.content) {
                                                                if (!msg.content.includes('i.imgur.com') && !msg.content.includes('tenor.com')) {
                                                                    const imgData = await imgUrImage(msg.content)
                                                                    embed.author.icon_url = imgData.data.link

                                                                } else {
                                                                    embed.author.icon_url = msg.content
                                                                }
                                                            }
                                                        } else {
                                                            delete embed.author.icon_url
                                                        }
                                                        mp.delete()
                                                        updateEmbed()
                                                        await msg.delete()
                                                    })
                                            })

                                        });
                                })
                            });
                    })
                } else if (r.emoji.name === '🖍') {
                    await message.channel.send(lang.embedBuilder.footerMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                embed.footer.text = msg.content
                                mp.delete()
                                updateEmbed()
                                await msg.delete()
                                await message.channel.send(lang.embedBuilder.footerUrl).then(mp => {
                                    mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                                        .then(async cld => {
                                            let msg = cld.first();
                                            if (msg.content.toLowerCase() !== 'no') {
                                                if (msg.attachments.size > 0) {
                                                    const imgData = await imgUrImage(msg.attachments.first().url)
                                                    embed.footer.icon_url = imgData.data.link
                                                } else if (msg.content) {
                                                    if (!msg.content.includes('i.imgur.com') && !msg.content.includes('tenor.com')) {
                                                        const imgData = await imgUrImage(msg.content)
                                                        embed.footer.icon_url = imgData.data.link
                                                    } else {
                                                        embed.footer.icon_url = msg.content
                                                    }
                                                }
                                            } else {
                                                delete embed.footer.icon_url
                                            }
                                            mp.delete()
                                            updateEmbed()
                                            await msg.delete()

                                        });
                                })
                            });
                    })
                } else if (r.emoji.name === '💶') {
                    await message.channel.send(lang.embedBuilder.thumbnailMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.attachments.size > 0) {
                                    const imgData = await imgUrImage(msg.attachments.first().url)
                                    embed.thumbnail.url = imgData.data.link
                                } else if (msg.content) {
                                    if (!msg.content.includes('i.imgur.com') && !msg.content.includes('tenor.com')) {
                                        const imgData = await imgUrImage(msg.content)
                                        embed.thumbnail.url = imgData.data.link
                                    } else {
                                        embed.thumbnail.url = msg.content
                                    }
                                }
                                mp.delete()
                                updateEmbed()
                                await msg.delete()

                            });
                    })
                } else if (r.emoji.name === '🖼') {
                    await message.channel.send(lang.embedBuilder.imageMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.attachments.size > 0) {
                                    const imgData = await imgUrImage(msg.attachments.first().url)
                                    embed.image.url = imgData.data.link
                                } else if (msg.content) {
                                    if (!msg.content.includes('i.imgur.com') && !msg.content.includes('tenor.com')) {
                                        const imgData = await imgUrImage(msg.content)
                                        embed.image.url = imgData.data.link
                                    } else {
                                        embed.image.url = msg.content
                                    }
                                }
                                mp.delete()
                                updateEmbed()
                                await msg.delete()
                            });
                    })
                } else if (r.emoji.name === '🌐') {
                    await message.channel.send(lang.embedBuilder.urlMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first()
                                if (!msg.content.toLowerCase().startsWith('http') && !msg.content.toLowerCase().startsWith('https')) return message.channel.send(lang.embedBuilder.errorUrl)
                                embed.url = msg.content
                                mp.delete()
                                updateEmbed()
                                await msg.delete()

                            });
                    })
                } else if (r.emoji.name === '🎨') {
                    await message.channel.send(lang.embedBuilder.colorMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                const color = colorNameToHex(msg.content.toLowerCase()) || hexColorCheck(msg.content)
                                await msg.delete()
                                mp.delete()
                                if (!color) return message.channel.send(lang.embedBuilder.errorColor)
                                embed.color = color
                                updateEmbed()

                            });
                    })
                } else if (r.emoji.name === '⏲') {
                    embed.timestamp = new Date()
                    updateEmbed()
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
                                ch = await msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content)
                                await mp.delete();
                                await msg.delete();

                                if (!ch || ch.deleted) return await message.channel.send(lang.embedBuilder.errorChannel)

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
                                                embed = embedMsg.embeds[0]
                                                updateEmbed()

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

                } else if (r.emoji.name === '❌') {
                    await message.channel.send(lang.embedBuilder.cancelMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msG = cld.first();
                                if (msG.content.toLowerCase() === lang.yes) {
                                    await mp.delete()
                                    await editEmbed.delete()
                                    await msg.delete()
                                    await msG.delete()
                                    await message.delete()
                                }
                                if (msg.content.toLowerCase() === lang.no) {
                                    mp.delete()
                                    await msG.delete()
                                }
                            });
                    })
                } else if (r.emoji.name === '✅') {
                    await message.channel.send(lang.embedBuilder.sendMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msgs = cld.first();
                                const channel = msgs.mentions.channels.first() || msgs.guild.channels.cache.get(msgs.content);
                                if (!client.botperso && !client.config.dev) {
                                    if (embed.thumbnail.url) {
                                        client.shard.broadcastEval(`
                                    (async () => {
                                        let channel = this.channels.cache.get('803206140858990632');
                                        let msg;
                                        if (channel) {
                                            msg = await channel.send('${embed.thumbnail.url}');
                                        }
                                        return msg;
                                    })();
                                      
                                    `);


                                    }
                                    if (embed.image.url) {
                                        await client.cluster.broadcastEval(`
                                    (async () => {
                                        let channel = this.channels.cache.get('803206140858990632');
                                        let msg;
                                        if (channel) {
                                            msg = await channel.send('${embed.image.url}');
                                        }
                                        return msg;
                                    })();
                                    `);


                                    }
                                }

                                finishEmbed(channel)
                                await mp.delete()
                                await msg.delete();
                                await msgs.delete();
                                await editEmbed.delete();
                            });
                    })
                }
            })
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    message.channel.send(lang.error.timeout)
                }
            });
        })

        function updateEmbed() {
            editEmbed.edit({embed})
        }

        function finishEmbed(channel) {
            channel.send({embed})
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
};
