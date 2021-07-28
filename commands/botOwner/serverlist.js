const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'serverlist',
            description: 'Show all the server of the bot | Affiche tout les serveurs du bot',
            category: 'botOwner',
            usage: 'serverlist [guildId]',
            clientPermissions: ['EMBED_LINKS'],
            ownerOnly: true,
            cooldown: 5

        });
    }

    async run(client, message, args) {


        let tempName = [];
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const color = guildData.get('color')
        let count = 0

        client.guilds.cache.forEach(guild => {
            tempName.push(`${count} ・${guild.name}・ **(${guild.id})** \`[${guild.memberCount}]\`\n`)
            count++
        })
        if (!args[0]) {
            try {
                let tdata = await message.channel.send(lang.loading)

                let p0 = 0;
                let p1 = 10;
                let page = 1;
                // console.log(tempName.map(r => r).map((user, i) => message.guild.members.cache.get(user).user.id, i))

                let embed = new Discord.MessageEmbed()
                embed.setTitle(`${lang.serverlist.title}`)
                    .setColor(`${color}`)
                    .setDescription(tempName
                        .slice(0, 10)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(tempName.length / 10)}**`)
                    .setTimestamp()
                    .setFooter(`${client.user.username}`);

                let reac1
                let reac2
                let reac3

                if (tempName.length > 10) {
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


                        embed.setDescription(tempName
                            .slice(p0, p1)
                            .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(tempName.length / 10)}**`)
                        tdata.edit(embed);

                    }

                    if (reaction.emoji.name === "➡") {

                        p0 = p0 + 10;
                        p1 = p1 + 10;

                        page++;

                        if (p1 > tempName.length + 10) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }


                        embed.setDescription(tempName
                            .slice(p0, p1)
                            .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(tempName.length / 10)}**`)
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
            message.channel.send(lang.serverlist.leave)
        }
        if (!isNaN(args[0])) {
            if (!client.guilds.cache.has(args[0])) return message.channel.send(lang.serverlist.errorNotServer)

            const guild = client.guilds.cache.get(args[0])
            guild.leave().then(() => {
                message.channel.send(lang.serverlist.success(guild.name))
            })
        }
    }
};

