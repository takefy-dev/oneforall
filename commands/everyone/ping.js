const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Get the latency and ping of the bot',
            usage: 'ping',
            clientPermissions: ['SEND_MESSAGES'],
            category: 'everyone',
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        message.channel.send(lang.ping.pinging).then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp; //calculate the ping of the bot
            m.edit(lang.ping.success(ping, client));
        })
    }
};

