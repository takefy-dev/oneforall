const prettyMilliseconds = require('pretty-ms');
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
// TODO : MUTELIST + MUTE ROLE ADD WHEN REJOIN
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'mutelist',
            description: 'Show the tempmute member of the server | Afficher la liste des membres tempmute du serveur',
            // Optionnals :
            usage: 'mutelist',
            category: 'moderation',
            userPermissions: ['MUTE_MEMBERS'],
            clientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const mutedData = [];
        const color = message.guild.color
        const lang = client.lang(message.guild.lang)

        let now = new Date();


        const expireAt = new Date(muted.muteEnd)
        const timeLeft = prettyMilliseconds(expireAt.getTime() - now.getTime())
        mutedData.push(`<@${muted.userId}> ・ ${timeLeft}`)

        if (res[0].length === 0) return message.channel.send(`Il n'y a pas de membre muet`)
        try {
            let tdata = await message.channel.send(lang.loading)

            let p0 = 0;
            let p1 = 10;
            let page = 1;
            // console.log(mutedData.map(r => r).map((user, i) => message.guild.members.cache.get(user).user.id, i))

            let embed = new Discord.MessageEmbed()
            embed.setTitle(`${lang.mutelist.title}`)
                .setColor(`${color}`)
                .setDescription(mutedData
                    .slice(0, 10)
                    .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
                .setTimestamp()
                .setFooter(`${client.user.username}`);

            let reac1
            let reac2
            let reac3

            if (mutedData.length > 10) {
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


                    embed.setDescription(mutedData
                        .slice(p0, p1)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
                    tdata.edit(embed);

                }

                if (reaction.emoji.name === "➡") {

                    p0 = p0 + 10;
                    p1 = p1 + 10;

                    page++;

                    if (p1 > mutedData.length + 10) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed.setDescription(mutedData
                        .slice(p0, p1)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
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

    }

)
}
}
;


