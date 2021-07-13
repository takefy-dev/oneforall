const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'clear',
            description: 'Delete a number of message | Supprimer un nombre de messages',
            usage: 'clear <number>',
            category: 'moderation',
            userPermissions: ['MANAGE_MESSAGES'],
            clientPermissions: ['MANAGE_MESSAGES'],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const color =message.guild.color
      const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;

    let deleteAmount;

    if (isNaN(args[0]) || parseInt(args[0]) <= 0) { return message.reply(lang.clear.errorNaN)}

    if (parseInt(args[0]) > 105) {
        return message.reply(lang.clear.error100)
    } else {
        deleteAmount = parseInt(args[0]);
    }
    message.delete();
    let msg;
    message.channel.bulkDelete(deleteAmount + 1, true).then(async () =>{
        msg = await message.channel.send(lang.clear.success(deleteAmount))
        setTimeout(() =>{
            msg.delete();
        }, 5000)  
   
    });
}}
