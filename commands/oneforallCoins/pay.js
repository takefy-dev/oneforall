
const coinSettings = new Map();
const userCoins = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'pay',
            description: 'Pay a member | Payer un membre',
            // Optionnals :
            usage: 'pay <mention / id> <number coins>',
            category: 'coins',
            cooldown: 2
        });
    }

    async run(client, message, args) {
        if(!message.guild.config.coinsOn) return;


        if (isNaN(args[0]) && !message.mentions.members.first()) return message.channel.send(client.lang(message.guild.lang).pay.noMember).then(mp => mp.delete({ timeout: 4000 }));
        if (isNaN(args[1]) || !args[1]) return message.channel.send(client.lang(message.guild.lang).pay.noCoins).then(mp => mp.delete({ timeout: 4000 }));
        if (args[1] < 0) return message.channel.send(client.lang(message.guild.lang).pay.coinsInf0)
        if (args[1].includes('.')) {
            if ((args[1].split('.')[1].split('').length > 2)) return message.channel.send(client.lang(message.guild.lang).pay.coinsDec2)
        }


        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if (member.user.id === message.author.id) return message.channel.send(`Vous ne pouvez pas vous donner vous même des coins à donner`).then(mp => mp.delete({ timeout: 4000 }))
        let receiverCoins = member.coins
        let giverCoins =  message.member.coins
        if(!giverCoins) return message.channel.send(client.lang(message.guild.lang).pay.noGoinsToGive)
        if(giverCoins < args[1]) return message.channel.send(client.lang(message.guild.lang).pay.notEnoughtCoins(args[1]))
        giverCoins -= parseFloat(args[1])
        receiverCoins += parseFloat(args[1])
        try{
            member.updateCoins = receiverCoins
            message.member.updateCoins = giverCoins
            await message.lineReply(client.lang(message.guild.lang).pay.giveCoins(args[1], member))
            const logs = message.guild.channels.cache.get(message.guild.logs);
            if(!logs) return;
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag,message.author.displayAvatarURL({dynamic: true}))
                .setDescription(client.lang(message.guild.lang).pay.logs(args[1], message.member, member))
                .setTimestamp()
                .setColor(guildData.get('color'))
                .setFooter(client.user.username)
            logs.send(embed)
        }catch (e) {
            Logger.error('Pay player coins', 'WARNING ERROR')
            console.log(e)
        }

    }
}