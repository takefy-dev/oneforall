

const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')
const fs = require('fs')
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'reload',
            description: 'definir le nom du bot',
            usage: 'setname dd',
            category: 'botOwner',
            clientPermissions: ['EMBED_LINKS'],
            ownerOnly: true,
        });
    }
    async run(client, message,args) {
        if(!args[0]) return;

    }
};
