const guildLang = new Map();
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'nuke',
            description: "Clear all messages of a channel | Supprimer tout les messages d'un salon",
            usage: 'nuke',
            category: 'moderation',
            aliases: ['renew', 'clearall'],
            userPermissions: ['MANAGE_MESSAGES'],
            clientPermissions: ['MANAGE_CHANNELS'],
            cooldown: 5
        });
    }
    async run(client, message,args){

      const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;
    const position = message.channel.rawPosition;
    const rateLimitPerUser = message.channel.rateLimitPerUser;
    let newChannel = await message.channel.clone()
    message.channel.delete();
    newChannel.setPosition(position);
    await newChannel.setRateLimitPerUser(rateLimitPerUser)
    newChannel.send(lang.nuke.success(message.member))


}};


