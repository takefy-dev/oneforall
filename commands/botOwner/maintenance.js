const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'maintenance',
            description: 'Maintenance',
            category: 'botOwner',
            ownerOnly: true,

        });
    }
    async run(client, message,args){

        await client.database.models.maintenance.update({
            enable : args[0] === "on"
        }, {
            where: {
                client: client.user.id
            }
        }).then(res => {
           client.maintenance = args[0] === true
        })
        message.channel.send(`Maintenance est ${args[0]}`)

    }
}