const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
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

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;

        let deleteAmount;

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply(lang.clear.errorNaN)
        }

        if (parseInt(args[0]) > 100) {
            console.log('supp')

            deleteAmount = parseInt(args[0]) - 100
            while(parseInt(args[0]) - 100  > 100 && deleteAmount > 0){

                await message.channel.bulkDelete(100, true).catch(console.log)
                deleteAmount -= 100

                await client.functions.sleep(500)

            }
            await message.channel.bulkDelete(deleteAmount+1, true)

        } else {
            console.log('supps')

            deleteAmount = parseInt(args[0]);
            message.delete();
            let msg;
            message.channel.bulkDelete(deleteAmount + 1, true).then(async () => {
                msg = await message.channel.send(lang.clear.success(deleteAmount))
                setTimeout(() => {
                    msg.delete();
                }, 5000)

            });
        }

    }
}
