const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'clearinvite',
            description: "Clear all invite server or a member  | Supprimé toutes les invites du server ou d'un membre",
            category: 'invite',
            usage: 'clearinvite [mention/id]',
            aliases: ['clearinv'],
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly : true,
            cooldown: 7
        });
    }
    async run(client, message,args){
    }
}