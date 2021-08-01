module.exports = {

    name: 'xp-reset',
    description: "Reset the xp of a member or all | Reset l'xp d'un membre ou tout le monde",
    category: 'xp',
    usage: 'xp-reset <all/mention/id>',
    aliases: ['reset-xp', 'xpreset', 'resetxp'],
    clientPermissions: ['EMBED_LINKS'],
    guildOwnerOnly: true,
    cooldown: 2,

    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const color = guildData.get('color')
        const lang = guildData.lang
        if (!args[0]) return
        if (args[0] === "all") {
            const userToReset = client.managers.userManager.filter(user => user.where.guildId === message.guild.id && user.values.xp.xp > 0)
            if (userToReset.size < 1) return message.channel.send(lang.xpReset.errorNothingToReset)
            for (const [key, value] of userToReset) {
                const user = client.managers.userManager.getAndCreateIfNotExists(key)
                const xp = user.get('xp')
                xp.xp = 0;
                xp.level = 0;
                user.set('xp', xp).save()
            }
            message.channel.send(lang.xpReset.successAll(userToReset.size))

        } else {
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];
            const targetUser = await client.users.fetch(args[0]);
            if (!targetUser) return;
            const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`)
            const xp = userData.get('xp')
            xp.xp = 0;
            xp.level = 0;
            userData.set('xp', xp).save().then(() => {
                message.channel.send(lang.xpReset.success(targetUser.toString()))

            })


        }


    }
}