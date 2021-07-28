const {Collection} = require("discord.js");
module.exports = {
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),

    updateOrCreate(model, where, newItem) {
        return new Promise((resolve, reject) => {
            model.findOne({where}).then(foundItem => {
                if (!foundItem)
                    model.create(newItem).then(item => resolve({item, created: true})).catch(e => reject(e))
                else
                    model.update(newItem, {where}).then(item => resolve({item, created: false})).catch(e => reject(e))
            }).catch(e => reject(e))
        })
    },
    async loadTable(manager, data = {}) {
        await this.sleep(500);
        manager.OneForAll.database.models[data.model].sync()
        for await (const element of (await manager.OneForAll.database.models[data.model].findAll()))
            manager[data.add](data.key.map(k => k.startsWith("{") && k.endsWith("}") ? element[k.slice(1, -1)] : k).join(''), element.get());
        console.log(`Successfully loaded ${manager.size} ${data.model.charAt(0).toUpperCase()}${data.model.slice(1)}`)
        return manager;
    },

    checkIfPermHasCmd(commandName, permsCommand) {
        const result = {permToHave: 0, permHasCommand: false}
        for (let i = 1; i <= 4; i++) {
            for (const commands of permsCommand[`perm${i}`]) {
                if (commands.includes(commandName)) {
                    result.permToHave = i
                    result.permHasCommand = true
                }
            }
        }

        return result;
    },
    dateToEpoch(date) {
        return parseInt(date.getTime() / 1000);
    },
    numberToEmoji(number) {
        if (!number) return number

        if (typeof number !== 'string') {
            number = number.toString();
        }

        if (number === '10') {
            return '🔟';
        }

        return number
            .replace(/0/g, '0️⃣')
            .replace(/1/g, '1️⃣')
            .replace(/2/g, '2️⃣')
            .replace(/3/g, '3️⃣')
            .replace(/4/g, '4️⃣')
            .replace(/5/g, '5️⃣')
            .replace(/6/g, '6️⃣')
            .replace(/7/g, '7️⃣')
            .replace(/8/g, '8️⃣')
            .replace(/9/g, '9️⃣');
    },
    emojiToNumber(emoji) {
        if (!emoji) return emoji

        if (typeof emoji !== 'string') {
            emoji = emoji.toString();
        }

        if (emoji === '10') {
            return '🔟';
        }

        return emoji
            .replace(/🔟/g, '10')
            .replace(/0️⃣/g, '0')
            .replace(/1️⃣/g, '1')
            .replace(/2️⃣/g, '2')
            .replace(/3️⃣/g, '3')
            .replace(/4️⃣/g, '4')
            .replace(/5️⃣/g, '5')
            .replace(/6️⃣/g, '6')
            .replace(/7️⃣/g, '7')
            .replace(/8️⃣/g, '8')
            .replace(/9️⃣/g, '9');
    },

// if problem with shards
// async loadTable(manager, data = {}) {
//     await this.sleep(500);
//     for await (const element of (await manager.OneForAll.database.models[data.model].findAll())){
//         if(manager.OneForAll.guilds.cache.has(element.get('guildId')) && data.model !== 'blacklist'){
//             manager[data.add](data.key.map(k => k.startsWith("{") && k.endsWith("}") ? element[k.slice(1, -1)] : k).join(''), element.get());
//         }else if(data.model === 'blacklist') manager[data.add](data.key.map(k => k.startsWith("{") && k.endsWith("}") ? element[k.slice(1, -1)] : k).join(''), element.get());
//     }
//
//     console.log(`Successfully loaded ${manager.size} ${data.model.charAt(0).toUpperCase()}${data.model.slice(1)}`)
//
//
//     return manager;
// },
    copyObject(object) {
        return JSON.parse(JSON.stringify(object));
    }
    ,
    roleHasSensiblePermissions(permissions) {
        return permissions.has(268566590, true);
    }
    ,

    checkDeletedGuildsDuringOffline(manager) {
        manager.guildManager.filter(g => !manager.OneForAll.guilds.cache.has(g.where.guildId)).forEach(g => {
            g.deleteGuild()
            manager.OneForAll.Logger.info(`${g.where.guildId} was leave during offline`)

        });
    }
    ,
    checkCreatedGuildDuringOffline(manager) {
        manager.OneForAll.guilds.cache.filter(guild => !manager.has(guild.id)).forEach(g => {
            manager.OneForAll.Logger.info(`${g.name} ${g.id} was added during offline`)
            manager.getAndCreateIfNotExists(g.id).save()
        })

    },
    async createBackupEmbed(guild) {
        const channels = guild.channels.cache.filter(channel => channel.type === 'text');
        const embeds = [] // {channelId: 'id', embeds: ['']}
        for (const [id, channel] of channels) {
            const messages = await channel.messages.fetch({limit: 5});
            const embedMessages = messages.filter(msg => msg.embeds.length > 0)
            let tempEmbed = [];
            if (embedMessages.size > 0) {
                embedMessages.forEach(msg => {
                    tempEmbed.push(msg.embeds)
                })
                embeds.push({channelName: channel.name, channelId: channel.id, embeds: tempEmbed})

            }
        }
        return embeds
    },
    async loadBackupEmbed(guild, {backupData}) {
        for await(const channelBackup of backupData) {
            const channel = guild.channels.cache.get(channelBackup.channelId) || guild.channels.cache.find(channel => channel.name === channelBackup.channelName);
            if (channel) {
                for (const embed of channelBackup.embeds[0]) {
                    channel.send({
                        embed
                    });
                }
            }
        }
    },

    async createBackupRole(guild, memberRole) {
        const fetchedMember = await guild.members.fetch();
        const membersWithMoreThanMemberRole = fetchedMember.filter(member => member.roles.cache.size > 0 && member.roles.cache.has(memberRole) && !member.user.bot && member.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0)
        const members = [] // {channelId: 'id', embeds: ['']}
        for (const [id, member] of membersWithMoreThanMemberRole) {
            const tempRoles = [];
            if(!member.user.bot){
                for (const [id, role] of member.roles.cache) {
                    if (!role.managed && role.id !== guild.roles.everyone.id && role.id !== memberRole && !role.permissions.has('ADMINISTRATOR')) {
                        tempRoles.push({name: role.name, id: role.id})
                    }
                }
                if (tempRoles.length > 0) {
                    members.push({tag: member.user.tag, id: member.id, roles: tempRoles})
                }
            }
        }
        return members
    },
    async loadBackupRole(guild, {backupData}) {
        for (const memberBackup of backupData) {
            const member = await guild.members.fetch(memberBackup.id);

            if (member) {

                let count = 0;
                while (count < memberBackup.roles.length) {
                    const roleBackup = memberBackup.roles[count];
                    const role = guild.roles.cache.get(roleBackup.id) || guild.roles.cache.find(role => role.name === roleBackup.name);
                    if (!member.roles.cache.has(role.id)) {
                        await member.roles.add(role, `Backup roles load`).catch(() => {
                        });
                    }
                    count++
                    await this.sleep(memberBackup.roles.length * 1200)

                }

            }

        }
        return true
    },
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

}