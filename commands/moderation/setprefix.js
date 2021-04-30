
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setprefix',
            description: 'Change the prefix | Changer le prefix',
            usage: 'setprefix <prefix>',
            category: 'moderation',
            tags: ['guildOnly'],
            clientPermissions: ['SEND_MESSAGES'],
            guildOwnerOnly: true,
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const lang = client.lang(message.guild.lang)


        let regex = /^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1}$/igm;
        let isValid = regex.test(args[0]);
        if (!isValid) return message.channel.send(lang.setprefix.errorNoValid)

        const [cmdName, newPrefix] = message.content.split(" ");
        if (newPrefix) {
            try {
                message.guild.updatePrefix = newPrefix
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
