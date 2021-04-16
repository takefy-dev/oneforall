const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'allbots',
    description: 'Show all bot | Affiche tout les bots',
    // Optionnals :
    usage: '!allbots',
    category: 'moderation',
    tags: ['guildOnly'],
    aliases: ['showbot', 'allbot'],
    userPermissions: ["ADMINISTRATOR"],
    cooldown: 10
}, async (client, message, args) => {
    const color = message.guild.color
    const tempdata = []

    const lang = require(`../../lang/${message.guild.lang}`);
    let bots;
    let noms;
    await message.guild.members.fetch().then((members) => {
        bots = members.filter(m => m.user.bot).size;
        noms = members.filter(m => m.user.bot).map(m => tempdata.push(m.user.id))
    })

    try {
        let tdata = await message.channel.send(lang.loading)

        let p0 = 0;
        let p1 = 10;
        let page = 1;
        // console.log(tempdata.map(r => r).map((user, i) => message.guild.members.cache.get(user).user.id, i))

        let embed = new Discord.MessageEmbed()

        embed.setTitle(lang.allbot.title(bots))
            .setColor(`${color}`)
            .setDescription(tempdata
                .filter(x => message.guild.members.cache.get(x))
                .map(r => r)
                .map((user, i) => `${i + 1} ・ **<@${message.guild.members.cache.get(user).user.id}>**`)
                .slice(0, 10)
                .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(tempdata.length / 10)}**`)
            .setTimestamp()
            .setFooter(`${client.user.username}`);

        let reac1
        let reac2
        let reac3

        if (tempdata.length > 10) {
            reac1 = await tdata.react("⬅");
            reac2 = await tdata.react("❌");
            reac3 = await tdata.react("➡");
        }

        tdata.edit(" ", embed);

        const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);

        data_res.on("collect", async (reaction) => {

            if (reaction.emoji.name === "⬅") {

                p0 = p0 - 10;
                p1 = p1 - 10;
                page = page - 1

                if (p0 < 0) {
                    return
                }
                if (p0 === undefined || p1 === undefined) {
                    return
                }


                embed.setDescription(tempdata
                    .filter(x => message.guild.members.cache.get(x))
                    .map(r => r)
                    .map((user, i) => `${i + 1} ・  **<@${message.guild.members.cache.get(user).user.id}>**`)
                    .slice(p0, p1)
                    .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(tempdata.length / 10)}**`)
                tdata.edit(embed);

            }

            if (reaction.emoji.name === "➡") {

                p0 = p0 + 10;
                p1 = p1 + 10;

                page++;

                if (p1 > tempdata.length + 10) {
                    return
                }
                if (p0 === undefined || p1 === undefined) {
                    return
                }


                embed.setDescription(tempdata
                    .filter(x => message.guild.members.cache.get(x))
                    .map(r => r)
                    .map((user, i) => `${i + 1} ・ **<@${message.guild.members.cache.get(user).user.id}>**`)
                    .slice(p0, p1)
                    .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(tempdata.length / 10)}**`)
                tdata.edit(embed);

            }

            if (reaction.emoji.name === "❌") {
                data_res.stop()
                await tdata.reactions.removeAll()
                return tdata.delete();
            }

            await reaction.users.remove(message.author.id);

        })

    } catch (err) {
        console.log(err)
    }
    // var embed = new Discord.MessageEmbed()
    //     .setColor(`${color}`)
    //     .setTitle()
    //     .setDescription(noms)
    //     .setFooter(client.user.username)
    //     .setTimestamp()
    // message.channel.send(embed)
}
);

embedsColor(guildEmbedColor);
langF(guildLang);
