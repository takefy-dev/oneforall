const Discord = require('discord.js')

module.exports = {

    name: 'alladmins',
    description: 'Show all members with administator permissions | Afficher tout les membres avec les perm admin',
    usage: 'alladmins',
    category: 'moderation',
    userPermissions: ['ADMINISTRATOR'],
    cooldown: 5,


    run: async (client, message, args) => {

        const tempdata = []
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        const allMember = await message.guild.members.fetch()
        allMember.filter(
            (m) => m.permissions.has('ADMINISTRATOR')
        ).map(m => tempdata.push(m.user.id))


        let noembed = new Discord.MessageEmbed()
            .setColor(`${color}`)
            .setDescription(lang.alladmins.error)
            .setTitle(lang.alladmins.list)
            .setTimestamp()
            .setFooter(`${client.user.username}`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
        if (tempdata.length === 0) return message.channel.send(noembed)


        try {
            let tdata = await message.channel.send(lang.loading)

            let p0 = 0;
            let p1 = 10;
            let page = 1;

            let embed = new Discord.MessageEmbed()

            embed.setTitle(`${lang.alladmins.list} ${tempdata.length}`)
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

            tdata.edit({content: null, embeds: [embed]});

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
                    tdata.edit({embeds: [embed]});

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
                    tdata.edit({embeds: [embed]});

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
};


