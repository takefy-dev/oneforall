const {MessageEmbed} = require("discord.js");
const {SnowflakeUtil} = require('discord.js')
const DateFormat = require('fast-date-format');

module.exports = {

            name: 'backup-roles',
            description: 'Manage roles members backups | Gérer les backup de roles a vos membres',
            category: 'backup',
            usage: 'backup-roles <create/load/info/delete>',
            aliases: ['roles-backup', 'backup-role'],
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 4,


    run: async (client, message, args) => {
        const userBackup = client.managers.backupManager.getAndCreateIfNotExists(message.author.id)
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        if(!guildData.get('setup')) return message.channel.send(lang.error.noSetup)
        const memberRole = guildData.get('memberRole')
        const backups = userBackup.get('backupRoles');
        const color = guildData.get('color')
        const backupId = args[1];
        const dateFormat = new DateFormat('DD-MM-YYYY');
        if (args[0] === "create") {
            const msg = await message.channel.send(lang.loading);

            const backupData = await client.functions.createBackupRole(message.guild, memberRole);
            if(backupData.length < 1) return msg.edit(`No roles members to save`)
            const backupId = SnowflakeUtil.generate(new Date());
            const backup = {
                createdTimestamp: Date.now(),
                guildName : message.guild.name,
                backupId,
                backupData
            };
            backups.push(backup);
            if(!client.botperso){
                await client.cluster.broadcastEval(`this.managers.backupManager.getAndCreateIfNotExists('${message.author.id}').set('backupRoles', ${JSON.stringify(backups)}).save()`).then((res) => {
                    msg.edit(lang.backup.successCreate(backupId))
                })
            }else{
                userBackup.set('backupRoles', backups).save().then(() => {
                    msg.edit(lang.backup.successCreate(backupId))
                })
            }

            if (!client.isOwner(message.author.id)) return
            if (client.cooldown.has(`backupCreate-${message.author.id}`)) {
                const time = client.cooldown.get(`backupCreate-${message.author.id}`)
                return message.channel.send(lang.error.cooldown(time))
            } else {
                client.cooldown.set(`backupCreate-${message.author.id}`, 1000 * 30)
                setTimeout(() => {
                    client.cooldown.delete(`$backupCreate-${message.author.id}`)
                }, 30 * 1000)
            }
        }
        if (args[0] === "load") {
            if (!guildData.isGuildOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
            if (!backupId) return message.channel.send(lang.backup.noLoadId)
            const backupToLoad = backups.find(backup => backup.backupId === backupId);
            if (!backupToLoad) return message.channel.send(lang.backup.backupNoFound)
            if (userBackup.get('userId') !== message.author.id) return message.channel.send(lang.backup.notBackupOwner)
            await client.functions.loadBackupRole(message.guild, backupToLoad);
            await message.channel.send(lang.backup.successLoad(message.guild.name))
        }
        if (args[0] === "info") {
            if (!backupId) return message.channel.send(lang.backup.noLoadId)
            const backupToLoad = backups.find(backup => backup.backupId === backupId);
            if (!backupToLoad) return message.channel.send(lang.backup.backupNoFound)
            if (userBackup.get('userId') !== message.author.id) return message.channel.send(lang.backup.notBackupOwner);
            const embed = new MessageEmbed()
                .setTitle(`Embed backup information of ${backupId} `)
                .setDescription(`Guild - **${backupToLoad.guildName}**\n<:color:783422848630521857>Nombres de membres avec roles - **${backupToLoad.backupData.length}**\n<:away2:801064579358392320> Backup crée le - **${dateFormat.format(new Date(backupToLoad.createdTimestamp))}**`)
                .setColor(color)
                .setTimestamp()
                .setFooter(client.user.username)
            message.channel.send({embeds: [embed]});
        }
        if(args[0] === "delete"){
            if (!backupId) return message.channel.send(lang.backup.noLoadId)
            const backupToDelete = backups.find(backup => backup.backupId === backupId);
            if (!backupToDelete) return message.channel.send(lang.backup.backupNoFound)
            if (userBackup.get('userId') !== message.author.id) return message.channel.send(lang.backup.notBackupOwner);
            userBackup.set('backupEmbed', backups.filter(backup => backup.backupId !== backupId)).save().then(() => {
                message.channel.send(lang.backup.successDelete(backupId))
            });
        }
        if(args[0] === "list"){
            const backupsName = [];
            const backupsId = [];
            for (const backup of backups) {
                backupsName.push(backup.guildName + '  **:**');
                backupsId.push(backup.backupId);
            }
            if (backupsName.length === 0 && backupsId.length === 0) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` **${message.author.tag || message.author.username}**, vous ne posséder pas de backup`)
            const embed = new MessageEmbed()
                .setTitle(`Liste des backup roles de __${message.author.username}__:`)
                .addField(`<:title:783422216095793172> Serveur Name`, `${backupsName.join('\n')}`, true)
                .addField(`<:desc2:783422775821729792> Backup Id`, `${backupsId.join('\n')}`, true)
                .setColor(`${color}`)
                .setTimestamp()
                .setFooter(client.user.username)
            message.channel.send({embeds: [embed]})
        }
    }
}