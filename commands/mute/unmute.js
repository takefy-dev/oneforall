const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'unmute',
            description: 'Unmute a member | Unmute un membre',
            usage: 'unmute <mention/id>',
            category: 'moderation',
            clientPermissions: ['MUTE_MEMBERS'],
            userPermissions: ['MUTE_MEMBERS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const color = guildData.get('color')
        let isSetup = guildData.get('setup');
        if (!isSetup) return message.channel.send(lang.error.noSetup);
        const member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        if (!member) return message.channel.send(lang.unmute.noMember)
        const muteRole = message.guild.roles.cache.get(guildData.get('muteRoleId'));
        if (!muteRole) return message.channel.send(lang.unmute.errorCantFindRole);
        if (!member.roles.cache.has(muteRole.id)) return message.channel.send(lang.unmute.errorAlreadyUnMute(member));
        member.roles.remove(muteRole).then(() => {
            const {logs} = lang
            const {modLog} = guildData.get('logs').mod;
            const channel = message.guild.channels.cache.get(modLog);
            if (channel && !channel.deleted) {
                channel.send(logs.unmute(member.user, "commande", color))
            }
            message.channel.send(lang.unmute.success(member));
            const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`)
            const mute = userData.get('mute');
            mute.muted = false;
            mute.expireAt = null;
            mute.createdAt = null;
            userData.set('mute', mute).save()

        })
    }
}

