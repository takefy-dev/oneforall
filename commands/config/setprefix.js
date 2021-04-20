const Command = require('../../structures/Command');
const { Logger } = require('advanced-command-handler')
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'setprefix',
            description: 'Define the new prefix | Définir le nouveau prefix',
            usage: 'setprefix <prefix>',
            category: 'configuration',
            guildOwnerOnly: true

        });
    }
    async run(client, message,args){
        const regex = /^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1}$/igm;
        const isValid = regex.test(args[0]);
        if (!isValid) return message.channel.send(client.lang(message.guild.lang).setprefix.errorNoValid);
        message.guild.updatePrefix = args[0];
        await message.channel.send(client.lang(message.guild.lang).setprefix.success(args[0]))

    }
}