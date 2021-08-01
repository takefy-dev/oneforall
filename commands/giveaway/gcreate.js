const ms = require("ms");
const Command = require('../../structures/Handler/Command');
const {Util} = require("discord.js");
const {Collection, MessageEmbed} = require("discord.js");
const oldGiveawayOptions = new Collection()
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'gcreate',
            description: 'Create giveaways | Creer des giveaways',
            usage: 'gcreate <time> [winners] [prize]',
            category: 'giveaway',
            aliases: ['gstart'],
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['SEND_MESSAGES'],
            cooldown: 5

        });
    }

    async run(client, message, args) {


        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;

        const color = guildData.get('color')
        const emojis = ['🕙', '🏷️', '🕵️', '🔊', '🔮', '💫', '🎁', '✅']
        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        let giveawaysOptions = {}
        if (oldGiveawayOptions.has(message.guild.id)) giveawaysOptions = oldGiveawayOptions.get(message.guild.id);
        const time = args[0]
        let winner = args[1];
        const prize = args.slice(2).join(" ");
        function isValideTime(time) {
            return time.endsWith('s') || time.endsWith('m') || time.endsWith('h') || time.endsWith('d')
        }

        function isValideWinner(winner) {
            return !isNaN(winner) || parseInt(winner) >= 0
        }

        if (time) {
            if (!isValideTime(time)) return message.channel.send(lang.giveaway.create.incorrectTime).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 2000)
            });
            if (!winner.endsWith('w')) return message.channel.send(lang.giveaway.create.inccorectWinner).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 2000)
            });
            winner = winner.split('w')[0];
            if (!isValideWinner(winner)) return message.channel.send(lang.giveaway.create.winnerMustRange).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 2000)
            });
            if (!prize) return message.channel.send(lang.giveaway.create.noPrize).then((mp) => {
                setTimeout(() => {
                    mp.delete()
                }, 2000)
            })
            giveawaysOptions.prize = prize;
            giveawaysOptions.time = ms(time);
            giveawaysOptions.winnerCount = parseInt(winner);
            giveawaysOptions.hostedBy = message.author;
            giveawaysOptions.messages = lang.giveaway.messages;
            giveawaysOptions.channel = message.channel;
            client.giveawaysManager.start(giveawaysOptions.channel, giveawaysOptions)
        } else {
            const embed = lang.giveaway.create.embed(giveawaysOptions.time, giveawaysOptions.channel, giveawaysOptions.winnerCount, giveawaysOptions.voice, giveawaysOptions.boost, isNaN(giveawaysOptions.reaction) ? giveawaysOptions.reaction : `<${!giveawaysOptions.emoji.animated ? '' : 'a'}:${giveawaysOptions.emoji.name}:${giveawaysOptions.reaction}>`, giveawaysOptions.prize, color).setAuthor(`🎉 ${message.guild.name}`)
            const msg = await message.channel.send(lang.loading)
            for (const em of emojis) await msg.react(em);
            msg.edit('', embed).then(async m => {
                const collector = m.createReactionCollector({filter, time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === emojis[0]) {
                        message.channel.send(lang.giveaway.create.question.time).then(mp => {
                            mp.channel.awaitMessages( {dureefiltrer,max: 1, time: 30000, errors: ['time']})
                                .then(cld => {
                                    const msg = cld.first();
                                    if (!isValideTime(msg.content)) return message.channel.send(lang.giveaway.create.inccorectResponse.time).then((reply) => {
                                        setTimeout(() => {
                                            msg.delete()
                                            mp.delete()
                                            reply.delete()
                                        }, 2000)
                                    })
                                    giveawaysOptions.time = ms(msg.content);
                                    updateEmbed()
                                    return message.channel.send(lang.giveaway.create.successMessage.time(msg.content)).then((reply) => {
                                        setTimeout(() => {
                                            msg.delete()
                                            mp.delete()
                                            reply.delete()
                                        }, 2000)
                                    })
                                })
                        })
                    }
                    if (r.emoji.name === emojis[1]) {
                        message.channel.send(lang.giveaway.create.question.channel).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(cld => {
                                    const msg = cld.first()
                                    const channel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content);
                                    if (!channel || channel.type !== 'text') return message.channel.send(lang.giveaway.create.inccorectResponse.channel).then((reply) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            msg.delete()

                                            reply.delete()
                                        }, 2000)
                                    })
                                    giveawaysOptions.channel = channel;
                                    updateEmbed()
                                    return message.channel.send(lang.giveaway.create.successMessage.channel(channel)).then((reply) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            msg.delete()
                                            reply.delete()
                                        }, 2000)
                                    })
                                })
                        })
                    }
                    if (r.emoji.name === emojis[2]) {
                        message.channel.send(lang.giveaway.create.question.winnerCount).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(cld => {
                                    const msg = cld.first()
                                    const winner = msg.content
                                    if (!isValideWinner(winner)) return message.channel.send(lang.giveaway.create.winnerMustRange).then((reply) => {
                                        setTimeout(() => {
                                            msg.delete()
                                            mp.delete()
                                            reply.delete()
                                        }, 2000)
                                    })
                                    giveawaysOptions.winnerCount = parseInt(winner);
                                    updateEmbed()
                                    return message.channel.send(lang.giveaway.create.successMessage.winnerCount(winner)).then((reply) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            msg.delete()
                                            reply.delete()
                                        }, 2000)
                                    })
                                })
                        })
                    }
                    if (r.emoji.name === emojis[3]) {
                        if (!giveawaysOptions.voice === true && giveawaysOptions.boost) {
                            giveawaysOptions.exemptMembers = new Function('member', `return member.premiumSince === null && member.voice.channelID === null`)
                        } else if (!giveawaysOptions.voice === true && !giveawaysOptions.boost) {
                            giveawaysOptions.exemptMembers = new Function('member', `return member.voice.channelID === null`)
                        } else {
                           delete giveawaysOptions.exemptMembers
                        }
                        giveawaysOptions.voice = !giveawaysOptions.voice
                        updateEmbed();
                    }
                    if (r.emoji.name === emojis[4]) {
                        if (!giveawaysOptions.boost === true && giveawaysOptions.voice) {
                            giveawaysOptions.exemptMembers = new Function('member', `return  member.premiumSince === null && member.voice.channelID === null`)
                        } else if (!giveawaysOptions.boost === true && !giveawaysOptions.voice) {
                            giveawaysOptions.exemptMembers = new Function('member', `return member.premiumSince === null`)
                        } else {
                            delete giveawaysOptions.exemptMembers
                        }
                        giveawaysOptions.boost = !giveawaysOptions.boost;
                        updateEmbed();
                    }
                    if (r.emoji.name === emojis[5]) {
                        message.channel.send(lang.giveaway.create.question.reaction).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(async cld => {
                                    const msg = cld.first()
                                    const parseEmoji = Util.parseEmoji(msg.content);
                                    let emoji;
                                    if (!parseEmoji.id) {
                                        giveawaysOptions.reaction = parseEmoji.name
                                        emoji = parseEmoji.name
                                    } else {
                                        if (client.botperso) {
                                            emoji = client.emojis.cache.get(parseEmoji.id)

                                        } else {
                                            await client.shard.broadcastEval(`this.emojis.cache.get('${parseEmoji.id}')`).then((result) => {
                                                emoji = result.filter(em => em !== null)[0]
                                            })
                                        }
                                        if (!emoji) {
                                            let link = `https://cdn.discordapp.com/emojis/${parseEmoji.id}.${parseEmoji.animated ? "gif" : "png"}`
                                            emoji = await message.guild.emojis.create(link, parseEmoji.name, {reason: `emoji add par ${message.author.username} pour le giveaway`})
                                        }
                                        giveawaysOptions.reaction = emoji.id
                                    }
                                    giveawaysOptions.emoji = emoji
                                    updateEmbed()
                                    return message.channel.send(lang.giveaway.create.successMessage.reaction(msg.content)).then((reply) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            msg.delete()
                                            reply.delete()
                                        }, 2000)
                                    })
                                })
                        })
                    }
                    if (r.emoji.name === emojis[6]) {
                        message.channel.send(lang.giveaway.create.question.prize).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(cld => {
                                    const msg = cld.first()
                                    giveawaysOptions.prize = msg.content;
                                    updateEmbed()
                                    return message.channel.send(lang.giveaway.create.successMessage.prize(msg.content)).then((reply) => {
                                        setTimeout(() => {
                                            mp.delete()
                                            msg.delete()
                                            reply.delete()
                                        }, 2000)
                                    })
                                })
                        })
                    }
                    // success
                    if (r.emoji.name === emojis[emojis.length - 1]) {
                        giveawaysOptions.messages = lang.giveaway.messages
                        client.giveawaysManager.start(giveawaysOptions.channel, giveawaysOptions)

                    }
                })
            })

            function updateEmbed() {
                msg.edit(lang.giveaway.create.embed(giveawaysOptions.time, giveawaysOptions.channel, giveawaysOptions.winnerCount, giveawaysOptions.voice, giveawaysOptions.boost, isNaN(giveawaysOptions.reaction) ? giveawaysOptions.reaction : `<${!giveawaysOptions.emoji.animated ? '' : 'a'}:${giveawaysOptions.emoji.name}:${giveawaysOptions.reaction}>`, giveawaysOptions.prize, color))
            }

        }
        oldGiveawayOptions.set(message.guild.id, giveawaysOptions);
    }
}
