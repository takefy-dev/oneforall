const Command = require('../../structures/Handler/Command');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'lock',
            description: 'Lock one or multiple channels | Fermer un ou plusieurs salons',
            usage: 'lock <on / off / all> <on / off>',
            category: 'moderation',
            userPermissions: ['MANAGE_CHANNELS'],
            clientPermissions: ['MANAGE_CHANNELS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;

        // if(!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send("<:720681441670725645:780539422479351809> \`ERREUR\` Vous n'avez pas la permission requise \`MANAGE_CHANNELS\`")
        let isSetup =guildData.get('setup')
        if (!isSetup) return message.channel.send(lang.error.noSetup)
        const on = args[0] === 'on';
        const off = args[0] === 'off';
        const color = guildData.get('color')
        const ch = message.channel
        const memberRole = message.guild.roles.cache.get(guildData.get('memberRole'));
         if (on) {
            ch.updateOverwrite(memberRole, {
                SEND_MESSAGES: false
            }).then(() => {
                message.channel.send(lang.lock.successLock)
            })
        } else if (off) {
            ch.updateOverwrite(memberRole, {
                SEND_MESSAGES: true
            }).then(() => {
                message.channel.send(lang.lock.successOpen)
            })
        }
    }
}
