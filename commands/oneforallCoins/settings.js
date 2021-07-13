const coinSettings = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'shop-settings',
            description: 'Setup the shop | Configurer le shop',
            // Optionnals :
            usage: 'shop-settings',
            category: 'coins',
            tags: ['guildOnly'],
            aliases: ['coins-settings', 'coin-settings'],
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
            cooldown: 4,
            guildOwnerOnly: true
        });
    }

    async run(client, message, args) {

          const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;


        const color = guildData.get('color')
        const principalMsg = await message.channel.send(lang.loading)
        const emoji = ['🎥', '😶', '💌', '❌', '🌀', '✅']
        for (const em of emoji) {
            await principalMsg.react(em)
        }
        const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        const config = {
            enable: message.guild.config.coinsOn,
            streamBoost: message.guild.config.streamBoost,
            muteDiviseur: message.guild.config.muteDiviseur,
            logs: message.guild.config.coinsLogs
        }
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.coinSettings.title)
            .setDescription(lang.coinSettings.description(config.streamBoost, config.muteDiviseur, config.logs, config.enable === false ? 'Désactiver' : 'Activer'))
            .setColor(`${color}`)
            .setFooter(client.user.username)
            .setTimestamp()
        principalMsg.edit('', embed).then(async m => {
            const collector = m.createReactionCollector(filter, {time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === emoji[0]) {
                    message.channel.send(lang.coinSettings.streamBoostQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content === "cancel") return message.channel.send(lang.cancel).then(mps => mps.delete({timeout: 4000}))
                                if (isNaN(msg.content)) return message.channel.send(lang.coinSettings.onlyNumber).then(mp => mp.delete({timeout: 4000}))
                                config.streamBoost = msg.content
                                await msg.delete()
                                mp.delete()
                                updateEmbed()
                            })
                    })
                } else if (r.emoji.name === emoji[1]) {
                    message.channel.send(lang.coinSettings.muteDiviseurQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();
                                if (msg.content === "cancel") return message.channel.send(lang.cancel).then(mp => mp.delete({timeout: 4000}))
                                if (isNaN(msg.content)) return message.channel.send(lang.coinSettings.onlyNumber).then(mp => mp.delete({timeout: 4000}))
                                config.muteDiviseur = msg.content
                                await msg.delete()
                                mp.delete()
                                updateEmbed()
                            })
                    })

                } else if (r.emoji.name === emoji[2]) {
                    message.channel.send(lang.coinSettings.logsQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                            .then(async cld => {
                                let msg = cld.first();

                                if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'cancel') {
                                    return message.channel.send(lang.coinSettings.errorNotChannel)
                                }
                                if (msg.content === "cancel") return message.channel.send(lang.cancel).then(mps => mps.delete({timeout: 4000}))
                                let ch;
                                if (!isNaN(msg.content)) {
                                    try {
                                        ch = message.guild.channels.cache.get(msg.content)

                                    } catch (err) {
                                        console.log("err", err)
                                    }
                                } else if (msg.mentions.channels.first()) ch = msg.mentions.channels.first();

                                if (ch.type !== 'text') await message.channel.send(lang.coinSettings.errorNotChannel).then((e) => {
                                    return setTimeout(() => {
                                        e.delete()
                                    }, 2000);
                                })
                                config.logs = ch.id
                                updateEmbed()
                                setTimeout(() => {
                                    msg.delete();
                                    mp.delete();
                                }, 2000)
                            })
                    })
                } else if (r.emoji.name === emoji[3]) {
                    message.channel.send(lang.coinSettings.cancel).then((mp) => {

                        collector.stop();
                        setTimeout(async () => {
                            mp.delete()
                        }, 2000)
                        return principalMsg.delete();

                    })
                } else if (r.emoji.name === emoji[4]) {
                    config.enable = !config.enable;
                    updateEmbed()

                } else if (r.emoji.name === emoji[5]) {

                    message.guild.updateShopSettings(config.streamBoost, config.muteDiviseur, config.logs, config.enable === true).then(() => {
                        coinSettings.set(message.guild.id, config)
                        message.channel.send(lang.coinSettings.save).then(mp => {
                            setTimeout(() => {
                                mp.delete()
                                principalMsg.delete()
                            }, 2000)
                        })
                    })
                }

                function updateEmbed() {
                    embed.setDescription(lang.coinSettings.description(config.streamBoost, config.muteDiviseur, config.logs, config.enable == false ? 'Désactiver' : 'Activer'))
                    principalMsg.edit(embed)
                }
            });

        })

    }
};
