const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'clearinvite',
            description: "Clear all invite server or a member  | Supprimé toutes les invites du server ou d'un membre",
            category: 'invite',
            usage: 'clearinvite [mention/id]',
            aliases: ['clearinv'],
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly : true,
            cooldown: 7
        });
    }
    async run(client, message,args){
        const lang = client.lang(message.guild.lang)
        if(!message.mentions.members.first() || message.guild.members.cache.get(args[0])){
            await message.guild.clearInvite().then((res) => {
                return message.channel.send(lang.clearInv.success(message.guild.name))
            })
            message.guild.members.cache.forEach(member => {
                member.clearMemberInvite(false)
            })
        }else{
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
            member.clearMemberInvite(true)
            return message.channel.send(lang.clearInv.success(member.user.tag || member.user.username))
        }

    }
}