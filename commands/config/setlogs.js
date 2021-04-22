const Command = require('../../structures/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'setlogs',
            description: 'Set the logs channel | Définir le salon des logs',
            category: 'config',
            usage: 'setlogs <channel>',
            clientPermissions : ['MANAGE_CHANNELS'],
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly : true,
        });
    }
    async run(client, message,args){
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if(!channel || channel.type !== 'text') return message.channel.send(client.lang(message.guild.lang).logs.noChannel);
        message.guild.updateLogs = channel.id;
        await message.channel.send(client.lang(message.guild.lang).logs.success(channel))
    }
}