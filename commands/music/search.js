const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang');
const numbers = require('number-to-emoji');
module.exports = new Command({
    name: 'search',
    description: 'Search for a music | Cherche une music',
    // Optionnals :
    usage: '!search <music to search>',
    category: 'music',
    aliases: ['find', 'chercher'],
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async (client, message, args) => {
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const musicName = args.join(" ");
    if(!musicName) return  message.channel.send(lang.music.search.noArgs);

    const msg = await message.channel.send(lang.music.search.searching);
    try {
      
        await client.music.search(musicName,{limit: 10}).then(async (result) => {
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
            for (let index = 0; index < result.length  && index < 10; index++) {
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
                const collector = m.createReactionCollector(filter, { time: 120000 });
                collector.on('collect', async r => {
                    r.users.remove(message.author);
                    const songToPlay = result[numbers.fromEmoji(r.emoji.name) - 1];
                    client.music.play(message, songToPlay)
                })
                collector.on('end', () =>{
                    return message.channel.send(lang.music.search.end)
                })
            })

        })
    } catch (e) {
        const embed = new Discord.MessageEmbed()
        .setDescription(lang.music.search.nothingFound)
        .setColor(`${color}`)
        msg.edit("",embed)
    }
});

embedsColor(guildEmbedColor);
langF(guildLang);
