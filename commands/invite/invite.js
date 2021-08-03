const Discord = require('discord.js')
const {MessageActionRow, MessageSelectMenu} = require("discord.js");

module.exports = {

    name: 'invite',
    description: "Setup the invite system or show the number of invitation of a member | Configurer le system d'invitation ou afficher le nombre d'invitation d'un membre",
    usage: 'invite [config / mention/ id]',
    category: 'invite',
    clientPermissions: ['ADD_REACTIONS'],
    aliases: ['welcome'],
    cooldown: 4,


    run: async (client, message, args) => {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;

        const config = args[0] === "config";
        const color = guildData.get('color')
        let userData;
        if (!args[0]) {
            userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`)
            let count = userData.get('invite');
            let inv = "invite";
            if (count.join - count.leave > 1) {
                inv = 'invites'
            }
            const embed = new Discord.MessageEmbed()
                .setDescription(`${lang.invite.countDesc(message.author.tag || message.author.username, count.join - count.leave > 0 ? count.join - count.leave : 0, inv)}\n (__${count.join}__ join, __${count.leave}__ leave, __${count.fake}__ fake, __${count.bonus}__ bonus)`)
                .setColor(`${color}`)
                .setTimestamp()
                .setFooter(client.user.tag)
            message.reply({embeds: [embed]});
        } else if (message.mentions.members.first() || !isNaN(args[0])) {
            const member = await message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(async err => {
            })
            userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${member.user.id}`)
            let count = userData.get('invite');
            let inv = "invite";
            if (count.join - count.leave > 1) {
                inv = 'invites'
            }
            const embed = new Discord.MessageEmbed()
                .setDescription(`${lang.invite.countDesc(member.user.tag || member.user.username, count.join - count.leave > 0 ? count.join - count.leave : 0, inv)}\n (__${count.join}__ join, __${count.leave}__ leave, __${count.fake}__ fake, __${count.bonus}__ bonus)`)
                .setColor(`${color}`)
                .setTimestamp()
                .setFooter(client.user.tag)
            message.reply(embed);
        }

        if (config) {
            if (!guildData.isGuildOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
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

        } else if (args[0] === "sync") {
            const newInv = await message.guild.invites.fetch()
            await message.guild.members.fetch()
            const invitesCount = new Map();
            for (const [code, invite] of newInv) {
                guildData.cachedInv.set(code, invite)
                const member = await message.guild.members.resolve(invite.inviter.id)
                if (member && invite) {
                    if (!invitesCount.has(member.id)) invitesCount.set(member.id, 0)
                    let amount = invitesCount.get(member.id);
                    invitesCount.set(member.id, amount += invite.uses)
                }

            }
            for (const [id, count] of invitesCount) {
                userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${id}`).set('invite', {
                    join: count,
                    leave: 0,
                    fake: 0,
                    bonus: 0
                }).save()
            }
            invitesCount.clear()

            message.channel.send(lang.invite.syncSuccess)
        }

    }
}
