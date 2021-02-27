const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
var checkSetup = require('../../function/check/checkSetup');
const { cpus } = require('os');
const guildId = new Map();
let ar1 = new Array();
var checkOwner = require('../../function/check/botOwner');
const {Command} = require('advanced-command-handler');
const guildOwner = new Map();
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'owner',
    description: 'Manage the owner of the server | Gérer les owner du serveur',
    usage: '!owner <add/ remove /list> < mention / id >',
    tags : ['guildOnly'],
    category: 'owners',
    cooldown: 2
}, async(client, message, args) => {
    this.connection = StateManager.connection;
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)

    const sender = message.author.id;
    var isOwner = checkOwner(sender);

    const result = await this.connection.query(`SELECT owner FROM guildConfig WHERE guildId = '${message.guild.id}'`)
    const whitelisted = result[0][0].owner;
    const strWhitelisted = whitelisted.toString();
    var ar2 = whitelisted.split(",")
    var tempdata = ar1.concat(ar2);
    const color = guildEmbedColor.get(message.guild.id);
    
    const add = args[0] == "add";
    const remove = args[0] == 'remove';
    const clear = args[0] == 'clear';
    const list = args[0] == 'list';
    if (!add & !remove & !list & !clear) return message.channel.send(lang.owner.errorSyntax)
    if (add) {
        let owner = message.guild.ownerID;
    
        if(client.BotPerso){
            owner = process.env.OWNER
        }
        if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(lang.owner.errorNotOwner(message.guild))
        let member = message.guild.member(message.author.id);
        if (args[1]) {
            member = message.guild.member(args[1]);
        } else {
            return message.channel.send(lang.owner.errorSyntaxAdd)
        }
        if (message.mentions.members.first()) {
            member = message.guild.member(message.mentions.members.first().id);
        }
        if (!member) return message.channel.send(lang.owner.errorSyntaxAdd)

        if (tempdata.includes(member.user.id)) return message.channel.send(lang.owner.errorAlreadyOwner(member))
        while (tempdata[0] == '==' || tempdata[0] == '') {
            tempdata.shift()
        }
        if (!tempdata.includes(member.user.id)) {
            tempdata.push(member.user.id);
        }



        this.connection.query(
            `UPDATE guildConfig SET owner = '${tempdata}' WHERE guildId = '${message.guild.id}'`
        ).then(() => {
            StateManager.emit('ownerUpdate', message.guild.id, tempdata);
            message.channel.send(lang.owner.successOwner(member))

        })
    } else if (remove) {

        let owner = message.guild.ownerID;
    
        if(client.BotPerso){
            owner = process.env.OWNER
        }
        if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(lang.owner.errorNotOwner(message.guild))
        let member = message.guild.member(message.author.id);
        if (args[1]) {
            member = message.guild.member(args[1]);
        } else {
            return message.channel.send(lang.owner.errorSyntaxAdd)
        }
        if (message.mentions.members.first()) {
            member = message.guild.member(message.mentions.members.first().id);
        }
        if (!member) return message.channel.send(lang.owner.errorSyntaxAdd)
        while (tempdata[0] == '==' || tempdata[0] == '') {
            tempdata.shift()
        }
      

        if (tempdata.includes(member.user.id) == false) return message.channel.send(lang.owner.errorNotOwner(member))

        tempdata = tempdata.filter(x => x !== member.user.id)

        this.connection.query(
            `UPDATE guildConfig SET owner = '${tempdata}' WHERE guildId = '${message.guild.id}'`
        ).then(() => {
            StateManager.emit('ownerUpdate', message.guild.id, tempdata);
            message.channel.send(lang.owner.successRmOwner(member))

        })
    } else if (list) {
        let owner = message.guild.ownerID;
    
        if(client.BotPerso){
            owner = process.env.OWNER
        }

        const sender = message.author.id;
        var isOwner = checkOwner(message.guild.id, sender);
        let owners = guildOwner.get(message.guild.id);
        const ownerTag = new Array();
        if (typeof owners != "object") {
            owners = owners.split(',')
        } else {
            owners = owners
        }
        for (var i = 0; i < owners.length - 1; i++) {
            let ownerSS
            await message.guild.members.fetch().then((members) =>{
                ownerSS = members.get(owners[i])
            })
            const ownerList = ownerSS.user.tag;
            ownerTag.push(ownerList);

        }

        if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` Seulement les owners peuvent executer cette commande \`(${ownerTag.join(",")})\`!`)
        try{
            let tdata = await message.channel.send(lang.loading)

            let p0 = 0;
            let p1 = 10;
            let page = 1;


            let embed = new Discord.MessageEmbed()

            embed.setTitle(lang.owner.titleList)
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
                        .map((user, i) => `${i + 1} ・  **<@${message.guild.members.cache.get(user).user.id}>**`)
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

        } catch(err){
            console.log(err)
        }
    }else if (clear) {

        const owner = message.guild.ownerID;
        if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` Seulement le membre qui possède la couronne peux executer cette commande (${message.guild.owner.user.username})!`)
        const embed = new Discord.MessageEmbed()
            .setTitle(`Confirmation`)
            .setDescription(lang.owner.clearOwner)
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
                    await this.connection.query(`UPDATE guildConfig SET owner = '' WHERE guildId = '${message.guild.id}'`).then(() => {
                        tempdata = []
                        msg.delete()
                        return message.channel.send(lang.owner.successClearOwner)

                    })
                } catch (err) {
                    console.error(err)
                    return message.channel.send(lang.owner.error)
                }
            } else if (r.emoji.name == '❌') {
                return message.channel.send(lang.owner.cancel)
            }
        })

    }
});




StateManager.on('ownerUpdate', (guildId, data) =>{
    guildOwner.set(guildId, data);
  })
  StateManager.on('ownerFetched', (guildId, data) =>{
    guildOwner.set(guildId, data);
  
  })


embedsColor(guildEmbedColor);
langF(guildLang);


