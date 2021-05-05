
const title = new Map();
const description = new Map();
const author = new Map();
const footer = new Map();
const thumbnail = new Map();
const image = new Map();
const url = new Map();
const embedColor = new Map();
const fetch = require('node-fetch');
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const timestamp = new Map();
let hexColorRegex = require('hex-color-regex');
const base = require('aybabtu');
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
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
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        timestamp.set(message.guild.id, false)
        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const embed = new Discord.MessageEmbed()
            .setDescription()
        const editEmbed = await message.channel.send(embed)
        const msg = await message.channel.send(lang.embedBuilder.loading)
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
        await msg.react('❌')
        await msg.react('✅')
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
            .setColor(`${color}`);
        const filter = (reaction, user) => ['✏', '📝', '🗣', '🖍', '🖼', '✅', '💶', '🌐', '🎨', '❌', '⏲', '©'].includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.member.id === message.member.id
            };
        msg.edit("", embedBuilder).then(async m => {
            const collector = m.createReactionCollector(filter, {time: 900000});
            collector.on('collect', async r => {
                r.users.remove(message.author);
                if (r.emoji.name == '✏') {
                    await message.channel.send(lang.embedBuilder.titleMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                await title.set(message.guild.id, msg.content)
                                mp.delete()
                                updateEmbed()
                                msg.delete()


                            });
                    })
                } else if (r.emoji.name == '📝') {
                    await message.channel.send(lang.embedBuilder.descriptionMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                await description.set(message.guild.id, msg.content)
                                mp.delete()
                                updateEmbed()
                                msg.delete()

                            });
                    })
                } else if (r.emoji.name == '🗣') {
                    await message.channel.send(lang.embedBuilder.authorMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                await author.set(message.guild.id, msg.content)
                                mp.delete()
                                updateEmbed()
                                msg.delete()

                            });
                    })
                } else if (r.emoji.name == '🖍') {
                    await message.channel.send(lang.embedBuilder.footerMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                await footer.set(message.guild.id, msg.content)
                                mp.delete()
                                updateEmbed()
                                msg.delete()

                            });
                    })
                } else if (r.emoji.name == '💶') {
                    await message.channel.send(lang.embedBuilder.thumbnailMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let link;
                                let msg = cld.first();
                                if (msg.attachments.size > 0) {
                                    msg.attachments.forEach(async attachment => {
                                        await fetch(`https://api.imgur.com/3/upload/`, {
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

                                                await thumbnail.set(message.guild.id, json.data.link)
                                                sleep(1000)
                                                await updateEmbed()

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
                                                await thumbnail.set(message.guild.id, json.data.link)
                                                sleep(1000)
                                                await updateEmbed()

                                                // await ()
                                            })
                                    } else {
                                        sleep(1000)
                                        console.log(msg.content)
                                        thumbnail.set(message.guild.id, msg.content)
                                        updateEmbed()
                                    }

                                }
                                mp.delete()
                                msg.delete()

                            });
                    })
                } else if (r.emoji.name == '🖼') {
                    await message.channel.send(lang.embedBuilder.imageMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let link;
                                let msg = cld.first();
                                if (msg.attachments.size > 0) {
                                    msg.attachments.forEach(async attachment => {
                                        await fetch(`https://api.imgur.com/3/upload/`, {
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
                                                console.log(json)
                                                await image.set(message.guild.id, json.data.link)
                                                sleep(1000)
                                                await updateEmbed()

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
                                                await image.set(message.guild.id, json.data.link)
                                                sleep(1000)
                                                await updateEmbed()

                                                // await ()
                                            })


                                    } else {
                                        sleep(1000)
                                        image.set(message.guild.id, msg.content)
                                        updateEmbed()
                                    }
                                    mp.delete()

                                    msg.delete()
                                }
                            });
                    })
                } else if (r.emoji.name == '🌐') {
                    await message.channel.send(lang.embedBuilder.urlMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first()
                                if (!msg.content.toLowerCase().startsWith('http') | !msg.content.toLowerCase().startsWith('https')) return message.channel.send(lang.embedBuilder.errorUrl)
                                await url.set(message.guild.id, msg.content)
                                mp.delete()
                                updateEmbed()
                                msg.delete()

                            });
                    })
                } else if (r.emoji.name == '🎨') {
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
                                if (msg.content == 'rouge') {
                                    await embedColor.set(message.guild.id, rouge)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'vert') {
                                    await embedColor.set(message.guild.id, vert)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'jaune') {
                                    await embedColor.set(message.guild.id, jaune)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'violet') {
                                    await embedColor.set(message.guild.id, violet)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'rose') {
                                    await embedColor.set(message.guild.id, rose)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'noir') {
                                    await embedColor.set(message.guild.id, noir)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'blanc') {
                                    await embedColor.set(message.guild.id, blanc)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'bleu') {
                                    await embedColor.set(message.guild.id, bleu)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'orange') {
                                    await embedColor.set(message.guild.id, orange)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content == 'invisible') {
                                    await embedColor.set(message.guild.id, invisible)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()

                                } else if (hexColorCheck(msg.content) == true) {
                                    await embedColor.set(message.guild.id, msg.content)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else {
                                    msg.delete()
                                    mp.delete()
                                    message.channel.send(lang.embedBuilder.errorColor)
                                }


                            });
                    })
                } else if (r.emoji.name == '⏲') {
                    await message.channel.send(lang.embedBuilder.timestampMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() == 'oui') {
                                    await timestamp.set(message.guild.id, true)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content.toLowerCase() == 'non') {
                                    await timestamp.set(message.guild.id, false)
                                    mp.delete()
                                    updateEmbed()
                                    msg.delete()
                                } else if (msg.content.toLowerCase() != 'non' || msg.content.toLowerCase() != 'oui') {
                                    msg.delete()
                                    mp.delete()
                                    message.channel.send(lang.error.YesNo)
                                }


                            });
                    })
                } else if (r.emoji.name == '©') {
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
                                                if (embedMsg.embeds[0].title != null) title.set(message.guild.id, embedMsg.embeds[0].title)
                                                if (embedMsg.embeds[0].description != null) description.set(message.guild.id, embedMsg.embeds[0].description)
                                                if (embedMsg.embeds[0].url != null) url.set(message.guild.id, embedMsg.embeds[0].url)
                                                if (embedMsg.embeds[0].footer != null && embedMsg.embeds[0].footer.text != undefined) footer.set(message.guild.id, embedMsg.embeds[0].footer.text)
                                                if (embedMsg.embeds[0].color != null) embedColor.set(message.guild.id, `#${base.dec2hex(embedMsg.embeds[0].color)}`)
                                                if (embedMsg.embeds[0].timestamp != null) timestamp.set(message.guild.id, true)
                                                if (embedMsg.embeds[0].thumbnail != null && embedMsg.embeds[0].thumbnail.url != undefined) thumbnail.set(message.guild.id, embedMsg.embeds[0].thumbnail.url)
                                                if (embedMsg.embeds[0].image != null && embedMsg.embeds[0].image.url != undefined) image.set(message.guild.id, embedMsg.embeds[0].image.url)
                                                if (embedMsg.embeds[0].author != null && embedMsg.embeds[0].author.name != undefined) author.set(message.guild.id, embedMsg.embeds[0].author.name)
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

                } else if (r.emoji.name == '❌') {
                    await message.channel.send(lang.embedBuilder.cancelMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msG = cld.first();
                                if (msG.content.toLowerCase() == lang.yes) {
                                    await timestamp.set(message.guild.id, true)
                                    await mp.delete()
                                    await editEmbed.delete()
                                    await msg.delete()
                                    await msG.delete()
                                    await message.delete()
                                    title.delete(message.guild.id);
                                    description.delete(message.guild.id);
                                    author.delete(message.guild.id);
                                    thumbnail.delete(message.guild.id);
                                    footer.delete(message.guild.id);
                                    image.delete(message.guild.id);
                                    url.delete(message.guild.id);
                                    embedColor.delete(message.guild.id);
                                    timestamp.delete(message.guild.id);
                                } else if (msg.content.toLowerCase() == lang.no) {
                                    mp.delete()
                                    msG.delete()
                                    return
                                } else if (msg.content.toLowerCase() != 'non' || msg.content.toLowerCase() != 'oui') {
                                    msG.delete()
                                    mp.delete()
                                    message.channel.send(lang.error.YesNo)
                                }


                            });
                    })
                } else if (r.emoji.name == '✅') {
                    await message.channel.send(lang.embedBuilder.sendMsg).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 60000, errors: ['time']})
                            .then(async cld => {
                                let msgs = cld.first();
                                const channel = msgs.mentions.channels.first() || msgs.guild.channels.cache.get(msgs.content);
                                if (!client.botperso) {
                                    if (thumbnail.get(message.guild.id) != undefined) {
                                        client.shard.broadcastEval(`
                                    (async () => {
                                        let channel = this.channels.cache.get('803206140858990632');
                                        let msg;
                                        if (channel) {
                                            msg = await channel.send('${thumbnail.get(message.guild.id)}');
                                        }
                                        return msg;
                                    })();
                                      
                                    `);


                                    }
                                    if (image.get(message.guild.id) != undefined) {
                                        client.shard.broadcastEval(`
                                    (async () => {
                                        let channel = this.channels.cache.get('803206140858990632');
                                        let msg;
                                        if (channel) {
                                            msg = await channel.send('${image.get(message.guild.id)}');
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
                                await title.delete(message.guild.id);
                                await description.delete(message.guild.id);
                                await author.delete(message.guild.id);
                                await thumbnail.delete(message.guild.id);
                                await footer.delete(message.guild.id);
                                await image.delete(message.guild.id);
                                await url.delete(message.guild.id);
                                await embedColor.delete(message.guild.id);
                                await timestamp.delete(message.guild.id);
                            });
                    })
                }
            })
            collector.on('end', async (collected, reason) => {
                if (reason == 'time') {
                    message.channel.send(lang.error.timeout)
                }
                title.delete(message.guild.id);
                description.delete(message.guild.id);
                author.delete(message.guild.id);
                thumbnail.delete(message.guild.id);
                footer.delete(message.guild.id);
                image.delete(message.guild.id);
                url.delete(message.guild.id);
                embedColor.delete(message.guild.id);
                timestamp.delete(message.guild.id);
            });
        })

        function updateEmbed() {
            if (title.get(message.guild.id) != undefined) embed.setTitle(title.get(message.guild.id))
            if (description.get(message.guild.id) != undefined) embed.setDescription(description.get(message.guild.id))
            if (author.get(message.guild.id) != undefined) embed.setAuthor(author.get(message.guild.id))
            if (thumbnail.get(message.guild.id) != undefined) embed.setThumbnail(thumbnail.get(message.guild.id))
            if (footer.get(message.guild.id) != undefined) embed.setFooter(footer.get(message.guild.id))
            if (image.get(message.guild.id) != undefined) embed.setImage(image.get(message.guild.id))
            if (url.get(message.guild.id) != undefined) embed.setURL(url.get(message.guild.id))
            if (embedColor.get(message.guild.id) != undefined) embed.setColor(embedColor.get(message.guild.id))
            if (timestamp.get(message.guild.id) == true) {
                embed.setTimestamp()
            }
            editEmbed.edit(embed)
        }

        function finishEmbed(channel) {
            const finishEmbeds = new Discord.MessageEmbed()
            if (title.get(message.guild.id) != undefined) finishEmbeds.setTitle(title.get(message.guild.id))
            if (description.get(message.guild.id) != undefined) finishEmbeds.setDescription(description.get(message.guild.id))
            if (author.get(message.guild.id) != undefined) finishEmbeds.setAuthor(author.get(message.guild.id))
            if (thumbnail.get(message.guild.id) != undefined) finishEmbeds.setThumbnail(thumbnail.get(message.guild.id))
            if (footer.get(message.guild.id) !== undefined) finishEmbeds.setFooter(footer.get(message.guild.id))
            if (image.get(message.guild.id) !== undefined) finishEmbeds.setImage(image.get(message.guild.id))
            if (url.get(message.guild.id) != undefined) finishEmbeds.setURL(url.get(message.guild.id))
            if (embedColor.get(message.guild.id) != undefined) finishEmbeds.setColor(embedColor.get(message.guild.id))
            if (timestamp.get(message.guild.id) == true) {
                finishEmbeds.setTimestamp()
            }
            channel.send(finishEmbeds).then(() => {
                title.delete(message.guild.id);
                description.delete(message.guild.id);
                author.delete(message.guild.id);
                thumbnail.delete(message.guild.id);
                footer.delete(message.guild.id);
                image.delete(message.guild.id);
                url.delete(message.guild.id);
                embedColor.delete(message.guild.id);
                timestamp.delete(message.guild.id);
            })

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
