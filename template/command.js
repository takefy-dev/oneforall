const Command = require('../../structures/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'test',
            description: 'test',
            category: 'test',
            usage: 'test',
            aliases: ['hey', 't'],
            clientPermissions : [''],
            userPermissions: ['ADMINISTRATOR'],
            ownerOnly: true,
            guildOwnerOnly : true,
            guildCrownOnly : true
        });
    }
    async run(client, message,args){
    }
}