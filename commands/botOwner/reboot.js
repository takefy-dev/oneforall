require('dotenv').config();
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'reboot',
            description: 'reboot bot',
            category: 'botOwner',
            ownerOnly: true,
            aliases: ['rb'],
        });
    }
    async run(client, message,args){
        await message.channel.send(`Je suis en train de redémarrer !`)
        process.exit()
    }
}

