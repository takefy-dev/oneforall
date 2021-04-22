const Command = require('../../structures/Command');
const { Logger } = require('advanced-command-handler');
const Discord = require('discord.js');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'coins',
            description: "Show a member coins || Affiche les coins d'un membre",
            category: 'userInfo',
            usage: 'coins [mention/id]',
            aliases: ['bal', 'money', 'balance'],
            clientPermissions : ['EMBED_LINKS'],
        });
    }
    async run(client, message,args){
        let member = message.mentions.members.first()  || await message.guild.members.fetch(args[0])
        if(!args[0]) member = message.member;
        let coins = !member.coins ? 'Aucun' : member.coins;
        const embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic: true}))
            .setColor(message.guild.color)
            .setFooter(client.user.username)
            .setTimestamp()
            .setDescription(client.lang(message.guild.lang).coins.description(coins));

        await message.channel.send(embed)
    }
}