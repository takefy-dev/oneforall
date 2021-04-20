const Command = require('../../structures/Command');

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'test',
            description: 'test',
            usage: 'test',
            aliases: ['hey', 't'],
            userPermissions: ['ADMINISTRATOR']
        });
    }
    async run(client, message,args){
        console.log(client.database.models.guildConfig)
    }
}