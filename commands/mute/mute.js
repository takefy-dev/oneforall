
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'mute',
            description: 'Mute a member | Mute un member',
            usage: 'mute <mention/id>',
            category: 'moderation',
            userPermissions: ["MUTE_MEMBERS"],
            clientPermissions: ['MUTE_MEMBERS'],
            cooldown: 5

        });
    }
    async run(client, message,args){

      const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;;

    const color = message.guild.color
    let isSetup = message.guild.setup;
    if (!isSetup) return message.channel.send(lang.error.noSetup);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(lang.mute.errorNoMember)
    const muteRole = message.guild.roles.cache.get(message.guild.config.muteRoleId);
    if (!muteRole) return message.channel.send(lang.mute.errorCantFindRole);
    if (member.roles.cache.has(muteRole.id)) return message.channel.send(lang.mute.errorAlreadyMute(member));
    member.roles.add(muteRole).then(() => {
        const { logs } = lang
        const { modLog } = message.guild.logs;
        const channel = message.guild.channels.cache.get(modLog);
        if(channel && !channel.deleted){
            channel.send(logs.mute(message.member, member.user, 'lifetime', color, "mute"))
        }
        message.channel.send(lang.mute.success(member));
        message.guild.updateMute(member.id, true)
    })
}}
