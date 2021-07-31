const Command = require('../../structures/Handler/Command');
const Discord = require("discord.js");

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'blacklist-role',
            description: 'Blacklist a role from being added | Blacklist un role qui ne peuvent pas être ajouté',
            category: 'blacklist',
            usage: 'blacklist-role <add/remove/list> <mention/id>',
            aliases: ['blrole', 'bl-role'],
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly: true,
            cooldown: 4
        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        let {enable, blacklistedRoles} = guildData.get('blacklistRole')
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
            if (enable) return await message.channel.send(lang.blacklist.errorAlreadyOn)
            guildData.set('blacklistRole', {blacklistedRoles, enable: true}).save()
            return message.channel.send(lang.blacklist.successEnable)
        }
        if (off) {
            if (!enable) return await message.channel.send(lang.blacklist.errorAlreadyOff)
            guildData.set('blacklistRole', {blacklistedRoles, enable: false}).save()
            return message.channel.send(lang.blacklist.successDisable)

        }
        if (add) {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.channel.send(lang.blacklistRole.noRole)
            if (blacklistedRoles.includes(role.id)) return message.channel.send(lang.blacklistRole.alreadyBl(role.name))
            while (blacklistedRoles[0] === '') {
                await blacklistedRoles.shift()
            }
            blacklistedRoles.push(role.id);
            guildData.set('blacklistRole', {enable, blacklistedRoles}).save().then(() => {
                message.channel.send(lang.blacklistRole.successBl(role.name)).then(async () => {
                    const members = await message.guild.members.fetch();
                    const memberToRemoveRole = members.filter(member => member.roles.cache.has(role.id))
                    if(memberToRemoveRole.size > 0){
                        for await (const [_, member] of memberToRemoveRole) {
                            await member.roles.remove(role.id);
                            await client.functions.sleep(1000 * 12)
                        }

                    }
                    await message.channel.send(lang.blacklistRole.successRemovedRole(memberToRemoveRole.size))

                })
            })
        } else if (remove) {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!role) return message.channel.send(lang.blacklistRole.noRole)
            if (!blacklistedRoles.includes(role.id)) return message.channel.send(lang.blacklistRole.notBl(role.name))
            blacklistedRoles = blacklistedRoles.filter(x => x !== role.id)

            guildData.set('blacklisted', {blacklistedRoles, enable}).save().then(() => {
                message.channel.send(lang.blacklistedRoles.successRemove(role.name))
            })
        } else if (list) {
        
            const tempdataEmbed = {
                title: `List of blacklisted roles (${blacklistedRoles.length})`,
                timestamp: new Date(),
                color: '#36393F',
                footer: {
                    text: `Page 1/1`,
                    icon_url: message.author.displayAvatarURL({dynamic: true}) || ''
                },

            }
            let maxPerPage = 10

            if (blacklistedRoles.length > maxPerPage) {
                let page = 0
                let slicerIndicatorMin = 0,
                    slicerIndicatorMax = 10

                const emojis = ['◀', '❌', '▶']
                let totalPage = Math.ceil(blacklistedRoles.length / maxPerPage)
                const embedPageChanger = (page) => {

                    tempdataEmbed.description = blacklistedRoles.map((id, i) => `${i + 1} ・ **<@&${id}>**`).slice(slicerIndicatorMin, slicerIndicatorMax).join('\n')
                    tempdataEmbed.footer.text = `Page ${page + 1} / ${totalPage}`
                    return tempdataEmbed
                }
                const msg = await message.channel.send(lang.loading)
                for (const em of emojis) await msg.react(em)
                msg.edit({
                    content: '',
                    embed: embedPageChanger(page)
                })

                const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;
                const collector = msg.createReactionCollector(filter, {time: 900000})
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
                        embed:
                            embedPageChanger(page)

                    })
                })
                collector.on('end', async () => {
                    await msg.reactions.removeAll()
                })

            } else {
                tempdataEmbed.description = blacklistedRoles.map((id, i) => `${i + 1} ・ **<@&${id}>**`).join('\n')

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
                .setColor(color)
            const msg = await message.channel.send(embed)
            await msg.react('✅')
            await msg.react('❌')

            const filter = (reaction, user) => ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id
            const collector = msg.createReactionCollector(filter, {time: 30000});
            collector.on('collect', async (r, user) => {

                if (r.emoji.name === '✅') {
                    try {
                        guildData.set('blacklisted', {enable: false, blacklistedRoles: []}).save()
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