const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const guildOwner = new Map();
let ar1 = new Array();
var checkOwner = require('../../function/check/botOwner');
module.exports = new Command({
    name: 'blacklist',
    description: 'Manage the blacklist of the server | Gérer la blacklist du serveur',
    // Optionnals :
    usage: 'blacklist <remove / add /list / on /off>',
    category: 'owners',
    tags : ['guildOnly'],
    aliases: ['bl'],    
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['BAN_MEMBERS'],
    cooldown: 5
}, async (client, message, args) => {

    var tempdata;
    this.connection = StateManager.connection;
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const result = await this.connection.query(`SELECT blacklisted FROM blacklist WHERE userId = '${message.guild.ownerID}'`)
  
    if (result[0].length != 0) {
        const blacklisted = result[0][0].blacklisted;
        const strBlacklisted = blacklisted.toString();
        var ar2 = blacklisted.split(",")
        tempdata = ar1.concat(ar2);

    }

    let owner = message.guild.ownerID;
    
    if(client.BotPerso){
        const fs = require('fs');
        const path = './config.json';
        if (fs.existsSync(path)) {
            owner = require('../../config.json').owner;
        } else {
            owner = process.env.OWNER
        }
    }

    const clear = args[0] == 'clear';
    const add = args[0] == "add";
    const remove = args[0] == 'remove';
    const list = args[0] == 'list';
    const on = args[0] == 'on';
    const off = args[0] == 'off';
    if (!add & !remove & !list & !clear & !on & !off) return message.channel.send(lang.blacklist.errorSyntax)
    if (on) {
        if (message.author.id != owner && !client.isOwner(message.author.id)) return message.channel.send(`${lang.error.notGuildOnly} activer ou désactiver la blacklist`)
        await this.connection.query(`SELECT userId FROM blacklist WHERE userId = ${owner}`).then((res) => {
            if (res[0].length == 0) {
                this.connection.query(`INSERT INTO blacklist (userId) VALUES ('${owner}')`)
            }
        }).catch((err) => {
            console.log("er", err)
        })
        const isOn = await this.connection.query(`SELECT isOn  FROM blacklist  WHERE userId = ${owner}`)
        if (isOn[0][0].isOn == '1') return await message.channel.send(lang.blacklist.errorAlreadyOn)
        await this.connection.query(`UPDATE blacklist SET isOn = '1'`).then(() => {
            return message.channel.send(lang.blacklist.successEnable)
        })
        StateManager.emit('blacklistIsOn', message.guild.ownerID, '1')

    }
    if (off) {
        if (message.author.id != owner && !client.isOwner(message.author.id)) return message.channel.send(`${lang.error.notGuildOwner} activer ou désactiver la blacklist`)
        await this.connection.query(`SELECT userId FROM blacklist WHERE userId = ${owner}`).then((res) => {
            if (res[0].length == 0) {
                this.connection.query(`INSERT INTO blacklist (userId) VALUES ('${owner}')`)
            }
        }).catch((err) => {
            console.log("er", err)
        })
        const isOn = await this.connection.query(`SELECT isOn  FROM blacklist  WHERE userId = ${owner}`)
        if (isOn[0][0].isOn == '0') return await message.channel.send(lang.blacklist.errorAlreadyOff)

        await this.connection.query(`UPDATE blacklist SET isOn = '0'`).then(() => {
            return message.channel.send(lang.blacklist.successDisable)
        })
        StateManager.emit('blacklistIsOn', message.guild.ownerID, '0')
    }
    if (add) {
        if ((!client.isGuildOwner(message.guild.id, message.author.id) || owner !== message.author.id) && !client.isOwner(message.author.id))   return message.channel.send(lang.error.notListOwner)


        let memberUser;
        try{
            if(message.mentions.users.first()){
                memberUser = message.mentions.users.first();
            }else if(client.users.cache.has(args[1])){
                memberUser = client.users.cache.get(args[1])
            }else {
        
                memberUser = await client.users.fetch(args[1]).catch(err => console.log(err))
    
            }
    
        }catch(err){
            console.log(err)
        }
       
        if(memberUser === undefined) return message.channel.send(lang.blacklist.errorCantFindMember)
        // if(isNaN(args[1]) && message.mentions.members.first() == undefined) return message.channel.send(lang.blacklist.errorCantFindMember)
        // if (!isNaN(args[1])) {
        //     member =  await message.guild.member(args[1]);
        // }
        // else if (message.mentions.members.first()) {

        //     await message.guild.members.fetch(message.mentions.members.first().id).then((members) =>{
        //         member = members
        //     });
        // }
        // if (await member == null) {
        //     await client.users.fetch(args[1]).then(members => member = members).catch(console.error)
        // }else if(!args[1] && !message.mentions.members.first()){
        //     return message.channel.send(lang.blacklist.errorSyntaxAdd)
        // }
        

        if(client.isOwner(memberUser.id)) return message.channel.send(lang.blacklist.errorBotOwner)
        if (memberUser.id == owner) return message.channel.send(lang.blacklist.errorCrown)
        if (memberUser.id == client.user.id) return message.channel.send(lang.blacklist.errorMe)
        if (!memberUser) return message.channel.send(lang.blacklist.errorSyntaxAdd)
        var isTargetOwner = checkOwner(message.guild.id, memberUser.id)
        if (isTargetOwner == true && isOwner == true && message.author.id != owner) return message.channel.send(lang.blacklist.errorTryBlOwner(memberUser))
        if(tempdata == undefined) return message.channel.send(lang.blacklist.errorNotInDb)
        if (tempdata.includes(memberUser.id)) return message.channel.send(lang.blacklist.errorAlreadyBl(memberUser))
        while (tempdata[0] == '==' || tempdata[0] == '') {
            tempdata.shift()
        }
        if (!tempdata.includes(memberUser.id)) {
            tempdata.push(memberUser.id);
        }



        this.connection.query(
            `UPDATE blacklist SET blacklisted = '${tempdata}' WHERE userId = '${owner}'`
        ).then(() => {
            StateManager.emit('blacklistUpdate', message.guild.ownerID, tempdata);
            message.channel.send(lang.blacklist.successBl(memberUser)).then(() => {
                if (memberUser.bannable == false) message.channel.send(lang.blacklist.errorBannable)
                message.guild.members.ban(memberUser.id, { reason: `Blacklist par ${message.author.tag}`, })
                    .then(() => {
                        message.channel.send(lang.blacklist.successBanBl(memberUser)).then(async () => {
                            try {
                                let guildCount = client.guilds.cache.filter(guild => guild.ownerID == owner && guild.id != message.guild.id).size;
                                await client.guilds.cache.filter(guild => guild.ownerID == owner && guild.id != message.guild.id).forEach(guild => {
                                    guild.members.ban(memberUser.id, { reason: `Blacklist par ${message.author.tag}`, })

                                })
                                await message.channel.send(lang.blacklist.successBanGuild(guildCount))
                            } catch (e) {
                                console.log(e)
                            }

                        })
                    })
            })


        })
    } else if (remove) {
        const owner = message.guild.ownerID;
        if(tempdata == undefined) return message.channel.send(lang.blacklist.errorNotInDb)

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
            await message.guild.members.fetch().then((members) => {
                ownerSS = members.get(owners[i])
            })

            const ownerList = ownerSS.user.tag;
            ownerTag.push(ownerList);

        }

        if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(lang.error.errorNoOwner(ownerTag));
        let memberUser;
        
        if(message.mentions.users.first()){
            memberUser = message.mentions.users.first();
        }else if(await client.users.cache.has(args[1]) && !isNaN(args[1])){
            memberUser = client.users.cache.get(args[1])
        }else if(!isNaN(args[0])){
            try{
                memberUser = await client.users.fetch(args[1])

            }catch(e){
                return message.channel.send(lang.blacklist.errorCantFindMember)
            }
        }

        if(memberUser === undefined) return message.channel.send(lang.blacklist.errorCantFindMember)
        if (!memberUser) return message.channel.send(lang.blacklist.errorSyntax)
        var isTargetOwner = checkOwner(message.guild.id, memberUser.id)
        if (isTargetOwner == true && isOwner == true && message.author.id != owner) return message.channel.send(lang.blacklist.errorTryUnBlOwner(memberUser))
        while (tempdata[0] == '==' || tempdata[0] == '') {
            tempdata.shift()
        }


        if (tempdata.includes(memberUser.id) == false) return message.channel.send(lang.blacklist.errorNotBl(memberUser))

        tempdata = tempdata.filter(x => x !== memberUser.id)

        this.connection.query(
            `UPDATE blacklist SET blacklisted = '${tempdata}' WHERE userId = '${owner}'`
        ).then(() => {
            StateManager.emit('blacklistUpdate', message.guild.ownerID, tempdata);

            message.channel.send(lang.blacklist.successRmBl(memberUser)).then(() => {
                message.guild.members.unban(memberUser.id, `UnBlacklist par ${message.author.tag}`)
                    .then(() => {
                        message.channel.send(lang.blacklist.successUnBanBl(memberUser)).then(async () => {
                            try {
                                let guildCount = client.guilds.cache.filter(guild => guild.ownerID == owner && guild.id != message.guild.id).size;
                                await client.guilds.cache.filter(guild => guild.ownerID == owner && guild.id != message.guild.id).forEach(guild => {
                                    guild.members.unban(memberUser.id, `UnBlacklist par ${message.author.tag}`)

                                })
                                await message.channel.send(lang.blacklist.successUnBanGuild(guildCount))
                            } catch (e) {
                                console.log('er', e)
                            }

                        })
                    })
            })

        })
    } else if (list) {
        const owner = message.guild.ownerID;
        if(tempdata == undefined) return message.channel.send(lang.blacklist.errorNotInDb)
        try {
            let tdata = await message.channel.send(lang.loading)

            let p0 = 0;
            let p1 = 10;
            let page = 1;
            const tempMember = []
            for(ids of tempdata){
                let user;
                if(!client.users.cache.has(ids)){
                    user = await client.users.fetch(ids)

                }else{
                    user = client.users.cache.get(ids)
                }
                tempMember.push(user)
            }
            let embed = new Discord.MessageEmbed()
            embed.setTitle(lang.blacklist.titleList)
                .setColor(`${color}`)
                embed.setDescription(tempMember
                    .map((user, i) => `${i + 1} ・ **${user.tag}** \`${user.id}\``)
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


                    embed.setDescription(tempMember
                        .map((user, i) => `${i + 1} ・ **${user.tag}** \`${user.id}\``)
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


                    embed.setDescription(tempMember
                        .map((user, i) => `${i + 1} ・ **${user.tag}** \`${user.id}\``)
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
        const owner = message.guild.ownerID;

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
            await message.guild.members.fetch().then((members) => {
                ownerSS = members.get(owners[i])
            })
            const ownerList = ownerSS.user.tag;
            ownerTag.push(ownerList);

        }

        if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(lang.error.errorNoOwner(ownerTag))
        const embed = new Discord.MessageEmbed()
            .setTitle(`Confirmation`)
            .setDescription(lang.blacklist.clearBl)
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
                    await this.connection.query(`UPDATE blacklist SET blacklisted = '' WHERE userId = '${owner}'`).then(() => {
                        tempdata = []
                        msg.delete()
                        return message.channel.send(lang.blacklist.successClearBl)

                    })
                } catch (err) {
                    console.error(err)
                    return message.channel.send(lang.blacklist.errror)
                }
            } else if (r.emoji.name == '❌') {
                return message.channel.send(lang.blacklist.cancel)
            }
        })

    }

});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('ownerUpdate', (guildId, data) => {
    guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) => {
    guildOwner.set(guildId, data);

})