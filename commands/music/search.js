const numbers = require('number-to-emoji');
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'search',
            description: 'Search for a music | Cherche une music',
            // Optionnals :
            usage: '!search <music to search>',
            category: 'music',
            aliases: ['find', 'chercher'],
            clientPermissions: ['EMBED_LINKS'],
        });
    }

    async run(client, message, args) {

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const musicName = args.join(" ");
        if (!musicName) return message.channel.send(lang.music.search.noArgs);

        const msg = await message.channel.send(lang.music.search.searching);
        try {

            await client.music.search(musicName, {limit: 10}).then(async (result) => {
                const emojis = [
                    "1️⃣",
                    "2️⃣",
                    "3️⃣",
                    "4️⃣",
                    "5️⃣",
                    "6️⃣",
                    "7️⃣",
                    "8️⃣",
                    "9️⃣",
                    "🔟",
                ]
                for (let index = 0; index < result.length && index < 10; index++) {
                    await msg.react(emojis[index])
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle(lang.music.search.title)
                    .setDescription(`
                ${result.map((song, i) => `**${i + 1}**.${song.name} - \`${song.formattedDuration}\``).slice(0, 10).join("\n")}
                `)
                    .setColor(`${color}`)
                    .setTimestamp()
                    .setFooter(client.user.username);
                const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;

                msg.edit(" ", embed).then(async m => {
                    const collector = m.createReactionCollector(filter, {time: 120000});
                    collector.on('collect', async r => {
                        r.users.remove(message.author);
                        const songToPlay = result[numbers.fromEmoji(r.emoji.name) - 1];
                        client.music.play(message, songToPlay)
                    })
                    collector.on('end', () => {
                        return message.channel.send(lang.music.search.end)
                    })
                })

            })
        } catch (e) {
            const embed = new Discord.MessageEmbed()
                .setDescription(lang.music.search.nothingFound)
                .setColor(`${color}`)
            msg.edit("", embed)
        }
    }
}
