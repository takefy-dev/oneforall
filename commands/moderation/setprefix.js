module.exports = {

    name: 'setprefix',
    description: 'Change the prefix | Changer le prefix',
    usage: 'setprefix <prefix>',
    category: 'moderation',
    tags: ['guildOnly'],
    clientPermissions: ['SEND_MESSAGES'],
    guildOwnerOnly: true,
    cooldown: 5,


    run: async (client, message, args) => {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;


        let regex = /^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1}$/igm;
        let isValid = regex.test(args[0]);
        if (!isValid) return message.channel.send(lang.setprefix.errorNoValid)

        const [cmdName, newPrefix] = message.content.split(" ");
        if (newPrefix) {
            try {
                guildData.set('prefix', newPrefix).save()
                message.channel.send(lang.setprefix.success(newPrefix));
            } catch (err) {
                console.log(err);
                message.channel.send(lang.setprefix.errorSql(newPrefix));
            }
        } else {
            message.channel.send(lang.setprefix.errorNoArgs);
        }
    }
}
