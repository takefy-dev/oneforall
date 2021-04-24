const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setlang',
            description: 'change the language of the bot | Changer la langue du bot',
            usage: '!setlang',
            category: 'owners',
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['SEND_MESSAGES'],
            guildOwnerOnly: true,
            cooldown: 4
        });
    }

    async run(client, message, args) {


        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const msg = await message.channel.send(lang.loading)

        await msg.react(`🇫🇷`);
        await msg.react("🇬🇧");
        await msg.react("❌");
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.setlang.title)
            .setDescription(lang.setlang.description(message.guild.lang))
            .setTimestamp()
            .setColor(`${color}`)
            .setFooter(`${client.user.username}`);
        const filter = (reaction, user) => ['🇫🇷', '🇬🇧', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => {
                return response.author.id === message.author.id
            };
        msg.edit('', embed).then(async (m) => {
            const collector = m.createReactionCollector(filter, {time: 900000});
            collector.on('collect', async r => {
                await r.users.remove(message.author);
                if (r.emoji.name === "🇫🇷") {
                    if (message.guild.lang === "fr") {
                        return message.channel.send(lang.setlang.errorSelected)
                    } else {
                        await collector.stop()
                        await msg.delete();
                        message.guild.updateLang = 'fr';
                        return message.channel.send(lang.setlang.success('fr'))
                    }

                } else if (r.emoji.name === "🇬🇧") {
                    if (message.guild.lang === "en") {
                        return message.channel.send(lang.setlang.errorSelected)
                    } else {
                        await collector.stop()
                        await msg.delete();
                        message.guild.updateLang = 'en';
                        return message.channel.send(lang.setlang.success('en'))
                    }
                } else if (r.emoji.name === "❌") {
                    await collector.stop();
                    return await msg.delete();
                }
            });
        })


    }
}