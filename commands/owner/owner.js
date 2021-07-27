const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'owner',
            description: 'Manage the owner of the server | Gérer les owner du serveur',
            usage: 'owner <add/ remove /list> < mention / id >',
            tags: ['guildOnly'],
            category: 'owners',
            guildCrownOnly: true,
            cooldown: 2
        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const color = guildData.get('color')
        const add = args[0] === "add";
        const remove = args[0] === 'remove';
        const clear = args[0] === 'clear';
        const list = args[0] === 'list';
        if (!add && !remove && !list && !clear) return message.channel.send(lang.owner.errorSyntax)

        let owners = guildData.get('owners');
        while (owners[0] === '') {
            owners.shift()
        }

        if (add) {
            const member = message.mentions.members.first() || await message.guild.members.resolve(args[1]);
            if (!member) return message.channel.send(lang.owner.noMember)
            if (owners.includes(member.id)) return message.channel.send(lang.owner.errorAlreadyOwner(member.user.tag || member.user.username))
            owners.push(member.id);
            guildData.save().then(async () => {
                const msg = await message.channel.send(lang.owner.successOwner(member.user.tag || member.user.username));
                setTimeout(() => {
                    msg.delete()
                }, 2000)

            })

        } else if (remove) {
            const member = message.mentions.members.first() || await message.guild.members.resolve(args[1]);
            if (!member) return message.channel.send(lang.owner.noMember)
            if (!owners.includes(member.id)) return message.channel.send(lang.owner.errorNotOwner(member.user.tag || member.user.username))
            owners = owners.filter(ow => ow !== member.id)
            guildData.set('owners', owners).save().then(async () => {
                const msg = await message.channel.send(lang.owner.successRmOwner(member.user.tag || member.user.username));
                setTimeout(() => {
                    msg.delete()
                }, 2000)

            })

        } else if (list) {
            const ownersEmbed = {
                title: `List of owners (${owners.length})`,
                timestamp: new Date(),
                color: '#36393F',
                footer: {
                    text: `Page 1/1`,
                    icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                },

            }
            let maxPerPage = 10
            if (owners.length > maxPerPage) {
                let page = 0
                let slicerIndicatorMin = 0,
                    slicerIndicatorMax = 10

                const emojis = ['◀', '❌', '▶']
                let totalPage = Math.ceil(owners.length / maxPerPage)
                const embedPageChanger = (page) => {
                    ownersEmbed.description = owners.map((id, i) => `${i + 1} ・ <@${id}>`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                    ownersEmbed.footer.text = `Page ${page + 1} / ${totalPage}`
                    return ownersEmbed
                }
                const msg = await message.channel.send(lang.loading)
                for(const em of emojis) await msg.react(em)
                msg.edit({
                    content: '',
                    embed: embedPageChanger(page)
                })

                const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;
                const collector = msg.createReactionCollector( filter, {time: 900000})
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if(r.emoji.name === emojis[0]){
                        page = page === 0 ? page = totalPage - 1 : page <= totalPage - 1 ? page-=1 : page+=1
                        slicerIndicatorMin -= maxPerPage
                        slicerIndicatorMax -= maxPerPage


                    }
                    if(r.emoji.name === emojis[2]){
                        page = page !== totalPage - 1 ? page+=1 : page = 0
                        slicerIndicatorMin += maxPerPage
                        slicerIndicatorMax += maxPerPage

                    }
                    if(r.emoji.name === emojis[1]){
                        collector.stop()
                    }
                    if(slicerIndicatorMax < 0 || slicerIndicatorMin < 0) {
                        slicerIndicatorMin += maxPerPage * totalPage
                        slicerIndicatorMax += maxPerPage * totalPage
                    }else if((slicerIndicatorMax >= maxPerPage * totalPage || slicerIndicatorMin >= maxPerPage * totalPage) && page === 0){
                        slicerIndicatorMin = 0
                        slicerIndicatorMax = maxPerPage
                    }

                    msg.edit({
                        embed:
                            embedPageChanger(page)

                    })
                })
                collector.on('end', async() => {
                    await msg.reactions.removeAll()
                })

            } else {
                ownersEmbed.description = owners.map((id, i) => `${i + 1} ・ <@${id}>`).join('\n')
                return message.channel.send({
                    embed:
                        ownersEmbed

                })
            }
        } else if (clear) {


            const embed = new Discord.MessageEmbed()
                .setTitle(`Confirmation`)
                .setDescription(lang.owner.clearOwner)
                .setFooter(client.user.username)
                .setTimestamp()
                .setColor(`${color}`)
            const msg = await message.channel.send(embed)
            await msg.react('✅')
            await msg.react('❌')

            const filter = (reaction, user) => ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;

            const collector = msg.createReactionCollector(filter, {time: 30000});
            collector.on('collect', async (r, user) => {
                if (r.emoji.name === '✅') {
                    try {
                        owners = [client.botperso ? '' : message.guild.ownerID]
                        guildData.set('owners', owners).save()
                        msg.delete()
                        return message.channel.send(lang.owner.successClearOwner)

                    } catch (err) {
                        console.error(err)
                        return message.channel.send(lang.owner.error)
                    }
                } else if (r.emoji.name === '❌') {
                    return message.channel.send(lang.owner.cancel)
                }
            })

        }
    }
}
