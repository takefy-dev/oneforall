const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'wl',
            description: 'Manage the whitelist | Gérer la whitelist',
            usage: 'wl <add / remove/ list> < mention / id >',
            category: 'owner',
            guildOwnerOnly: true,
            cooldown: 2
        });
    }

    async run(client, message, args) {

          const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;


        let whitelisted = message.guild.whitelisted;
        while (whitelisted[0] === '') {
            whitelisted.shift()
        }

        const color = guildData.get('color')
        const clear = args[0] === 'clear'

        const add = args[0] === "add";
        const remove = args[0] === 'remove';
        const list = args[0] === 'list';
        if (!add && !remove && !list && !clear) return message.channel.send(lang.wl.errorSyntaxAdd)
        if (add) {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[1]);
            if (!member) return message.channel.send(lang.wl.noMember)
            if (whitelisted.includes(member.id)) return message.channel.send(lang.wl.errorAlreadyWl(member.user.tag || member.user.username))
            whitelisted.push(member.id);
            message.guild.updateWhitelist = whitelisted;
            await message.channel.send(lang.wl.successWl(member.user.tag || member.user.username));


        } else if (remove) {
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[1]);
            if (!member) return message.channel.send(lang.owner.noMember)
            if (!whitelisted.includes(member.id)) return message.channel.send(lang.wl.errorNotWl(member.user.tag || member.user.username))
            whitelisted = whitelisted.filter(wl => wl !== member.id)
            message.guild.updateWhitelist = whitelisted;
            await message.channel.send(lang.wl.successRmWl(member.user.tag || member.user.username));

        } else if (list) {

            try {
                let tdata = await message.channel.send(lang.loading)

                let p0 = 0;
                let p1 = 10;
                let page = 1;


                let embed = new Discord.MessageEmbed()

                embed.setTitle(`<:778353230383546419:781153631881265173> Liste des membres whitelist`)
                    .setColor(`${color}`)
                    .setDescription(whitelisted
                        .filter(x => message.guild.members.cache.get(x))
                        .map(r => r)
                        .map((user, i) => `${i + 1} ・ **<@${message.guild.members.cache.get(user).user.id}>**`)
                        .slice(0, 10)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(whitelisted.length / 10)}**`)
                    .setTimestamp()
                    .setFooter(`${client.user.username}`);

                let reac1
                let reac2
                let reac3

                if (whitelisted.length > 10) {
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


                        embed.setDescription(whitelisted
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} ・  **<@${message.guild.members.cache.get(user).user.id}>**`)
                            .slice(p0, p1)
                            .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(whitelisted.length / 10)}**`)
                        tdata.edit(embed);

                    }

                    if (reaction.emoji.name === "➡") {

                        p0 = p0 + 10;
                        p1 = p1 + 10;

                        page++;

                        if (p1 > whitelisted.length + 10) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }


                        embed.setDescription(whitelisted
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} ・ **<@${message.guild.members.cache.get(user).user.id}>**`)
                            .slice(p0, p1)
                            .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(whitelisted.length / 10)}**`)
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
        } else if (clear) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Confirmation`)
                .setDescription(lang.whitelisted.clearWl)
                .setFooter(client.user.username)
                .setTimestamp()
                .setColor(`${color}`)
            const msg = await message.channel.send(embed)
            await msg.react('✅')
            await msg.react('❌')

            const filter = (reaction, user) => ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            const collector = msg.createReactionCollector(filter, {time: 30000});
            collector.on('collect', async (r, user) => {

                if (r.emoji.name === '✅') {
                    try {
                        whitelisted = []
                        message.guild.updateWhitelist = whitelisted;
                        msg.delete()
                        return message.channel.send(lang.wl.successClearWl)

                    } catch (err) {
                        console.error(err)
                        return message.channel.send(lang.wl.error)
                    }
                } else if (r.emoji.name === '❌') {
                    return message.channel.send(lang.wl.cancel)
                }
            })

        }
    }
}
