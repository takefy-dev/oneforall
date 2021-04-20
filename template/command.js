const Command = require('../../structures/Command');
const { Logger } = require('advanced-command-handler')
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
        });
    }
    async run(client, message,args){
        console.log(client.database.models.guildConfig)
    }
}