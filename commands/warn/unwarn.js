const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'unwarn',
            description: "Remove warns of a member | Enlève les warns d'un membre",
            category: 'warn',
            usage: 'unwarn <mention/id> [numeroWarn]',
            clientPermissions : ['EMBED_LINKS', 'SEND_MESSAGES'],
            userPermissions: ['BAN_MEMBERS'],
            cooldown: 4
        });
    }
    async run(client, message,args){
          const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;
        const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.channel.send(lang.warn.noMember)
        let memberWarns = member.warns;
        if(memberWarns.length < 1)  return message.channel.send(lang.warn.nothingToClear)
        const warnToRemove = args[1];
        if(isNaN(warnToRemove) && args[1]) return message.channel.send(lang.warn.notNumber)
        if(!warnToRemove){
            member.deleteWarn()
            return message.channel.send(lang.warn.successClear(member.user.tag || member.user.username))
        }
        if(parseInt(warnToRemove) > memberWarns.length) return message.channel.send(lang.warn.amountHigherThanWarnTotal)
        const warnToDelete = memberWarns[parseInt(memberWarns)];
        memberWarns = memberWarns.filter(warn => warn !== warnToDelete);
        member.updateWarn = memberWarns;
        message.channel.send(lang.warn.successDelete(member.user.tag || member.user.username, warnToRemove))


    }
}