const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'unban',
            description: 'Unban a user | Unban un user',
            usage: 'unban < mention / id >',
            category: 'moderation',
            tags: ['guildOnly'],
            clientPermissions: ['MANAGE_GUILD'],
            userPermissions: ['BAN_MEMBERS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        if (args[0] === 'all') {
            const bans = await message.guild.bans.fetch();
            if (bans.size < 1) return message.channel.send(lang.unban.noUnBanAll)
            bans.forEach(ban => {
                message.guild.members.unban(ban.user.id, `Unban all par ${message.author.username}`)
            })


        } else {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(async err => {
                return await message.channel.send(lang.unban.noMember)
            })
            if (user.id === message.author.id) {
                return await message.channel.send(lang.unban.unbanSelf)
            }
            const banned = await message.guild.bans.fetch();
            if (!banned.has(user.id)) {
                return message.channel.send(lang.unban.notBan(user))
            }

            let reason = args.slice(1).join(" ");
            if (!reason) {
                reason = `Unban par ${message.author.tag}`
            }
            message.guild.members.unban(user.id, reason).then(() => {
                message.channel.send(lang.unban.success(user))
            })

        }


    }
};
