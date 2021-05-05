const Discord = require('discord.js')
const guildEmbedColor = new Map();
const backup = require('discord-backup')
const DateFormat = require('fast-date-format');
let loadTimeout = new Map();
let doNotBackup = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'backup',
            description: 'Create a backup of the server | Creer un backup du serveur',
            usage: 'backup <create / list / delete>',
            category: 'owners',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ADMINISTRATOR"],
        });
    }

    async run(client, message, args) {

        let configEmbed;
        let msg;
        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const create = args[0] === "create";
        const list = args[0] === 'list';
        const load = args[0] === 'load';
        const show = args[0] === 'info';
        const del = args[0] === 'delete'
        if (!args[0]) {
            const helpEmbed = new Discord.MessageEmbed()
                .setAuthor(`Informations Backup`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
                .setColor(`${color}`)
                .setTimestamp()
                .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
                .setFooter("Informations Backup", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
                .addField('<:server:783422366230380565> Backup:', `[\`backup create\`](https://discord.gg/WHPSxcQkVk) ・ Permet de créer une backup du serveur actuel\n[\`backup delete\`](https://discord.gg/WHPSxcQkVk) ・ Permet de supprimer une backup\n[\`backup info\`](https://discord.gg/WHPSxcQkVk) ・ Permet d'afficher des informations sur la backup\n[\`backup list\`](https://discord.gg/WHPSxcQkVk) ・ Permet d'afficher la liste des toutes les backup`)
            message.channel.send(helpEmbed)
        }
        if (create) {
        
            const Discord = require('discord.js')
            const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            msg = await message.channel.send(lang.loading)
            await msg.react('1️⃣')
            await msg.react('2️⃣')
            await msg.react('3️⃣')
            await msg.react('4️⃣')
            await msg.react('❌')
            await msg.react('✅')
            let ignoreCh = false;
            let ignoreRl = false;
            let ignoreEmo = false;
            let ignoreBans = false;
            configEmbed = new Discord.MessageEmbed()
                .setTitle(lang.backup.configEmbedT)
                .setDescription(lang.backup.configEmbedDesc(ignoreCh, ignoreRl, ignoreEmo, ignoreBans))
                .setColor(`${color}`)
                .setTimestamp()
                .setFooter(client.user.username);

            msg.edit(" ", configEmbed).then(async m => {
                const collector = m.createReactionCollector(filter, {time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === '1️⃣') {
                        if (doNotBackup.has(message.author.id) && doNotBackup.get(message.author.id).includes("channels")) {
                            let ch = doNotBackup.get(message.author.id)
                            ch = ch.filter(x => x !== "channels")
                            doNotBackup.set(message.author.id, ch)
                            ignoreCh = false;

                        } else if (doNotBackup.has(message.author.id) && !doNotBackup.get(message.author.id).includes("channels")) {
                            let bn = doNotBackup.get(message.author.id)

                            bn.push('channels')
                            doNotBackup.set(message.author.id, bn)
                            ignoreCh = true;

                        } else {
                            doNotBackup.set(message.author.id, ["channels"])
                            ignoreCh = true;
                        }
                        updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans)

                    } else if (r.emoji.name === '2️⃣') {
                        if (doNotBackup.has(message.author.id) && doNotBackup.get(message.author.id).includes("roles")) {
                            let rl = doNotBackup.get(message.author.id)
                            rl = rl.filter(x => x !== "roles")
                            doNotBackup.set(message.author.id, rl)
                            ignoreRl = false;


                        } else if (doNotBackup.has(message.author.id) && !doNotBackup.get(message.author.id).includes("roles")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn.push('roles')
                            doNotBackup.set(message.author.id, bn)
                            ignoreRl = true;

                        } else {
                            doNotBackup.set(message.author.id, ["roles"])
                            ignoreRl = true;
                        }
                        updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans)
                    } else if (r.emoji.name === '3️⃣') {

                        if (doNotBackup.has(message.author.id) && doNotBackup.get(message.author.id).includes("emojis")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn = bn.filter(x => x !== "emojis")
                            doNotBackup.set(message.author.id, bn)
                            ignoreEmo = false;


                        } else if (doNotBackup.has(message.author.id) && !doNotBackup.get(message.author.id).includes("emojis")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn.push('emojis')
                            doNotBackup.set(message.author.id, bn)
                            ignoreEmo = true;

                        } else {
                            doNotBackup.set(message.author.id, ["emojis"])
                            ignoreEmo = true;
                        }
                        updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans)

                    } else if (r.emoji.name === '4️⃣') {
                        if (doNotBackup.has(message.author.id) && doNotBackup.get(message.author.id).includes("bans")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn = bn.filter(x => x !== "bans")
                            doNotBackup.set(message.author.id, bn)
                            ignoreBans = false;

                        } else if (doNotBackup.has(message.author.id) && !doNotBackup.get(message.author.id).includes("bans")) {
                            let bn = doNotBackup.get(message.author.id)
                            bn.push('bans')
                            doNotBackup.set(message.author.id, bn)
                            ignoreBans = true;

                        } else {
                            doNotBackup.set(message.author.id, ["bans"])
                            ignoreBans = true;
                        }
                        updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans)

                    } else if (r.emoji.name === `❌`) {
                        await collector.stop();
                        await msg.delete();
                        doNotBackup.delete(message.author.id)
                        return message.channel.send(lang.backup.cancel)
                    } else if (r.emoji.name === '✅') {
                        const doing = await message.channel.send(lang.loading)
                        const guildName = new Map();
                        if (message.guild.name.includes(`'`)) {
                            guildName.set(message.guild.id, message.guild.name)
                            const newg = message.guild.name.replace(`'`, ' ')
                            message.guild.edit({
                                name: newg,
                            }, "Backup create")
                        }
                        backup.create(message.guild, {
                            maxMessagesPerChannel: 0,
                            doNotBackup: doNotBackup.get(message.author.id),
                            jsonSave: false // so the backup won't be saved to a json file
                        }).then(async (backupData) => {
                            console.log(backupData)
                            await message.author.createBackup(backupData.id, message.guild.name, backupData).then(() =>{
                                doNotBackup.delete(message.author.id)
                                message.guild.edit({
                                    name: guildName.get(message.guild.id),
                                }, "Backup create").then(() => {
                                    doing.edit(lang.backup.successCreate(backupData.id))
                                    guildName.delete(message.guild.id)
                                })

                            })
                        })
                    }
                })
            })


        }
        if (list) {
                const backups = await client.database.models.backup.findAll({where: { userId: message.author.id }})
                const backupsName = [];
                const backupsId = [];
                for (const backup of backups) {
                    backupsName.push(backup.guildName + '  **:**');
                    backupsId.push(backup.backupId);
                }
                if (backupsName.length === 0 && backupsId.length === 0) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` **${message.author.tag || message.author.username }**, vous ne posséder pas de backup`)
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Liste des backup de __${message.author.username}__:`)
                    .addField(`<:title:783422216095793172> Serveur Name`, `${backupsName.join('\n')}`, true)
                    .addField(`<:desc2:783422775821729792> Backup Id`, `${backupsId.join('\n')}`, true)
                    .setColor(`${color}`)
                    .setTimestamp()
                    .setFooter(client.user.username)
                message.channel.send(embed)
        }
        if (load) {
            if (!message.guild.isGuildOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)

            if (loadTimeout.has(message.author.id)) return message.channel.send(lang.backup.timeout)
            const backupId = args[1];
            if (!backupId) return message.channel.send(lang.backup.noLoadId)
            const backupToLoad = await message.author.getBackup(backupId);
            if (!backupToLoad) return message.channel.send(lang.backup.backupNoFound)

            if (backupToLoad.userId !== message.author.id) return message.channel.send(lang.backup.notBackupOwner)
            loadTimeout.set(message.member.id, 'true')
            backup.load(backupToLoad.guildData, message.guild, {
                clearGuildBeforeRestore: true

            }).then(() => {
                message.member.send(lang.backup.successLoad(message.guild.name))

            })


            setTimeout(() => {
                loadTimeout.delete(message.author.id)
            }, 1.2e+6)

        }
        if (show) {

            const dateFormat = new DateFormat('DD-MM-YYYY');
            const backupId = args[1];
            if (!backupId) return message.channel.send(lang.backup.noLoadId)
            const backup =await message.author.getBackup(backupId);
            if (!backup) return message.channel.send(lang.backup.backupNoFound)
            if (backup.userId !== message.author.id) return message.channel.send(lang.backup.notBackupOwner)

            const {guildData} = backup
            const rolesSize = guildData.roles.length;
            const emojisSize = guildData.emojis.length;
            const bansSize = guildData.bans.length;
            const banner = guildData.bannerURL;
            const ico = guildData.iconURL;
            const categories = guildData.channels.categories;
            let channelsSize = [];
            for (const cat of categories) {
                channelsSize.push(cat.children.length)
            }
            const embed = new Discord.MessageEmbed()
            embed.setTitle(`Information sur la backup ${backupId}`)
            embed.setDescription(`<:color:783422848630521857> Nombres de roles - **${rolesSize}**\n<:778353230484471819:780727288903237663> Nombres d'emojis - **${emojisSize}**\n<:folder:783422648196923452> Nombres de catégories - **${categories.length}**\n<:channels:783422874748584007> Nombres de channels - **${channelsSize.reduce((a, b) => a + b, 0)}**\n<:720681441670725645:780539422479351809> Nombres de bannis - **${bansSize}**\n<:away2:801064579358392320> Backup crée le - **${dateFormat.format(new Date(guildData.createdTimestamp))}**`)
            embed.setColor(`${color}`)
            embed.setTimestamp()
            embed.setFooter(client.user.username)
            if (ico !== undefined) {
                embed.setThumbnail(ico)
            }

            if (banner !== undefined) {
                embed.setImage(banner)

            }
            const chEmo = client.emojis.cache.get('783422874748584007')
            const rlEmo = client.emojis.cache.get('783422848630521857')
            let filters = (reaction, user) => [chEmo.name, rlEmo.name].includes(reaction.emoji.name) && user.id === message.author.id;
            const msg = await message.channel.send(lang.loading)
            const emoji = ['783422848630521857', '783422874748584007']
            for (let emo of emoji) {
                await msg.react(client.emojis.cache.get(emo))
            }
            msg.edit(' ', embed).then(async m => {
                const collector = m.createReactionCollector(filters, {time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === chEmo.name) {
                        const channels = guildData.channels;
                        const childName = []
                        for (let cat of channels.categories) {
                            childName.push(`°${cat.name}`)
                            cat.children.forEach(ch => {
                                childName.push(`     ${ch.name}`)
                            })

                        }

                        embed.setDescription(`<:color:783422848630521857> Nombres de roles - **${rolesSize}**\n<:778353230484471819:780727288903237663> Nombres d'emojis - **${emojisSize}**\n<:folder:783422648196923452> Nombres de catégories - **${categories.length}**\n<:channels:783422874748584007> Nombres de channels - **${channelsSize.reduce((a, b) => a + b, 0)}**\n<:720681441670725645:780539422479351809> Nombres de bannis - **${bansSize}**\n<:away2:801064579358392320> Backup crée le - **${dateFormat.format(new Date(guildData.createdTimestamp))}**
                            \`\`\`${childName.join('\n')}\`\`\`
                            `)


                        msg.edit(' ', embed).catch((err) => {
                            if (err.toString().includes('Invalid Form Body')) {
                                return message.channel.send("Il y a trop de salons à visualiser sur cette backup")
                            }
                        })


                    }
                    if (r.emoji.name === rlEmo.name) {
                        const roles = guildData.roles;
                        const rolesName = []
                        for (let rl of roles) {
                            rolesName.push(rl.name)
                        }
                        embed.setDescription(`<:color:783422848630521857> Nombres de roles - **${rolesSize}**\n<:778353230484471819:780727288903237663> Nombres d'emojis - **${emojisSize}**\n<:folder:783422648196923452> Nombres de catégories - **${categories.length}**\n<:channels:783422874748584007> Nombres de channels - **${channelsSize.reduce((a, b) => a + b, 0)}**\n<:720681441670725645:780539422479351809> Nombres de bannis - **${bansSize}**\n<:away2:801064579358392320> Backup crée le - **${dateFormat.format(new Date(guildData.createdTimestamp))}**
                            \`\`\`${rolesName.join('\n')}\`\`\`
                        `)

                        try {
                            msg.edit(' ', embed)
                        } catch (err) {
                            if (err.toString().includes('Invalid Form Body')) {
                                return message.channel.send("Il y a trop de roles à visualiser sur cette backup")
                            }
                        }

                    }
                })

            }).catch((err) => {
                if (err.toString().includes(`<:720681441670725645:780539422479351809> \`ERROR\`: Unknown column '${backupId}' in 'where clause'`)) return message.channel.send(lang.backup.backupNoFound)
                return message.channel.send(lang.backup.error)
            })


        }

        if (del) {
            const backupId = args[1];
            if (!backupId) return message.channel.send(lang.backup.noLoadId)
            const backupCheck = await message.author.getBackup(backupId)
            if (!backupCheck) return message.channel.send(lang.backup.backupNoFound)
            if (backupCheck.userId !== message.author.id) return message.channel.send(lang.backup.notBackupOwner)

            await message.author.deleteBackup(backupId).then(result => {
                if (result) {
                    return message.channel.send(lang.backup.successDelete(backupId))

                }
            })
        }

        function updateEmbed(ignoreCh, ignoreRl, ignoreEmo, ignoreBans) {
            const dd = new Discord.MessageEmbed()
            dd.setTitle(lang.backup.configEmbedT)
            dd.setDescription(lang.backup.configEmbedDesc(ignoreCh, ignoreRl, ignoreEmo, ignoreBans))
            dd.setColor(`${color}`)
            dd.setTimestamp()
            dd.setFooter(client.user.username);
            msg.edit(dd)
        }
    }
}
