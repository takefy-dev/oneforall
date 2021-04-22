const Command = require('../../structures/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'owner',
            description: 'Manage the owner list | Gérer la liste des owners',
            category: 'guildOwner',
            usage: 'owner <add/remove/list/clear> <mention/id>',
            clientPermissions : ['EMBED_LINKS'],
            userPermissions: ['ADMINISTRATOR'],
            guildCrownOnly : true,
        });
    }
    async run(client, message,args){
        const add = args[0] === "add";
        const remove = args[0] === "remove";
        const list = args[0] === 'list';
        const clear = args[0] === "clear";
        let owners = message.guild.owners;
        while(owners[0] === ''){
            owners.shift()
        }
        if(add){
            const member = message.mentions.members.first() || await message.guild.members.fetch(args[1]);
            if(!member) return message.channel.send(client.lang(message.guild.lang).owner.noMember)
            if(owners.includes(member.id)) return message.channel.send(client.lang(message.guild.lang).owner.alreadyOwner(member.user.tag || member.user.username))
            owners.push(member.id);
            message.guild.updateOwner = owners;
            await message.channel.send(client.lang(message.guild.lang).owner.successAdd(member.user.tag || member.user.username));

        }else if(list){
            try {
                let tdata = await message.channel.send(client.lang(message.guild.lang).loading)

                let p0 = 0;
                let p1 = 10;
                let page = 1;


                let embed = new Discord.MessageEmbed()

                embed.setTitle(client.lang(message.guild.lang).owner.titleList)
                    .setColor(message.guild.lang)
                    .setDescription(owners
                        .filter(x => message.guild.members.cache.get(x))
                        .map(r => r)
                        .map((user, i) => `${i + 1} ・ **<@${message.guild.members.cache.get(user).user.id}>**`)
                        .slice(0, 10)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(owners.length / 10)}**`)
                    .setTimestamp()
                    .setFooter(`${client.user.username}`);

                let reac1
                let reac2
                let reac3

                if (owners.length > 10) {
                    reac1 = await tdata.react("⬅");
                    reac2 = await tdata.react("❌");
                    reac3 = await tdata.react("➡");
                }

                await tdata.edit(" ", embed);

                const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);

                data_res.on("collect", async (reaction) => {
                    // r.users.remove(message.author);

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


                        embed.setDescription(owners
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} ・  **<@${message.guild.members.cache.get(user).user.id}>**`)
                            .slice(p0, p1)
                            .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(owners.length / 10)}**`)
                        await tdata.edit(embed);

                    }

                    if (reaction.emoji.name === "➡") {

                        p0 = p0 + 10;
                        p1 = p1 + 10;

                        page++;

                        if (p1 > owners.length + 10) {
                            return
                        }
                        if (p0 === undefined || p1 === undefined) {
                            return
                        }


                        embed.setDescription(owners
                            .filter(x => message.guild.members.cache.get(x))
                            .map(r => r)
                            .map((user, i) => `${i + 1} ・  **<@${message.guild.members.cache.get(user).user.id}>**`)
                            .slice(p0, p1)
                            .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(owners.length / 10)}**`)
                        await tdata.edit(embed);

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

    }
}