const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'kick',
            description: 'Kick a member | Kick un membre',
            usage: 'kick <mention/id>',
            category: 'moderation',
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (member === message.member) return message.channel.send()
        if (!member) return message.channel.send(lang.kick.noKick)
        if (member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) return message.channel.send(lang.errorRl(member.user.tag))

        let reason = args[1];
        if (!reason) reason = lang.kick.noReason;


        member.kick().then(() => {
            message.channel.send(lang.kick.success(member));
        }).catch(() => {
            message.channel.send(lang.kick.error(member));
        })

    }
}
