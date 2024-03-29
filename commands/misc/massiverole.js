const ms = require('ms'),
    Discord = require('discord.js')

module.exports = {

    name: 'massrole',
    description: "Add / Remove a role to all members in a server | Permet d'ajouter / enlver un rôle a tout les membres d'un serveur",
    usage: 'massrole < add / remove> <role>',
    category: 'misc',
    aliases: ['roleall', 'allrole'],
    userPermissions: ["MANAGE_ROLES"],
    clientPermissions: ["MANAGE_ROLES"],
    cooldown: 5,
    guildOwnerOnly: true,


    run: async (client, message, args) => {
        const member = new Map()
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const color = guildData.get('color')
        const counts = new Map()
        const done = new Map()
        const timer = new Map()
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (role) {
            if (role.permissions.has("KICK_MEMBERS") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("ADMINISTRATOR") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("MANAGE_GUILD") || role.permissions.has("MANAGE_ROLES")) return message.channel.send(lang.massrole.highPermRole(role.name))
        }
        const add = args[0] === 'add';
        const remove = args[0] === 'remove'
        if (!role) return message.channel.send(lang.massrole.errorNoRl);
        if (add) {
            await message.guild.members.fetch().then((members) => {
                member.set(message.guild.id, members.filter(member => member.roles.highest.comparePositionTo(message.guild.me.roles.highest) <= 0 && !member.roles.cache.has(role.id)))
            })

            if (member.get(message.guild.id).size === 0) return message.channel.send(lang.massrole.errorRlAlready(role))
            let timeLeft = ms(`${member.get(message.guild.id).size}s`)
            const embed = new Discord.MessageEmbed()
                .setTitle(lang.massrole.title(role, member.get(message.guild.id).size))
                .setDescription(lang.massrole.descriptionTimeLeft(timeLeft))
                .setColor(`${color}`)
                .setFooter(client.user.tag)
                .setTimestamp();
            const msg = await message.channel.send({embeds: [embed]})


            counts.set(message.guild.id, 0)
            done.set(message.guild.id, 0)


            member.get(message.guild.id).forEach((members) => {
                const adding = setTimeout(async () => {
                    if (done.has(message.guild.id)) {
                        members.roles.add(role, `Massrole add all par ${message.author.username}`).then(() => {
                            const addD = done.get(message.guild.id) + 1
                            if (member.has(message.guild.id)) {
                                done.set(message.guild.id, addD)

                            }

                        })
                        if (done.get(message.guild.id) === member.get(message.guild.id).size - 1) {

                            message.channel.send(lang.massrole.successAdd(role, member.get(message.guild.id).size))
                            counts.delete(message.guild.id)
                            done.delete(message.guild.id)
                            member.delete(message.guild.id)
                            timer.set(message.guild.id, true)
                            return clearTimeout(adding);
                        }

                    }

                }, counts.get(message.guild.id) * 1200)
                const addC = counts.get(message.guild.id) + 1
                counts.set(message.guild.id, addC)
            })


            setTimeout(async () => {
                timer.delete(message.guild.id)
            }, 1.8e+6)

        } else if (remove) {
            await message.guild.members.fetch().then((members) => {
                member.set(message.guild.id, members.filter(member => member.roles.highest.comparePositionTo(message.guild.me.roles.highest) <= 0 && member.roles.cache.has(role.id)))
            })

            if (member.get(message.guild.id).size === 0) return message.channel.send(lang.massrole.errorRlNot(role))
            let timeLeft = ms(`${member.get(message.guild.id).size}s`)
            const embed = new Discord.MessageEmbed()
                .setTitle(lang.massrole.titleRm(role, member.get(message.guild.id).size))
                .setDescription(lang.massrole.descriptionTimeLeft(timeLeft))
                .setColor(`${color}`)
                .setFooter(client.user.tag)
                .setTimestamp();
            const msg = await message.channel.send({embeds: [embed]})


            counts.set(message.guild.id, 0)
            done.set(message.guild.id, 0)


            member.get(message.guild.id).forEach((members) => {
                const adding = setTimeout(async () => {
                    if (done.has(message.guild.id)) {
                        members.roles.remove(role, `Massrole remove all par ${message.author.username}`).then(() => {
                            const addD = done.get(message.guild.id) + 1
                            if (member.has(message.guild.id)) {
                                done.set(message.guild.id, addD)

                            }

                        })
                        if (done.get(message.guild.id) === member.get(message.guild.id).size - 1) {

                            message.channel.send(lang.massrole.successRemove(role, member.get(message.guild.id).size))
                            counts.delete(message.guild.id)
                            done.delete(message.guild.id)
                            member.delete(message.guild.id)
                            timer.set(message.guild.id, true)
                            return clearTimeout(adding);
                        }

                    }

                }, counts.get(message.guild.id) * 1200)
                const addC = counts.get(message.guild.id) + 1
                counts.set(message.guild.id, addC)
            })


            setTimeout(async () => {
                timer.delete(message.guild.id)
            }, 1.8e+6)


        } else if (args[0] === 'status') {

            if (!done.has(message.guild.id) || !member.has(message.guild.id)) return message.channel.send(lang.nickall.noMassrole)
            let timeLeft = ms(`${member.get(message.guild.id).size - done.get(message.guild.id)}s`)
            const status = new Discord.MessageEmbed()
                .setTitle('Status')
                .setDescription(lang.descriptionTimeLeft(timeLeft))
                .setColor(`${color}`)
                .setFooter(client.user.username)
                .setTimestamp()
            message.channel.send(status)
        }


    }
};

