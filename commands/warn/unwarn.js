module.exports = {

    name: 'unwarn',
    description: "Remove warns of a member | Enlève les warns d'un membre",
    category: 'warn',
    usage: 'unwarn <mention/id> [numeroWarn]',
    clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
    userPermissions: ['BAN_MEMBERS'],
    cooldown: 4,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;

        const member = await message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {
        });

        if (!args[0]) return message.channel.send(lang.warn.noMember)
        const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${member.id}`)
        let memberWarns = userData.get('warns');
        if (memberWarns.length < 1) return message.channel.send(lang.warn.nothingToClear)
        const warnToRemove = args[1];
        if (isNaN(warnToRemove) && args[1]) return message.channel.send(lang.warn.notNumber)
        if (!warnToRemove) {
            userData.set('warns', []).save()
            return message.channel.send(lang.warn.successClear(member.user.tag || member.user.username))
        }
        if (parseInt(warnToRemove) > memberWarns.length) return message.channel.send(lang.warn.amountHigherThanWarnTotal)
        const warnToDelete = parseInt(warnToRemove) - 1;
        memberWarns = memberWarns.filter((warn, i) => i !== warnToDelete);
        userData.set('warns', memberWarns).save().then(() => {

            message.channel.send(lang.warn.successDelete(member.user.tag || member.user.username, warnToRemove))
        })


    }
}