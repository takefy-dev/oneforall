module.exports = {

    name: 'setup',
    description: 'Setup the role for the bot to work perfectly | Configurer les rôles indispensable pour la fonctionnalitée du bot',
    usage: 'setup',
    category: 'owners',
    guildOwnerOnly: true,
    cooldown: 5,


    run: async (client, message, args) => {


        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;


        message.channel.send(lang.setup.muteQ)
        const responseMuteRole = await message.channel.awaitMessages({
            filter: m => m.author.id === message.author.id,
            max: 1,
            timeout: 30000,
            errors: ['time']
        }).catch(() => {
            message.channel.send("Opération annulée pas de réponse après 30s")
        })
        const CollectedMuteRole = responseMuteRole.first()
        if (CollectedMuteRole.content.toLowerCase() === "cancel") return message.channel.send(lang.cancel)


        message.channel.send(lang.setup.memberRoleQ)
        const responseMembreRole = await message.channel.awaitMessages({
            filter: m => m.author.id === message.author.id,
            max: 1,
            timeout: 30000,
            errors: ['time']
        }).catch(() => {
            message.channel.send("Opération annulée pas de réponse après 30s")
        })
        const CollectedMembreRole = responseMembreRole.first()
        if (CollectedMembreRole.content.toLowerCase() === "cancel") return message.channel.send(lang.cancel)


        let muteRole = CollectedMuteRole.mentions.roles.first() || message.guild.roles.cache.get(CollectedMuteRole.content);
        let muteRoleId = muteRole.id;
        if (!muteRole) return message.channel.send(lang.setup.dontFindMute)

        let memberRole = CollectedMembreRole.mentions.roles.first() || message.guild.roles.cache.get(CollectedMembreRole.content);
        let memberRoleId = memberRole.id
        if (!memberRole) return message.channel.send(lang.setup.dontFindMember)

        try {
            guildData.set('muteRoleId', muteRoleId)
            guildData.set('memberRole', memberRoleId)
            guildData.set('setup', true)
            guildData.save()
            message.channel.send(lang.setup.success(muteRoleId, memberRoleId))

        } catch (err) {
            console.log(err)
            message.channel.send(lang.setup.error(muteRoleId, memberRole))
        }
    }
}
