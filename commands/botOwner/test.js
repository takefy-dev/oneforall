const {MessageActionRow, MessageSelectMenu} = require('discord.js');
const {log} = require("nodemon/lib/utils");

module.exports = {

    name: 'test',
    description: 'test',
    category: 'test',


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const color = guildData.get('color')
        const invite = client.functions.copyObject(guildData.get('invite'));
        const embed = (config) => {
            return {
                title: 'Configuration',
                fields: [
                    {
                        name: 'Channel',
                        value: config.id === 'Non définie' ? 'Non définie' : `<#${config.id}>`,
                    },
                    {
                        name: 'Message',
                        value: config.message
                    },
                    {
                        name: 'Actif',
                        value: client.functions.enableEmoji(config.enable)
                    }
                ],
                color
            }
        }
        const options = lang.invite.options
        if (invite.enable) options[3].label = 'Désactiver'
        else options[3].label = 'Activer'

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('invite-config')
                .setPlaceholder('Configure the invite system')
                .addOptions(options)
        )
        const panel = await message.channel.send({embeds: [embed(invite)], components: [row]})
        const filter = (interaction) => interaction.customId === 'invite-config' && interaction.user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const collector = panel.channel.createMessageComponentCollector({filter, time: 90000});
        collector.on('collect', async (interaction) => {
            const value = interaction.values[0];
            await interaction.deferUpdate()
            if (value === "channel") {
                const messageQuestion = await message.channel.send(lang.invite.chQ);
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                })
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
                        if (!tempChannel || tempChannel.deleted) return message.channel.send(lang.reactionRole.invalidChannel).then((rp) => {
                            setTimeout(() => {
                                rp.delete()
                            }, 3500)
                        })
                        invite.id = tempChannel.id;
                        updateEmbed()
                        message.channel.send(lang.reactionRole.successCh(tempChannel)).then((rp) => {
                            setTimeout(() => {
                                rp.delete()
                            }, 3500)
                        });
                    }
                })
            }
            if(value === "message"){
                const messageQuestion = await message.channel.send(lang.invite.msgQ);
                row.components[0].setDisabled(true)
                await panel.edit({
                    components: [row]
                })
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
                        invite.message = msg.content
                        updateEmbed()
                    }
                })
            }
            if(value === "help"){
                message.channel.send({embeds: [{
                    description: lang.invite.help,
                        color
                    }]})
            }
            if(value === 'enable'){
                invite.enable = !invite.enable
                if (invite.enable) options[3].label = 'Désactiver'
                else options[3].label = 'Activer'
                row.components[0].options = options
                panel.edit({
                    components: [row]
                })
                updateEmbed()
            }
            if(value === 'save'){
                guildData.set('invite', invite).save().then(() => {
                    message.channel.send(`Configuration saved`)
                    collector.stop()
                })
            }
        })
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
        function updateEmbed() {
            panel.edit({embeds: [embed(invite)]})
        }
    }
}