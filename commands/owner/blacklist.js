const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'blacklist',
            description: 'Manage the blacklist of the server | Gérer la blacklist du serveur',
            // Optionnals :
            usage: 'blacklist <remove / add /list / on /off>',
            category: 'tempdata',
            aliases: ['bl'],
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['BAN_MEMBERS'],
            guildOwnerOnly: true,
        });
    }

    async run(client, message, args) {

        let owner = !client.botperso ? message.guild.ownerID : client.owners[client.owners.length - 1];
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const blacklistData = client.managers.blackListManager.getAndCreateIfNotExists(owner);
        let tempdata = blacklistData.get('blacklisted')
        let isOn = blacklistData.get('enable')
        const color = guildData.get('color')
        const lang = guildData.lang;


        const clear = args[0] === 'clear';
        const add = args[0] === "add";
        const remove = args[0] === 'remove';
        const list = args[0] === 'list';
        const on = args[0] === 'on';
        const off = args[0] === 'off';
        if (!add && !remove && !list && !clear && !on && !off) return message.channel.send(lang.blacklist.errorSyntax)

        if (on) {
            if (isOn.enable) return await message.channel.send(lang.blacklist.errorAlreadyOn)
            blacklistData.set('enable', true).save()
            return message.channel.send(lang.blacklist.successEnable)
        }
        if (off) {
            if (!isOn.enable) return await message.channel.send(lang.blacklist.errorAlreadyOff)
            blacklistData.set('enable', false).save()
            return message.channel.send(lang.blacklist.successDisable)

        }
        if (add) {

            if (!args[1]) return message.channel.send(lang.blacklist.errorCantFindMember)
            let memberUser = message.mentions.users.first() || await client.users.fetch(args[1])
            if (!args[1] && !message.mentions.members.first()) {
                return message.channel.send(lang.blacklist.errorSyntaxAdd)
            }


            if (client.isOwner(memberUser.id)) return message.channel.send(lang.blacklist.errorBotOwner)
            if (memberUser.id === owner) return message.channel.send(lang.blacklist.errorCrown)
            if (memberUser.id === client.user.id) return message.channel.send(lang.blacklist.errorMe)
            if (!memberUser) return message.channel.send(lang.blacklist.errorSyntaxAdd)
            let isTargetOwner = client.isOwner(message.guild.id, memberUser.id)
            if (isTargetOwner && message.author.id !== owner) return message.channel.send(lang.blacklist.errorTryBlOwner(memberUser))
            
            if (tempdata.includes(memberUser.id)) return message.channel.send(lang.blacklist.errorAlreadyBl(memberUser))
            while (tempdata[0] === '') {
                await tempdata  .shift()
            }
            if (!tempdata.includes(memberUser.id)) {
                tempdata.push(memberUser.id);
            }

            blacklistData.set('blacklisted', tempdata).save().then(() => {
                message.channel.send(lang.blacklist.successBl(memberUser)).then(() => {
                    message.guild.members.ban(memberUser.id, {reason: `Blacklist par ${message.author.tag}`,})
                        .then(() => {
                            message.channel.send(lang.blacklist.successBanBl(memberUser)).then(async () => {
                                try {
                                    if (client.botperso) {
                                        await client.guilds.cache.filter(g => g.me.hasPermission('BAN_MEMBERS')).forEach(guild => {
                                            guild.members.ban(memberUser.id, {reason: `Blacklist par ${message.author.tag}`,})

                                        })
                                        await message.channel.send(lang.blacklist.successBanGuild(client.guilds.cache.size))

                                    } else {
                                        const guildCount = await client.shard.broadcastEval(`this.guilds.cache.filter(guild => guild.ownerID === '${owner}' && guild.id !== '${message.guild.id}' && guild.me.hasPermissions('BAN_MEMBERS')).size`).then(async (res) => res.reduce((acc, guildCount) => acc + guildCount), 0)
                                        const reason = `Blacklist par ${message.author.tag}`
                                        await client.shard.broadcastEval(`
                                        (async () => {
                                            let guilds = this.guilds.cache.filter(guild => guild.ownerID === '${owner}' && guild.id !== '${message.guild.id}');
                                            guilds.forEach(guild => {
                                                guild.members.ban('${memberUser.id}', {reason: 'Blacklist'})
                                            })
                                        })();  
                                    `).then(async (res) => {
                                            await message.channel.send(lang.blacklist.successBanGuild(guildCount))
                                        })
                                    }

                                } catch (e) {
                                    console.log(e)
                                }

                            })
                        })
                })


            })
        } else if (remove) {
            if (!args[1]) return message.channel.send(lang.blacklist.errorCantFindMember)
            let memberUser = message.mentions.users.first() || await client.users.fetch(args[1])

            if (!args[1] && !message.mentions.members.first()) {
                return message.channel.send(lang.blacklist.errorSyntaxAdd)
            }


            if (memberUser.id === owner && memberUser === message.guild.ownerID) return message.channel.send(lang.blacklist.errorCrown)
            if (memberUser.id === client.user.id) return message.channel.send(lang.blacklist.errorMe)
            if (!memberUser) return message.channel.send(lang.blacklist.errorSyntaxAdd)
            let isTargetOwner = client.isOwner(message.guild.id, memberUser.id)
            if (isTargetOwner && message.author.id !== owner) return message.channel.send(lang.blacklist.errorTryUnBlOwner(memberUser))
            

            if (!tempdata.includes(memberUser.id)) return message.channel.send(lang.blacklist.errorNotBl(memberUser))

            tempdata = tempdata.filter(x => x !== memberUser.id)

            blacklistData.set('blacklisted', tempdata).save().then(() => {

                message.channel.send(lang.blacklist.successRmBl(memberUser)).then(() => {
                    message.guild.members.unban(memberUser.id, `UnBlacklist par ${message.author.tag}`)
                        .then(() => {
                            message.channel.send(lang.blacklist.successUnBanBl(memberUser)).then(async () => {
                                try {
                                    if (client.botperso) {
                                        await client.guilds.cache.forEach(guild => {
                                            guild.members.unban(memberUser.id, {reason: `UnBlacklist par ${message.author.tag}`,})

                                        })
                                        await message.channel.send(lang.blacklist.successUnBanGuild(client.guilds.cache.size))


                                    } else {
                                        const guildCount = await client.shard.broadcastEval(`this.guilds.cache.filter(guild => guild.ownerID === '${owner}' && guild.id !== '${message.guild.id}').size`).then(async (res) => res.reduce((acc, guildCount) => acc + guildCount), 0)
                                        console.log(guildCount);
                                        const reason = `Blacklist par ${message.author.tag}`
                                        await client.shard.broadcastEval(`
                                        (async () => {
                                            let guilds = this.guilds.cache.filter(guild => guild.ownerID === '${owner}' && guild.id !== '${message.guild.id}');
                                            guilds.forEach(guild => {
                                                guild.members.unban('${memberUser.id}', {reason: 'UnBlacklist'})
                                            })
                                        })();  
                                    `).then(async (res) => {
                                            await message.channel.send(lang.blacklist.successUnBanGuild(guildCount))

                                        })
                                    }

                                } catch (e) {
                                    console.log(e)
                                }

                            })
                        })
                })

            })
        } else if (list) {
            const usersTag = []
            for(const id of tempdata){
                const user = await client.users.fetch(id).catch(() => {})
                usersTag.push(user.tag)
            }
            const tempdataEmbed = {
                title: `List of blacklisted users (${tempdata.length})`,
                timestamp: new Date(),
                color: '#36393F',
                footer: {
                    text: `Page 1/1`,
                    icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                },

            }
            let maxPerPage = 10

            if (tempdata.length > maxPerPage) {
                let page = 0
                let slicerIndicatorMin = 0,
                    slicerIndicatorMax = 10

                const emojis = ['◀', '❌', '▶']
                let totalPage = Math.ceil(tempdata.length / maxPerPage)
                const embedPageChanger = (page) => {

                    tempdataEmbed.description = usersTag.map((id, i) => `${i + 1} ・ **${id}**`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                    tempdataEmbed.footer.text = `Page ${page + 1} / ${totalPage}`
                    return tempdataEmbed
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
                        slicerIndicatorMax = 10
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
                tempdataEmbed.description = usersTag.map((id, i) => `${i + 1} ・ **${id}**`).join('\n')

                return message.channel.send({
                    embed:
                    tempdataEmbed

                })
            }
        } else if (clear) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Confirmation`)
                .setDescription(lang.blacklist.clearBl)
                .setFooter(client.user.username)
                .setTimestamp()
                .setColor(`${color}`)
            const msg = await message.channel.send(embed)
            await msg.react('✅')
            await msg.react('❌')

            const filter = (reaction, user) => ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            const collector = msg.createReactionCollector(filter, {time: 30000});
            collector.on('collect', async (r, user) => {

                if (r.emoji.name === '✅') {
                    try {
                        blacklistData.set('blacklisted', []).save()
                        msg.delete()
                        return message.channel.send(lang.blacklist.successClearBl)

                    } catch (err) {
                        console.error(err)
                        return message.channel.send(lang.blacklist.error)
                    }
                } else if (r.emoji.name === '❌') {
                    return message.channel.send(lang.blacklist.cancel)
                }
            })

        }

    }
}