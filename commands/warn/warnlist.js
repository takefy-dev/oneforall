const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'warnlist',
            description: "Show the server warns or of a specif member | Affiche les warns du serveur ou d'un membre en particulier",
            category: 'warn',
            usage: 'warnlist [member/id]',
            aliases: ['warn-list', 'serverwarn'],
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['BAN_MEMBERS'],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const color = message.guild.color
        const warnedMember = await message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
        const lang = client.lang(message.guild.lang)
        if (warnedMember) {
            const warnsMember = warnedMember.warns;
            const embed = new Discord.MessageEmbed()
                .setTitle(`Warns de ${warnedMember.user.username}`)
                .setDescription(warnsMember.map((warn, i) => `${i + 1} - Raison : ${warn}\n`))
                .setTimestamp()
                .setColor(color)
                .setFooter(client.user.username, !warnsMember.user ? client.user.displayAvatarURL({dynamic: true}) : warnedMember.user.displayAvatarURL({dynamic: true}))
            if(warnsMember.length < 1) embed.setDescription(lang.warn.noWarn)
            await message.channel.send(embed)
        } else {
            const allWarns = await message.guild.allWarns()
            if (!allWarns) return message.channel.send(lang.warn.noGuildWarn)
            let tdata = await message.channel.send(lang.loading)

            let p0 = 0;
            let p1 = 10;
            let page = 1;


            let embed = new Discord.MessageEmbed()

            embed.setTitle(`${message.guild.name} warns`)
                .setColor(color)
                .setDescription(allWarns
                    .map((info, i) => `${i + 1} ・ <@${info.userId}> : ${info.warn.slice(0, 8)}`)
                    .slice(0, 10)
                    .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(allWarns.length / 10)}**`)
                .setTimestamp()
                .setFooter(`${client.user.username}`);


            if (allWarns.length > 10) {
                await tdata.react("⬅");
                await tdata.react("❌");
                await tdata.react("➡");
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


                    embed.setDescription(allWarns
                        .map((info, i) => `${i + 1} ・ <@${info.userId}> : ${info.warn.slice(0, 8)}`)
                        .slice(p0, p1)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(whitelisted.length / 10)}**`)
                    tdata.edit(embed);

                }

                if (reaction.emoji.name === "➡") {

                    p0 = p0 + 10;
                    p1 = p1 + 10;

                    page++;

                    if (p1 > allWarns.length + 10) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }


                    embed.setDescription(allWarns
                        .map((info, i) => `${i + 1} ・ <@${info.userId}> : ${info.warn.slice(0, 8)}`)
                        .slice(p0, p1)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(allWarns.length / 10)}**`)
                    tdata.edit(embed);

                }

                if (reaction.emoji.name === "❌") {
                    data_res.stop()
                    await tdata.reactions.removeAll()
                    return tdata.delete();
                }

                await reaction.users.remove(message.author.id);

            })


        }


    }
}