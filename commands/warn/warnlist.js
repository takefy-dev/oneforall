const Command = require('../../structures/Handler/Command');
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'warnlist',
            description: "Show the server warns or of a specif member | Affiche les warns du serveur ou d'un membre en particulier",
            category: 'warn',
            usage: 'warnlist [member/id]',
            aliases: ['warn-list', 'serverwarn'],
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['BAN_MEMBERS'],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        let warnedMember
        if (args[0]) {
            warnedMember = await message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {
            });

        }

        const lang = guildData.lang;
        if (warnedMember) {
            const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${warnedMember.id}`)
            const warnsMember = userData.get('warns');
            const embed = new Discord.MessageEmbed()
                .setTitle(`Warns de ${warnedMember.user.username} (${warnsMember.length})`)
                .setDescription(warnsMember.map((warn, i) => `${i + 1} - Raison : ${warn}`).join('\n'))
                .setTimestamp()
                .setColor(color)
                .setFooter(client.user.username, !warnsMember.user ? client.user.displayAvatarURL({dynamic: true}) : warnedMember.user.displayAvatarURL({dynamic: true}))
            if (warnsMember.length < 1) embed.setDescription(lang.warn.noWarn)
            await message.channel.send({embeds: [embed]})
        } else {
            const allUsers = client.managers.userManager.filter(user => user.get('guildId') === message.guild.id && user.get('warns').length > 0);
            const allWarns = [];
            allUsers.forEach(user => allWarns.push({userId: user.get('userId'), reason: user.get('warns')}));
            if (!allWarns) return message.channel.send(lang.warn.noGuildWarn)
            const warnsEmbed = {
                title: `List of warns (${allWarns.length})`,
                timestamp: new Date(),
                color: '#36393F',
                footer: {
                    text: `Page 1/1`,
                    icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                },

            }
            let maxPerPage = 10
            if (allWarns.length > maxPerPage) {
                let page = 0
                let slicerIndicatorMin = 0,
                    slicerIndicatorMax = 10

                const emojis = ['◀', '❌', '▶']
                let totalPage = Math.ceil(allWarns.length / maxPerPage)
                const embedPageChanger = (page) => {
                    warnsEmbed.description = allWarns.map((warn, i) => `${i + 1} ・ <@${warn.userId}> - Raison : ${warn.reason.join(', ')}`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                    warnsEmbed.footer.text = `Page ${page + 1} / ${totalPage}`
                    return warnsEmbed
                }
                const msg = await message.channel.send(lang.loading)
                for (const em of emojis) await msg.react(em)
                msg.edit({
                    content: null,
                    embeds: [embedPageChanger(page)]
                })

                const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;
                const collector = msg.createReactionCollector({filter, time: 900000})
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === emojis[0]) {
                        page = page === 0 ? page = totalPage - 1 : page <= totalPage - 1 ? page -= 1 : page += 1
                        slicerIndicatorMin -= maxPerPage
                        slicerIndicatorMax -= maxPerPage


                    }
                    if (r.emoji.name === emojis[2]) {
                        page = page !== totalPage - 1 ? page += 1 : page = 0
                        slicerIndicatorMin += maxPerPage
                        slicerIndicatorMax += maxPerPage

                    }
                    if (r.emoji.name === emojis[1]) {
                        collector.stop()
                    }
                    if (slicerIndicatorMax < 0 || slicerIndicatorMin < 0) {
                        slicerIndicatorMin += maxPerPage * totalPage
                        slicerIndicatorMax += maxPerPage * totalPage
                    } else if ((slicerIndicatorMax >= maxPerPage * totalPage || slicerIndicatorMin >= maxPerPage * totalPage) && page === 0) {
                        slicerIndicatorMin = 0
                        slicerIndicatorMax = 10
                    }

                    msg.edit({
                        embeds:
                            [embedPageChanger(page)]

                    })
                })
                collector.on('end', async () => {
                    await msg.reactions.removeAll()
                })

            } else {
                warnsEmbed.description = allWarns.map((warn, i) => `${i + 1} ・ <@${warn.userId}> - Raison : ${warn.reason.join(', ')}`).join('\n')
                return message.channel.send({
                    embeds:
                    [warnsEmbed]

                })
            }


        }


    }
}