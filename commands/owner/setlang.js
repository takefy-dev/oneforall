const
    fs = require('fs')
module.exports = {

    name: 'setlang',
    description: 'change the language of the bot | Changer la langue du bot',
    usage: 'setlang <lang>',
    category: 'owners',
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['SEND_MESSAGES'],
    guildOwnerOnly: true,
    cooldown: 4,

    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        if (!args[0]) return message.channel.send(lang.setlang.currentLang(guildData.get('lang')))
        const newLang = args[0].toLowerCase();
        const availableLang = fs.readdirSync('./lang').filter(f => f.endsWith('.js'));
        if (!availableLang.includes(`${newLang}.js`)) return message.channel.send(lang.setlang.errorInArgs(availableLang))
        guildData.set('lang', newLang).save().then(() => {
            message.channel.send(lang.setlang.success(newLang))
        })

    }
}
