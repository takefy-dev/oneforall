module.exports = {

    name: 'helpall',
    description: 'Affiche toutes les commandes',
    usage: 'helpall',
    category: 'everyone',
    cooldown: 5,


    run: async (client, message, args) => {


        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const color = guildData.get('color')
        const embed = {
            title: `All commands (${client.commands.size})`,
            timestamp: new Date(),
            color: color,
            footer: {
                text: `Page 1/1`,
                icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
            },

        }
        let maxPerPage = 10
        let page = 0
        let slicerIndicatorMin = 0,
            slicerIndicatorMax = 10

        const emojis = ['◀', '❌', '▶']
        let totalPage = Math.ceil(client.commands.size / maxPerPage)
        const embedPageChanger = (page) => {
            embed.description = client.commands.map((cmd) => `\`${cmd.name}\``).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
            embed.footer.text = `Page ${page + 1} / ${totalPage}`
            return embed
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
                slicerIndicatorMax = maxPerPage
            }

            msg.edit({
                embeds:
                    [embedPageChanger(page)]

            })
        })
        collector.on('end', async () => {
            await msg.reactions.removeAll()
        })
    }
}
