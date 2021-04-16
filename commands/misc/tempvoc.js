const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const categoryNameMapping = new Map();

const enable = new Map();


module.exports = new Command({
    name: 'tempvoc',
    description: 'Show the tempvoc menu | Afficher le menu de vocal temporaire',
    // Optionnals :
    usage: '!tempvoc',
    category: 'misc',
    tags: ['guildOnly'],
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const msg = await message.channel.send(lang.loading);
    const emojis = ['🕳', '💬', '💨', '💥', '❌', '✅']
    for (const emoji of emojis) {
        await msg.react(emoji)
    }
    await this.connection.query(`SELECT tempvocInfo, isOn FROM tempvoc WHERE guildId = '${message.guild.id}' `).then((result) => {
        if (result[0].length == 0) {
            categoryNameMapping.set(message.guild.id, JSON.stringify({ catId: 'Non définie', chId: undefined, chName: 'Non définie' }))
            enable.set(message.guild.id, 'Désactivé')

        } else {
            categoryNameMapping.set(message.guild.id, result[0][0].tempvocInfo)

            if (result[0][0].isOn == '1') enable.set(message.guild.id, "Activé")
            if (result[0][0].isOn == '0') enable.set(message.guild.id, "Désactivé")

        }
    })
    const embed = new Discord.MessageEmbed()
        .setTitle(lang.tempvoc.embedTitle)
        .setDescription(lang.tempvoc.embedDescription(JSON.parse(categoryNameMapping.get(message.guild.id)).chName, enable.get(message.guild.id)))
        .setColor(`${color}`)
        .setTimestamp()
        .setFooter(client.user.username);

    const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
        dureefiltrer = response => { return response.author.id === message.author.id };
    msg.edit(" ", embed).then(async m => {
        const collector = m.createReactionCollector(filter, { time: 900000 });
        collector.on('collect', async r => {
            r.users.remove(message.author);
            if (r.emoji.name == emojis[0]) {
                message.channel.send(lang.tempvoc.loadingCreation).then((loading) => {
                    message.guild.channels.create(lang.tempvoc.autoCat, {
                        type: 'category',
                        permissionsOverwrites: [{
                            id: message.guild.id,
                            allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
                        }],
                        reason: `Auto config tempvoc`
                    }).then(c => {
                        categoryNameMapping.set(message.guild.id, JSON.stringify({ catId: c.id, chId: undefined, chName: 'Non définie' }))
                        c.guild.channels.create(lang.tempvoc.autoChName, {
                            type: 'voice',
                            parent: c.id,
                            permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
                                },
                            ],
                            reason: `Auto config tempvoc`
                        }).then(v => {
                            loading.edit(lang.tempvoc.autoConfigFinish).then(finish => {
                                categoryNameMapping.set(message.guild.id, JSON.stringify({ catId: c.id, chId: v.id, chName: 'Non définie' }))

                                finish.delete({ timeout: 3000 });
                                updateEmbed()
                            })
                        });
                    })
                })
            }
            if (r.emoji.name == emojis[1]) {
                await message.channel.send(lang.tempvoc.nameQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 50000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (msg.content.toLowerCase() == "cancel") {
                                const reply = await message.channel.send(lang.cancel)
                                await reply.delete({ timeout: 2000 })
                                await msg.delete({ timeout: 2000 })
                                return await mp.delete({ timeout: 2000 })
                            }
                            if (!msg.content.includes('{username}') && msg.content.toLowerCase() != 'cancel') {
                                return await message.channel.send(lang.tempvoc.errorNoUsername).then(async (replyMSG) => {
                                    setTimeout(async () => {
                                        await msg.delete();
                                        await mp.delete();
                                        return await replyMSG.delete();
                                    }, 2000)
                                })
                            }
                            const info = JSON.parse(categoryNameMapping.get(message.guild.id))
                            categoryNameMapping.set(message.guild.id, JSON.stringify({ catId: info.catId, chId: info.chId, chName: msg.content }))
                            updateEmbed()
                            setTimeout(async () => {
                                await mp.delete();
                                await msg.delete();
                            }, 3000)
                        })
                })
            }
            if (r.emoji.name == emojis[2]) {
                if (enable.get(message.guild.id) == 'Désactivé') {
                    enable.set(message.guild.id, 'Activé')

                } else {
                    enable.set(message.guild.id, 'Désactivé')

                }
                updateEmbed()
            }
            if (r.emoji.name == emojis[3]) {
                await this.connection.query(`DELETE FROM tempvoc WHERE guildId = '${message.guild.id}'`).then(async (res) => {
                    if (res[0].affectedRows == 0) {
                        const reply = await message.channel.send(lang.tempvoc.tempVocNotFound).then(async (replyMSG) => {
                            setTimeout(async () => {
                                await replyMSG.delete();
                                return await msg.delete()

                            }, 2000)
                        })
                    } else {
                        const reply = await message.channel.send(lang.reactionRole.successDel).then(async (replyMSG) => {
                            setTimeout(async () => {
                                await replyMSG.delete();
                                return await msg.delete()
                            }, 2000)
                        })
                        StateManager.emit('tempvocDel', message.guild.id)
                    }
                })
            }
            if (r.emoji.name == emojis[4]) {
                message.channel.send(lang.tempvoc.cancel).then((mp) => {
                    enable.delete(message.guild.id);
                    categoryNameMapping.delete(message.guild.id);
                    collector.stop('user_stop');
                    setTimeout(async () => { mp.delete() }, 2000)
                    return msg.delete();

                })
            }
            if (r.emoji.name == emojis[5]) {
                const info = JSON.parse(categoryNameMapping.get(message.guild.id))
                if (info.catId == 'Non définie') {
                    return await message.channel.send(lang.tempvoc.noCat).then(async (replyMSG) => {
                        setTimeout(async () => {
                            return await replyMSG.delete();
                        }, 2000)
                    })
                }
                let isOn;
                if (enable.get(message.guild.id) == 'Activé') isOn = '1'
                if (enable.get(message.guild.id) == 'Désactivé') isOn = '0'
                const check = await this.connection.query(`SELECT * FROM tempvoc WHERE guildId = '${message.guild.id}'`)
                if (check[0].length != 0 && isOn == check[0][0].isOn) {
                    return await message.channel.send(lang.tempvoc.alreadyTempvoc).then(async (replyMSG) => {
                        setTimeout(async () => {
                            return await replyMSG.delete();
                        }, 2000)
                    })
                }
                if ( check[0].length != 0 &&check[0][0].isOn != isOn ) {
                    await this.connection.query(`UPDATE tempvoc SET isOn = '${isOn}' WHERE guildId = '${message.guild.id}'`).then(() => {
                        return message.channel.send(lang.tempvoc.success).then(async (replyMSG) => {
                            StateManager.emit('tempVocOnUp', message.guild.id, isOn)
                            setTimeout(async () => {
                                await msg.delete();
                                return await replyMSG.delete();
                            }, 2000)
                        })
                    })

                } else {
                    await this.connection.query(`INSERT INTO tempvoc VALUES ('${message.guild.id}', '${categoryNameMapping.get(message.guild.id)}', '${isOn}')`).then(() => {
                        StateManager.emit('tempVocOnUp', message.guild.id, isOn)
                        
                        StateManager.emit('tempVocInfoUp', message.guild.id, JSON.parse(categoryNameMapping.get(message.guild.id)))
                        return message.channel.send(lang.tempvoc.success).then(async (replyMSG) => {
                            setTimeout(async () => {
                                await msg.delete();
                                return await replyMSG.delete();
                            }, 2000)
                        })
                    })
                }

            }
            function updateEmbed() {
                embed.setDescription(lang.tempvoc.embedDescription(JSON.parse(categoryNameMapping.get(message.guild.id)).chName, enable.get(message.guild.id)))
                msg.edit(embed)


            }
        })
        collector.on('end', async (collected, reason) => {
            if (reason == 'time') {
                const replyMsg = await message.channel.send(lang.error.timeout)
                enable.delete(message.guild.id);
                categoryNameMapping.delete(message.guild.id);

                setTimeout(() => {
                    replyMsg.delete()
                }, 2000)
            }
            if (reason == 'user_stop') {
                enable.delete(message.guild.id);
                categoryNameMapping.delete(message.guild.id);

            }
            if (reason == "messageDelete") {
                enable.delete(message.guild.id);
                categoryNameMapping.delete(message.guild.id);
            }


        })
    })
});

embedsColor(guildEmbedColor);
langF(guildLang);
