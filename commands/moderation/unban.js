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
        // if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("<:720681441670725645:780539422479351809> \`ERREUR\` Vous n'avez pas la permission requise \`BAN_MEMBERS\`")
        const color = message.guild.color
        if (args[0] === 'all') {
            const bans = await message.guild.fetchBans();
            if (bans.size < 1) return message.channel.send(lang.unban.noUnBanAll).then(mp => mp.delete({timeout: 4000}))
            bans.forEach(ban => {
                message.guild.members.unban(ban.user.id, `Unban all par ${message.author.username}`)
            })


        } else {
            const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(async err => {
                return await message.channel.send(lang.unban.noMember).then(mp => mp.delete({timeout: 4000}));
            })
            if (user.id === message.author.id) {
                return await message.channel.send(lang.unban.unbanSelf).then(mp => mp.delete({timeout: 4000}));
            }
            const banned = await message.guild.fetchBans();
            if (!banned.has(user.id)) {
                return message.channel.send(lang.unban.notBan(user)).then(mp => mp.delete({timeout: 4000}))
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
