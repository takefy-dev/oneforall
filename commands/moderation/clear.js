const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'clear',
            description: 'Delete a number of message | Supprimer un nombre de messages',
            usage: 'clear <number/member>',
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
        const member = message.mentions.members.first();
        if(member){
            const channelMessage = await message.channel.messages.fetch();
            const memberMessage = channelMessage.filter((m) => m.author.id === member.id)
            await message.channel.bulkDelete(memberMessage, true).then(async () => {
                const msg = await message.channel.send(`${member} messages cleared`)
                setTimeout(() => {

                    msg.delete()
                }, 2000)
            })
        }else{
            let deleteAmount = parseInt(args[0]);

            if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
                return message.reply(lang.clear.errorNaN)
            }

            let tbx = [];

            const chunkBy = (n) => number => {
                tbx = new Array(Math.floor(number / n)).fill(n);
                let remainder = number % n;
                if (remainder > 0) {
                    tbx.push(remainder);
                }
                return tbx;
            };

            const chunkBy100 = chunkBy(100);
            tbx.push(chunkBy100(deleteAmount));
            for (let x of tbx) {
                await clearMoreThan100(message.channel, x)
                await client.functions.sleep(1000)
            }
            const msg = await message.channel.send(lang.clear.success(deleteAmount))
            setTimeout(() => {
                msg.delete();
            }, 5000)
            async function clearMoreThan100(channel, limit) {
                let collected = await channel.messages.fetch({limit});
                let deletedMsg = 0;
                if (collected.size > 0) {
                    while (deletedMsg < limit) {
                        let deleted = await channel.bulkDelete(limit, true)
                        if (deleted.size < collected.size) {
                            for (let msg of collected.array()) {
                                await msg.delete();
                                deletedMsg++;
                            }
                        }
                        deletedMsg += deleted;
                    }

                } else return 0;
            }
        }


    }
}
