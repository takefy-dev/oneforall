const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
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
    async run(client, message,args){
    
    const lang = client.lang(message.guild.lang)
    const color = message.guild.color
    let isSetup = message.guild.setup;
    if(!isSetup) return message.channel.send(lang.error.noSetup);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(lang.unmute.noMember)
    const muteRole = message.guild.roles.cache.get(message.guild.config.muteRoleId);
    if(!muteRole) return message.channel.send(lang.unmute.errorCantFindRole);
    if(!member.roles.cache.has(muteRole.id)) return message.channel.send(lang.unmute.errorAlreadyUnMute(member));
    member.roles.remove(muteRole).then(() =>{
        message.channel.send(lang.unmute.success(member));
        message.guild.updateMute(member.id)

    })
}}

