const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'rminvite',
            description: 'Add some invites to a member | Ajouter des invites a un membre',
            category: 'invite',
            aliases: ['removeinvite', 'removeinv',  'rminv'],
            usage: 'addinvite <mention/ping> <amount>',
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 3
        });
    }
    async run(client, message,args){
        const lang = client.lang(message.guild.lang);
        const member = message.mentions.members.first() || await message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0])

        if(!member) return message.channel.send(lang.addinvite.noMember)
        const numberToAdd = args[1];
        if(!numberToAdd) return message.channel.send(lang.addinvite.noNumber)
        let count = member.invite;
        count.join -= parseInt(numberToAdd);
        member.updateInvite = count;
        message.channel.send(lang.rminvite.success(numberToAdd, member.user.tag || member.user.username))


    }
}