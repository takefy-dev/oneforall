
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

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const shopSettings = coinSettings.get(message.guild.id);
        if (!shopSettings.enable) return message.channel.send(lang.buy.shoDisable).then(mp => mp.delete({timeout: 4000}))
        let coins = 0;
        let member;
        let memberId = args[0]
        if (memberId) {
            member = message.mentions.members.first()
            if (!member && !isNaN(memberId)) {
                if (message.guild.members.cache.has(memberId)) {
                    member = message.guild.members.cache.get(memberId);

                } else {
                    member = await message.guild.members.fetch(memberId)
                }
            }

        }
        if (!memberId) member = message.member
        if (!member) return message.channel.send(lang.coins.userNotFound).then(mp => mp.delete({timeout: 4000}))
        const guildCoins = userCoins.get(message.guild.id);
        if (guildCoins) {
            const memberCoin = guildCoins.find(coins => coins.userId === member.user.id);
            if (memberCoin) coins = memberCoin.coins;
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`**${member.user.tag}** a <a:coinsoneforall:823538178622488616> __${coins === 0 ? `0` : coins.toLocaleString()}__ coins.`)
                .setColor(`${color}`)
                .setFooter(`© OneForAll Coins`)
            message.channel.send(embed)

        } else {
            message.channel.send(lang.lb.noCoins)

        }

    }
}
