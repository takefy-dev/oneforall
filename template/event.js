const Event = require('../structures/Event');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'ready',
        });
    }
    async run(client){
        Logger.info(`${client.user.tag} logged in`, `CLIENT LOGIN`);

    }
}