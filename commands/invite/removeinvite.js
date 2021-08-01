const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'rminvite',
            description: 'Add some invites to a member | Ajouter des invites a un membre',
            category: 'invite',
            aliases: ['removeinvite', 'removeinv', 'rminv', 'removeinvites'],
            usage: 'removeinvite <mention/ping> <amount>',
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 3
        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const member = message.mentions.members.first() || await message.guild.members.resolve(args[0]);

        if(!member) return message.channel.send(lang.addinvite.noMember)
        const numberToAdd = args[1];
        if(!numberToAdd) return message.channel.send(lang.addinvite.noNumber)
        let userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${member.user.id}`)
        const count = userData.get('invite');
        count.join -= parseInt(numberToAdd);
        userData.set('invite', count).save()
        message.channel.send(lang.rminvite.success(numberToAdd, member.user.tag || member.user.username))


    }
}
