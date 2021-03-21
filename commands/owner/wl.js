const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
var checkSetup = require('../../function/check/checkSetup');
const { cpus } = require('os');
const guildId = new Map();
let ar1 = new Array();
const guildOwner = new Map();
const guildLang = new Map();
var langF = require('../../function/lang')
var checkOwner = require('../../function/check/botOwner');
const { Command } = require('advanced-command-handler');
module.exports = new Command({
    name: 'wl',
    description: 'Manage the whitelist | Gérer la whitelist',
    usage: '!wl <add / remove/ list> < mention / id >',
    tags: ['guildOnly'],
    category: 'owners',
    cooldown: 3
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)


    const result = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${message.guild.id}'`)
    const whitelisted = result[0][0].whitelisted;
    const strWhitelisted = whitelisted.toString();
    var ar2 = whitelisted.split(",")
    var tempdata = ar1.concat(ar2);
    const color = guildEmbedColor.get(message.guild.id);
    const clear = args[0] == 'clear'
    let owner = message.guild.ownerID;

    if (client.BotPerso) {
        const fs = require('fs');
        const path = './config.json';
        if (fs.existsSync(path)) {
            owner = require('../../config.json').owner;
        } else {
            owner = process.env.OWNER
        }
    }


    const add = args[0] == "add";
    const remove = args[0] == 'remove';
    const list = args[0] == 'list';
    if (!add & !remove & !list & !clear) return message.channel.send(lang.wl.errorSyntax)
    if (add) {
       

        if (!client.isGuildOwner(message.guild.id, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
        let member = message.guild.member(message.author.id);
        if (args[1]) {
            member = message.guild.member(args[1]);
        } else {
            return message.channel.send(lang.wl.errorSyntaxAdd)
        }
        if (message.mentions.members.first()) {
            member = message.guild.member(message.mentions.members.first().id);
        }
        if (!member) return message.channel.send(lang.wl.errorSyntaxAdd)

        if (tempdata.includes(member.user.id)) return message.channel.send(lang.wl.errorAlreadyWl(member))
        while (tempdata[0] == '==' || tempdata[0] == '') {
            tempdata.shift()
        }
        if (!tempdata.includes(member.user.id)) {
            tempdata.push(member.user.id);
        }



        this.connection.query(
            `UPDATE guildConfig SET whitelisted = '${tempdata}' WHERE guildId = '${message.guild.id}'`
        ).then(() => {
            StateManager.emit('wlUpdate', message.guild.id, tempdata);

            message.channel.send(lang.wl.successWl(member))

        })
    } else if (remove) {
     

        if (!client.isGuildOwner(message.guild.id, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
        let member = message.guild.member(message.author.id);
        if (args[1]) {
            member = message.guild.member(args[1]);
        } else {
            return message.channel.send(lang.wl.errorSyntax)
        }
        if (message.mentions.members.first()) {
            member = message.guild.member(message.mentions.members.first().id);
        }
        if (!member) return message.channel.send(lang.wl.errorSyntax)
        while (tempdata[0] == '==' || tempdata[0] == '') {
            tempdata.shift()
        }


        if (tempdata.includes(member.user.id) == false) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` **${member.user.tag}** n'est pas dans la whitelist`)

        tempdata = tempdata.filter(x => x !== member.user.id)

        this.connection.query(
            `UPDATE guildConfig SET whitelisted = '${tempdata}' WHERE guildId = '${message.guild.id}'`
        ).then(() => {
            StateManager.emit('wlUpdate', message.guild.id, tempdata);

            message.channel.send(`<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai enlevé **${member.user.tag}** à la whitelist`)

        })
    } else if (list) {
        let owner = message.guild.ownerID;

        if (client.BotPerso) {
            const config = require('../../config.json')
            owner = config.owner
        }

        try {
            let tdata = await message.channel.send(lang.loading)

            let p0 = 0;
            let p1 = 10;
            let page = 1;


            let embed = new Discord.MessageEmbed()

            embed.setTitle(`<:778353230383546419:781153631881265173> Liste des membres whitelist`)
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
    } else if (clear) {


        if (!client.isGuildOwner(message.guild.id, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
        const embed = new Discord.MessageEmbed()
            .setTitle(`Confirmation`)
            .setDescription(lang.wl.clearWl)
            .setFooter(client.user.username)
            .setTimestamp()
            .setColor(`${color}`)
        const msg = await message.channel.send(embed)
        await msg.react('✅')
        await msg.react('❌')

        const filter = (reaction, user) => ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => { return response.author.id === message.author.id };
        const collector = msg.createReactionCollector(filter, { time: 30000 });
        collector.on('collect', async (r, user) => {

            if (r.emoji.name == '✅') {
                try {
                    await this.connection.query(`UPDATE guildConfig SET whitelisted = '' WHERE guildId = '${message.guild.id}'`).then(() => {
                        tempdata = []
                        msg.delete()
                        return message.channel.send(lang.wl.successClearWl)

                    })
                } catch (err) {
                    console.error(err)
                    return message.channel.send(lang.wl.errror)
                }
            } else if (r.emoji.name == '❌') {
                return message.channel.send(lang.wl.cancel)
            }
        })

    }
});






embedsColor(guildEmbedColor);
StateManager.on('ownerUpdate', (guildId, data) => {
    guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) => {
    guildOwner.set(guildId, data);

})


langF(guildLang);


