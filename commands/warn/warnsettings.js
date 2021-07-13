const warnSanction = new Map();
const tempWarn = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'warn-config',
            description: 'Configure the warn system | Configurer le system de warn',
            // Optionnals :
            usage: 'warn-config',
            category: 'warn',
            aliases: ['setwarn', 'warnconfig', 'warnsetup', 'warn-conf', 'warn config'],
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['EMBED_LINKS'],
            guildOwnerOnly: true,
            cooldown: 4
        });
    }

    async run(client, message, args) {
        warnSanction.set(message.guild.id, {
            ban : message.guild.config.warnBan,
            kick : message.guild.config.warnKick,
            mute : message.guild.config.warnMute
        })
        const color = guildData.get('color')
        const warnBan = warnSanction.get(message.guild.id).ban
        const warnKick = warnSanction.get(message.guild.id).kick
        const warnMute = warnSanction.get(message.guild.id).mute
        tempWarn.set(message.guild.id, warnSanction.get(message.guild.id))
          const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;


        const principalMsg = await message.channel.send(lang.loading)
        const emoji = ['💥', '💢', '😶', '❌', '✅']
        for (const em of emoji) {
            await principalMsg.react(em)
        }
        const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.warn.settingsTitle)
            .setDescription(lang.warn.description(warnBan, warnKick, warnMute))
            .setFooter(client.user.tag)
            .setColor(`${color}`)
            .setTimestamp();
        principalMsg.edit(' ', embed).then(async m => {
            const collector = m.createReactionCollector(filter, {time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === emoji[0]) {
                    message.channel.send(lang.warn.banQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() === 'cancel') return message.channel.send(lang.cancel).then(mps => {
                                    setTimeout(() => {
                                        mp.delete()
                                        msg.delete()
                                        mps.delete()
                                    }, 4000)
                                })
                                if (isNaN(msg.content)) return message.channel.send(lang.warn.onlyNumber).then(mps => {
                                    setTimeout(() => {
                                        mp.delete()
                                        msg.delete()
                                        mps.delete()
                                    }, 4000)
                                })

                                tempWarn.get(message.guild.id).ban = parseInt(msg.content);
                                updateEmbed()
                                setTimeout(() => {
                                    mp.delete()
                                    msg.delete()
                                }, 4000)


                            })
                    })
                } else if (r.emoji.name === emoji[1]) {
                    message.channel.send(lang.warn.kickQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() === 'cancel') return message.channel.send(lang.cancel).then(mps => {
                                    setTimeout(() => {
                                        mp.delete()
                                        msg.delete()
                                        mps.delete()
                                    }, 4000)
                                })
                                if (isNaN(msg.content)) return message.channel.send(lang.warn.onlyNumber).then(mps => {
                                    setTimeout(() => {
                                        mp.delete()
                                        msg.delete()
                                        mps.delete()
                                    }, 4000)
                                })

                                tempWarn.get(message.guild.id).kick = parseInt(msg.content);
                                updateEmbed()
                                setTimeout(() => {
                                    mp.delete()
                                    msg.delete()
                                }, 4000)


                            })
                    })
                } else if (r.emoji.name === emoji[2]) {
                    message.channel.send(lang.warn.muteQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content.toLowerCase() === 'cancel') return message.channel.send(lang.cancel).then(mps => {
                                    setTimeout(() => {
                                        mp.delete()
                                        msg.delete()
                                        mps.delete()
                                    }, 4000)
                                })
                                if (isNaN(msg.content)) return message.channel.send(lang.warn.onlyNumber).then(mps => {
                                    setTimeout(() => {
                                        mp.delete()
                                        msg.delete()
                                        mps.delete()
                                    }, 4000)
                                })

                                tempWarn.get(message.guild.id).mute = parseInt(msg.content);
                                updateEmbed()
                                setTimeout(() => {
                                    mp.delete()
                                    msg.delete()
                                }, 4000)


                            })
                    })
                } else if (r.emoji.name === emoji[3]) {
                    message.channel.send(lang.warn.cancel).then((mp) => {
                        tempWarn.delete(message.guild.id);
                        collector.stop();
                        setTimeout(async () => {
                            mp.delete()
                        }, 2000)
                        return principalMsg.delete();

                    })
                } else if (r.emoji.name === emoji[4]) {
                    await message.guild.updateWarn(tempWarn.get(message.guild.id).ban, tempWarn.get(message.guild.id).kick, tempWarn.get(message.guild.id).mute).then((res) => {
                        message.channel.send(lang.warn.save).then(async (mp) => {
                            collector.stop();
                            principalMsg.delete()
                        })
                    })
                }
                collector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        message.channel.send(lang.error.timeout)
                    }
                    tempWarn.delete(message.guild.id)
                });

            })

            function updateEmbed() {
                const tempWarns = tempWarn.get(message.guild.id)
                embed.setDescription(lang.warn.description(tempWarns.ban, tempWarns.kick, tempWarns.mute))
                principalMsg.edit(embed)

            }
        })


    }
}
