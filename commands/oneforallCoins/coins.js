
const userCoins = new Map();
const coinSettings = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'coins',
            description: 'Show how many coins you have | Affiche le nombre de coins que vous avez',
            // Optionnals :
            usage: 'coins [mention/id]',
            category: 'coins',
            tags: ['guildOnly'],
            aliases: ['balance', 'argent', 'money'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        if(!message.guild.config.coinsOn) return;

        let member = message.mentions.members.first()  || await message.guild.members.fetch(args[0])
        if(!args[0]) member = message.member;
        let coins = !member.coins ? 'Aucun' : member.coins;
        const embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic: true}))
            .setColor(guildData.get('color'))
            .setFooter(client.user.username)
            .setTimestamp()
            .setDescription(client.lang(message.guild.lang).coins.description(coins));

        await message.channel.send(embed)

    }
}
