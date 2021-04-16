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
    this.connection = StateManager.connection;
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    let guildOwner = await client.users.cache.get(owner)

    console.log(guildOwner)
    let guildOwnerBlacklisted = guildOwner.blacklist;
    console.log(guildOwnerBlacklisted)
    let tempdata = !guildOwnerBlacklisted ? null : guildOwnerBlacklisted.blacklisted;

    

    const clear = args[0] === 'clear';
    const add = args[0] === "add";
    const remove = args[0] === 'remove';
    const list = args[0] === 'list';
    const on = args[0] === 'on';
    const off = args[0] === 'off';
    if (!add && !remove && !list && !clear && !on && !off) return message.channel.send(lang.blacklist.errorSyntax)
    if (message.author.id !== owner && !client.isOwner(message.author.id)) return message.channel.send(`${lang.error.notGuildOwner}`)
    if (on) {
            if (!guildOwnerBlacklisted) {
                this.connection.query(`INSERT INTO blacklist (userId) VALUES ('${owner}')`)
            }


        if (guildOwnerBlacklisted && guildOwnerBlacklisted.enable) return await message.channel.send(lang.blacklist.errorAlreadyOn)
        await this.connection.query(`UPDATE blacklist SET isOn = '1'`).then(() => {
            message.channel.send(lang.blacklist.successEnable)
        })
        guildOwner.blacklisted = {
            enable: true,
            blacklisted: ['']
        }
        tempdata = guildOwner.blacklist.blacklisted;

    }
    if (off) {
        if (!guildOwnerBlacklisted) {
            this.connection.query(`INSERT INTO blacklist (userId) VALUES ('${owner}')`)
        }

        if (guildOwnerBlacklisted && !guildOwnerBlacklisted.enable) return await message.channel.send(lang.blacklist.errorAlreadyOff)

        await this.connection.query(`UPDATE blacklist SET isOn = '0'`).then(() => {
            return message.channel.send(lang.blacklist.successDisable)
        })
        guildOwner.blacklisted.enable = false;
    }
    if (add) {
        let memberUser = message.mentions.users.first() || await client.users.fetch(args[1], true)
        if(!memberUser && !client.BotPerso){
            client.shard.broadcastEval(`this.users.cache.get('${args[1]}')`).then((res) =>{
                memberUser = res.filter(user => user !== null);
            })
        }
        if(!memberUser) return message.channel.send(lang.blacklist.errorCantFindMember)
       if(!args[1] && !message.mentions.members.first()){
            return message.channel.send(lang.blacklist.errorSyntaxAdd)
        }
        

        if(client.isOwner(memberUser.id)) return message.channel.send(lang.blacklist.errorBotOwner)
        if (memberUser.id === owner) return message.channel.send(lang.blacklist.errorCrown)
        if (memberUser.id === client.user.id) return message.channel.send(lang.blacklist.errorMe)
        if (!memberUser) return message.channel.send(lang.blacklist.errorSyntaxAdd)
        let isTargetOwner = client.isOwner(message.guild.id, memberUser.id)
        if (isTargetOwner  && message.author.id !== owner) return message.channel.send(lang.blacklist.errorTryBlOwner(memberUser))
        if(!tempdata) return message.channel.send(lang.blacklist.errorNotInDb)
        if (tempdata.includes(memberUser.id)) return message.channel.send(lang.blacklist.errorAlreadyBl(memberUser))
        while (tempdata[0] === '==' || tempdata[0] === '') {
            tempdata.shift()
        }
        if (!tempdata.includes(memberUser.id)) {
            tempdata.push(memberUser.id);
        }



        this.connection.query(
            `UPDATE blacklist SET blacklisted = '${tempdata}' WHERE userId = '${owner}'`
        ).then(() => {
            guildOwner.blacklisted.blacklisted = tempdata;
            message.channel.send(lang.blacklist.successBl(memberUser)).then(() => {
                message.guild.members.ban(memberUser.id, { reason: `Blacklist par ${message.author.tag}`, })
                    .then(() => {
                        message.channel.send(lang.blacklist.successBanBl(memberUser)).then(async () => {
                            try {
                                if(client.BotPerso){
                                    let guildCount = client.guilds.cache.filter(guild => guild.ownerID === owner && guild.id !== message.guild.id).size;
                                    await client.guilds.cache.filter(guild => guild.ownerID === owner && guild.id !== message.guild.id).forEach(guild => {
                                        guild.members.ban(memberUser.id, { reason: `Blacklist par ${message.author.tag}`, })

                                    })
                                    await message.channel.send(lang.blacklist.successBanGuild(guildCount))

                                }else{
                                    const guildCount = await client.shard.broadcastEval(`this.guilds.cache.filter(guild => guild.ownerID === ${owner} && guild.id !== ${message.guild.id}).size`).then((res) => res.reduce((acc, guildCount) => acc + guildCount), 0)
                                    console.log(guildCount);
                                    await client.shard.broadcastEval(`this.guilds.cache.filter(guild => guild.ownerID === "188356697482330122" )`).then((res) =>{
                                        const guild = res.filter(guild => guild.length > 0);
                                        console.log(guild)
                                        if(guild && guild.length === 1){
                                            guild.members.ban(memberUser.id, { reason: `Blacklist par ${message.author.tag}`, })
                                            message.channel.send(lang.blacklist.successBanGuild(guildCount))
                                        }else if(guild && guild.length > 1){
                                            guild.forEach(guild =>  guild.members.ban(memberUser.id, { reason: `Blacklist par ${message.author.tag}`, }))
                                            message.channel.send(lang.blacklist.successBanGuild(guildCount))
                                        }else{
                                            message.channel.send(lang.blacklist.successBanGuild(guildCount))

                                        }
                                    })
                                }

                            } catch (e) {
                                console.log(e)
                            }

                        })
                    })
            })


        })
    } else if (remove) {
       
        let memberUser;
if (!client.isGuildOwner(message.guild.id, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)        
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
            StateManager.emit('blacklistUpdate', owner, tempdata);

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
if (!client.isGuildOwner(message.guild.id, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
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
if (!client.isGuildOwner(message.guild.id, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)        
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