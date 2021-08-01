const Command = require('../../structures/Handler/Command');
const {MessageActionRow, MessageSelectMenu} = require('discord.js')
const fetch = require("node-fetch");
const colorNameToHex = require("colornames");
const hexColorRegex = require("hex-color-regex");

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'test',
            description: 'test',
            category: 'test',

        });
    }

    async run(client, message, args) {
        const lang = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id).lang
        let embed = {
            description: lang.embedBuilder.descriptionRequired,
            author: {},
            thumbnail: {},
            image: {},
            footer: {},
        }
        let tempCopy = {}

        let defaultOptions = lang.embedBuilder.baseMenu
        let page = 0;
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('embed-builder')
                .setPlaceholder('Create your embed')
                .addOptions(defaultOptions)
        )

        const filter = (interaction) => interaction.customId === 'embed-builder' && interaction.user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const panel = await message.channel.send({components: [row], embeds: [embed]})

        const collector = panel.channel.createMessageComponentCollector({filter, time: 90000});
        collector.on('collect', async (interaction) => {
            let options;
            let placeHolder;
            const value = interaction.values[0]
            if (value === "back") {
                page = 0;
                return updateOptions(interaction)
            }
            if(value.includes('copy')){
                if(value === 'copy'){
                    options = lang.embedBuilder.copyOptions
                    page = 1
                    placeHolder = lang.embedBuilder.copyPlaceHolder
                }
                if(value === 'copy-channel'){
                    const msg = await message.channel.send(lang.embedBuilder.copyMsg);
                    row.components[0].setDisabled(true)
                    await panel.edit({
                        components: [row]
                    })
                    await interaction.deferUpdate()
                    await msg.channel.awaitMessages({
                        filter: dureefiltrer,
                        limit: 1,
                        max: 1,
                        time: 60000,

                        errors: ['time']
                    }).then(async (cld) => {
                        const receivedMsg = cld.first()
                        if (receivedMsg.content !== 'cancel') {
                            const tempChannel = receivedMsg.mentions.channels.first() || message.guild.channels.cache.get(receivedMsg.content);
                            tempCopy.channel = tempChannel.id
                        }
                        msg.delete()
                        await receivedMsg.delete()
                        row.components[0].setDisabled(false)
                        await panel.edit({
                            components: [row]
                        })
                    })
                }
                if(value === 'copy-id'){
                    if(! tempCopy.channel) return message.channel.send(lang.embedBuilder.errorChannel)
                    const msg = await message.channel.send(lang.embedBuilder.messageId);
                    row.components[0].setDisabled(true)
                    await panel.edit({
                        components: [row]
                    })
                    await interaction.deferUpdate()
                    await msg.channel.awaitMessages({
                        filter: dureefiltrer,
                        limit: 1,
                        max: 1,
                        time: 60000,

                        errors: ['time']
                    }).then(async (cld) => {
                        const receivedMsg = cld.first()
                        if (receivedMsg.content !== 'cancel') {
                            tempCopy.message = await message.guild.channels.cache.get(tempCopy.channel).messages.fetch(receivedMsg.content);
                        }
                        msg.delete()
                        await receivedMsg.delete()
                        row.components[0].setDisabled(false)
                        await panel.edit({
                            components: [row]
                        })
                    })
                }
                if(value === 'copy-valid'){
                    if(!tempCopy.message) return message.channel.send(lang.embedBuilder.errorMessage(tempCopy.channel ? tempCopy.channel : 'Non définie'));
                    embed = tempCopy.message.embeds[0];
                    updateEmbed()
                    interaction.deferUpdate()
                }

            }
            if (value.includes('footer')) {
                if (value === 'footer') {
                    options = lang.embedBuilder.footerOptions
                    page = 1
                    placeHolder = lang.embedBuilder.footerPlaceHolder
                }
                if (value === 'footer-text') {
                    const msg = await message.channel.send(lang.embedBuilder.footerMsg);
                    row.components[0].setDisabled(true)
                    await panel.edit({
                        components: [row]
                    })
                    await interaction.deferUpdate()
                    await msg.channel.awaitMessages({
                        filter: dureefiltrer,
                        limit: 1,
                        max: 1,
                        time: 60000,

                        errors: ['time']
                    }).then(async (cld) => {
                        const receivedMsg = cld.first()
                        if (receivedMsg.content !== 'cancel') {
                            embed.footer.text = receivedMsg.content
                        } else {
                            delete embed.footer.text
                        }
                        msg.delete()
                        await receivedMsg.delete()
                        row.components[0].setDisabled(false)
                        await panel.edit({
                            components: [row]
                        })
                    })
                }
                if (value === 'footer-icon') {
                    const msg = await message.channel.send(lang.embedBuilder.footerUrl);
                    row.components[0].setDisabled(true)
                    await panel.edit({
                        components: [row]
                    })
                    await interaction.deferUpdate()
                    await msg.channel.awaitMessages({
                        filter: dureefiltrer,
                        limit: 1,
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }).then(async (cld) => {
                        const receivedMsg = cld.first()


                        if (receivedMsg.content !== 'cancel') {
                            if (receivedMsg.attachments.size > 0) {
                                const imgData = await imgUrImage(receivedMsg.attachments.first().url)
                                embed.footer.icon_url = imgData.data.link
                            } else if (receivedMsg.content) {
                                if (!receivedMsg.content.includes('i.imgur.com') && !receivedMsg.content.includes('tenor.com')) {
                                    const imgData = await imgUrImage(receivedMsg.content)
                                    embed.author.icon_url = imgData.data.link

                                } else {
                                    embed.footer.icon_url = msg.content
                                }
                            }
                        } else {
                            delete embed.footer.icon_url
                        }
                        msg.delete()
                        await receivedMsg.delete()
                        row.components[0].setDisabled(false)
                        await panel.edit({
                            components: [row]
                        })
                    })
                }
                updateEmbed()
            }
            if (value.includes('author')) {
                if (value === 'author') {

                    options = lang.embedBuilder.authorOptions
                    page = 1
                    placeHolder = lang.embedBuilder.authorPlaceHoler

                }
                if (value === 'author-text') {
                    const msg = await message.channel.send(lang.embedBuilder.authorMsg);
                    row.components[0].setDisabled(true)
                    await panel.edit({
                        components: [row]
                    })
                    await interaction.deferUpdate()
                    await msg.channel.awaitMessages({
                        filter: dureefiltrer,
                        limit: 1,
                        max: 1,
                        time: 60000,

                        errors: ['time']
                    }).then(async (cld) => {
                        const receivedMsg = cld.first()
                        if (receivedMsg.content !== 'cancel') {
                            embed.author.name = receivedMsg.content
                        } else {
                            delete embed.author.name
                        }
                        msg.delete()
                        await receivedMsg.delete()
                        row.components[0].setDisabled(false)
                        await panel.edit({
                            components: [row]
                        })
                    })
                }
                if (value === 'author-url') {
                    const msg = await message.channel.send(lang.embedBuilder.authorUrl);
                    row.components[0].setDisabled(true)
                    await panel.edit({
                        components: [row]
                    })
                    await interaction.deferUpdate()
                    await msg.channel.awaitMessages({
                        filter: dureefiltrer,
                        limit: 1,
                        time: 60000,

                        max: 1,
                        errors: ['time']
                    }).then(async (cld) => {
                        const receivedMsg = cld.first()
                        if (!receivedMsg.content.toLowerCase().startsWith('http') && !receivedMsg.content.toLowerCase().startsWith('https') && msg.content.toLowerCase() !== 'cancel') return message.channel.send(lang.embedBuilder.errorUrl).then((rp) => {
                            setTimeout(() => {
                                rp.delete()
                            }, 3000)
                        })
                        if (receivedMsg.content !== 'cancel') {
                            embed.author.url = receivedMsg.content
                        } else {
                            delete embed.author.url
                        }
                        msg.delete()
                        await receivedMsg.delete()
                        row.components[0].setDisabled(false)
                        await panel.edit({
                            components: [row]
                        })
                    })
                }
                if (value === 'author-icon') {
                    const msg = await message.channel.send(lang.embedBuilder.authorIcon);
                    row.components[0].setDisabled(true)
                    await panel.edit({
                        components: [row]
                    })
                    await interaction.deferUpdate()
                    await msg.channel.awaitMessages({
                        filter: dureefiltrer,
                        limit: 1,
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }).then(async (cld) => {
                        const receivedMsg = cld.first()


                        if (receivedMsg.content !== 'cancel') {
                            if (receivedMsg.attachments.size > 0) {
                                const imgData = await imgUrImage(receivedMsg.attachments.first().url)
                                embed.author.icon_url = imgData.data.link
                            } else if (receivedMsg.content) {
                                if (!receivedMsg.content.includes('i.imgur.com') && !receivedMsg.content.includes('tenor.com')) {
                                    const imgData = await imgUrImage(receivedMsg.content)
                                    embed.author.icon_url = imgData.data.link

                                } else {
                                    embed.author.icon_url = msg.content
                                }
                            }
                        } else {
                            delete embed.author.icon_url
                        }
                        msg.delete()
                        await receivedMsg.delete()
                        row.components[0].setDisabled(false)
                        await panel.edit({
                            components: [row]
                        })
                    })
                }
                updateEmbed()

            }
            if (value === 'author' || value === 'footer' || value === 'copy') updateOptions(interaction, placeHolder, options)
            if (page === 0) {
                const theOptions = defaultOptions.find(opts => opts.value === value);
                if (theOptions.questionOnly) {
                    const toSend = lang.embedBuilder[`${value}Msg`]
                    if (!toSend) {
                        embed.timestamp = new Date()
                        updateEmbed()
                        return interaction.deferUpdate()
                    }

                    const msg = await message.channel.send(toSend)
                    row.components[0].setDisabled(true)
                    await panel.edit({
                        components: [row]
                    })
                    await interaction.deferUpdate()
                    await msg.channel.awaitMessages({
                        filter: dureefiltrer,
                        limit: 1,
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    }).then(async (cld) => {
                        const receivedMsg = cld.first()
                        if (receivedMsg.content !== 'cancel') {
                            if (value === 'thumbnail' || value === 'image') {
                                if (receivedMsg.attachments.size > 0) {
                                    const imgData = await imgUrImage(receivedMsg.attachments.first().url)
                                    embed[value].url = imgData.data.link
                                } else if (receivedMsg.content) {
                                    if (!receivedMsg.content.includes('i.imgur.com') && !receivedMsg.content.includes('tenor.com')) {
                                        const imgData = await imgUrImage(receivedMsg.content)
                                        embed[value].url = imgData.data.link

                                    } else {
                                        embed[value].url = receivedMsg.content
                                    }
                                }
                            } else if(value === 'color'){
                                const color = colorNameToHex(receivedMsg.content.toLowerCase()) || hexColorCheck(receivedMsg.content)
                                if (!color) message.channel.send(lang.embedBuilder.errorColor)
                                embed[value] = color
                            }else{
                                embed[value] = receivedMsg.content

                            }
                            if(value === 'send'){
                                const channel = receivedMsg.mentions.channels.first() || message.guild.channels.cache.get(receivedMsg.content);
                                if(channel){
                                    channel.send({embeds: [embed]})
                                }
                            }

                        } else {
                            if (value === 'thumbnail' || value === 'image') {
                                delete embed[value].url
                            } else {

                                delete embed[value]
                            }
                        }
                        msg.delete()
                        await receivedMsg.delete()
                        row.components[0].setDisabled(false)
                        updateEmbed()
                        await panel.edit({
                            components: [row]
                        })


                    })

                }
            }


        });
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

        function updateOptions(interaction, placeHolder = 'Create your embed', options = defaultOptions) {
            if (page !== 0) options.push({
                label: 'Back',
                value: 'back',
                description: 'Go back to the default selection',
                emoji: '↩'
            })
            row.components[0].spliceOptions(0, row.components[0].options.length, options).setPlaceholder(placeHolder)
            return interaction.update({
                components: [row]
            })
        }

        function updateEmbed() {
            panel.edit({
                embeds: [embed]
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
}