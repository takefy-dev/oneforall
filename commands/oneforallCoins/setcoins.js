const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'setcoins',
            description: "Set the coins of somebody | Définie les coins de quelqu'un",
            category: 'coins',
            usage: 'setcoins <mention/id>',
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly : true,
            cooldown: 4
        });
    }
    async run(client, message,args){
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
        if(!member) return message.channel.send(`Vous devez spécifier un membre`)
        if(isNaN(args[1])) return message.channel.send(`Uniqement des nombres en args 2`)
        const money = parseFloat(args[1]).toFixed(2)
        member.updateCoins = money;
        await message.channel.send(`Vous avez définie le nombre de coins de ${member} à  ${money}`)
    }
}