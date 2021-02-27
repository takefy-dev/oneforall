const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'counter',
    description: "Show the counter creation menu | Afficher le menu de création d'un compteur",
    // Optionnals :
    usage: '!counter',
    category: 'misc',
    aliases: ['compteur'],
    tags:['guildOnly'],
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],

    cooldown: 7
}, async(client, message, args) => {
    let memberCount = new Map();
    let botCount = new Map();
    let voiceCount = new Map();
    let onlineCount = new Map();
    let offlineCount = new Map();
    let channelCount = new Map();
    let roleCount = new Map();
    let boosterCount = new Map();

    this.connection = StateManager.connection;

    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const msg = await message.channel.send(lang.loading)
    const emoji = ['👥', '🤖', '🔊', '🟢', '⭕', '📖', '✨', '💠', '❌', '✅']
    for(const em of emoji) {
        await msg.react(em)
    }
  
    await this.connection.query(`SELECT memberCount, botCount, voiceCount, onlineCount, offlineCount, channelCount, roleCount, boosterCount FROM guildConfig WHERE guildId = '${message.guild.id}'`).then((result) => {
        memberCount.set(message.guild.id, result[0][0].memberCount)
        botCount.set(message.guild.id, result[0][0].botCount)
        voiceCount.set(message.guild.id, result[0][0].voiceCount)
        onlineCount.set(message.guild.id, result[0][0].onlineCount)
        offlineCount.set(message.guild.id, result[0][0].offlineCount)
        channelCount.set(message.guild.id, result[0][0].channelCount)
        roleCount.set(message.guild.id, result[0][0].roleCount)
        boosterCount.set(message.guild.id, result[0][0].boosterCount)
    })
    const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
    dureefiltrer = response => { return response.author.id === message.author.id };
    const embed = new Discord.MessageEmbed()
    .setTitle(lang.counter.embedTitle)
    .setDescription(lang.counter.embedDescription(JSON.parse(memberCount.get(message.guild.id)).name, JSON.parse(botCount.get(message.guild.id)).name, JSON.parse(voiceCount.get(message.guild.id)).name, JSON.parse(onlineCount.get(message.guild.id)).name, JSON.parse(offlineCount.get(message.guild.id)).name, JSON.parse(channelCount.get(message.guild.id)).name, JSON.parse(roleCount.get(message.guild.id)).name, JSON.parse(boosterCount.get(message.guild.id)).name))
    .setTimestamp()
    .setColor(`${color}`)
    .setFooter(client.user.username)
    msg.edit(' ', embed).then(async m => {
        const collector = m.createReactionCollector(filter, { time: 900000 });
        collector.on('collect', async r => {
            r.users.remove(message.author);
            if(r.emoji.name == emoji[0]){
                message.channel.send(lang.counter.memberChQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                return message.channel.send(lang.counter.errorNotChannel)
                            }
                            if (msg.content == 'off') {
                                await message.channel.send(lang.counter.disable("de membre")).then((e) => {
                                    memberCount.set(message.guild.id, JSON.stringify({id : undefined, name: `Non définie`}));
                                    updateEmbed()

                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            let ch;
                            if (!isNaN(msg.content)&& msg.content != 'off') {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first() && msg.content != 'off') ch = msg.mentions.channels.first();
                            if(msg.content != "off"){
                                if(ch.type != 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            if (msg.content != "off" && ch.type == 'voice') {

                                const replyMsg = message.channel.send(lang.counter.successMemberCh(ch)).then((replyMSG) => {
                                    setTimeout(async () => {
                                        await replyMSG.delete();
                                        await mp.delete();
                                        await msg.delete()
                                    }, 2000)

                                })
                                // const memberInfo = {
                                //     id: ch.id,
                                //     name: 
                                // }

                                message.channel.send(lang.counter.nameQ).then((messageReply) =>{
                                    messageReply.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        var msg = cld.first();
                                        memberCount.set(message.guild.id, JSON.stringify({id : ch.id, name: `${msg.content}`}))
                                        const replayMsg = message.channel.send(lang.counter.successMemberName(msg.content)).then(rp =>{
                                            setTimeout(async () => {
                                                await rp.delete();
                                                await messageReply.delete();
                                                await msg.delete()
                                            }, 2000)
                                        })
                                        updateEmbed()
                                    })
                                })

                            }

                        });
                })
            }
            if(r.emoji.name == emoji[1]){
                message.channel.send(lang.counter.botChQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                return message.channel.send(lang.counter.errorNotChannel)
                            }
                            if (msg.content == 'off') {
                                await message.channel.send(lang.counter.disable("de bots")).then((e) => {
                                    botCount.set(message.guild.id, JSON.stringify({id : undefined, name: `Non définie`}));
                                    updateEmbed()

                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            let ch;
                            if (!isNaN(msg.content)&& msg.content != 'off') {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                            if(msg.content != "off"){
                                if(ch.type != 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            if (msg.content != "off" && ch.type == 'voice') {

                                const replyMsg = message.channel.send(lang.counter.successBotCh(ch)).then((replyMSG) => {
                                    setTimeout(async () => {
                                        await replyMSG.delete();
                                        await mp.delete();
                                        await msg.delete()
                                    }, 2000)

                                })
                                message.channel.send(lang.counter.nameQ).then((messageReply) =>{
                                    messageReply.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        var msg = cld.first();
                                        botCount.set(message.guild.id, JSON.stringify({id : ch.id, name: `${msg.content}`}))
                                        const replayMsg = message.channel.send(lang.counter.successBotName(msg.content)).then(rp =>{
                                            setTimeout(async () => {
                                                await rp.delete();
                                                await messageReply.delete();
                                                await msg.delete()
                                            }, 2000)
                                        })
                                        updateEmbed()
                                    })
                                })
                                

                            }

                        });
                })
            }
            if(r.emoji.name == emoji[2]){
                message.channel.send(lang.counter.vocalChQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                return message.channel.send(lang.counter.errorNotChannel)
                            }
                            if (msg.content == 'off') {
                                await message.channel.send(lang.counter.disable("de membre en vocal")).then((e) => {
                                    voiceCount.set(message.guild.id, JSON.stringify({id : undefined, name: `Non définie`}));
                                    updateEmbed()

                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            let ch;
                            if (!isNaN(msg.content)&& msg.content != 'off') {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                            if(msg.content != "off"){
                                if(ch.type != 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            if (msg.content != "off" && ch.type == 'voice') {

                                const replyMsg = message.channel.send(lang.counter.successVocalCh(ch)).then((replyMSG) => {
                                    setTimeout(async () => {
                                        await replyMSG.delete();
                                        await mp.delete();
                                        await msg.delete()
                                    }, 2000)

                                })
                                message.channel.send(lang.counter.nameQ).then((messageReply) =>{
                                    messageReply.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        var msg = cld.first();
                                        voiceCount.set(message.guild.id, JSON.stringify({id : ch.id, name: `${msg.content}`}))
                                        const replayMsg = message.channel.send(lang.counter.successVocalName(msg.content)).then(rp =>{
                                            setTimeout(async () => {
                                                await rp.delete();
                                                await messageReply.delete();
                                                await msg.delete()
                                            }, 2000)
                                        })
                                        updateEmbed()
                                    })
                                })

                            }

                        });
                })
            }
            if(r.emoji.name == emoji[3]){
                message.channel.send(lang.counter.onlineChQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                return message.channel.send(lang.counter.errorNotChannel)
                            }
                            if (msg.content == 'off') {
                                await message.channel.send(lang.counter.disable("de membre en ligne")).then((e) => {
                                    onlineCount.set(message.guild.id, JSON.stringify({id : undefined, name: `Non définie`}));
                                    updateEmbed()

                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            let ch;
                            if (!isNaN(msg.content)&& msg.content != 'off') {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                            if(msg.content != "off"){
                                if(ch.type != 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            if (msg.content != "off" && ch.type == 'voice') {

                                const replyMsg = message.channel.send(lang.counter.successOnlineCh(ch)).then((replyMSG) => {
                                    setTimeout(async () => {
                                        await replyMSG.delete();
                                        await mp.delete();
                                        await msg.delete()
                                    }, 2000)

                                })
                                message.channel.send(lang.counter.nameQ).then((messageReply) =>{
                                    messageReply.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        var msg = cld.first();
                                        onlineCount.set(message.guild.id, JSON.stringify({id : ch.id, name: `${msg.content}`}))
                                        const replayMsg = message.channel.send(lang.counter.successOnlineName(msg.content)).then(rp =>{
                                            setTimeout(async () => {
                                                await rp.delete();
                                                await messageReply.delete();
                                                await msg.delete()
                                            }, 2000)
                                        })
                                        updateEmbed()
                                    })
                                })

                            }

                        });
                })
            }
            if(r.emoji.name == emoji[4]){
                 message.channel.send(lang.counter.offlineChQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                return message.channel.send(lang.counter.errorNotChannel)
                            }
                            if (msg.content == 'off') {
                                await message.channel.send(lang.counter.disable("de membre hors-ligne")).then((e) => {
                                    offlineCount.set(message.guild.id, JSON.stringify({id : undefined, name: `Non définie`}));
                                    updateEmbed()

                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            let ch;
                            if (!isNaN(msg.content)&& msg.content != 'off') {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                            if(msg.content != "off"){
                                if(ch.type != 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            if (msg.content != "off" && ch.type == 'voice') {

                                const replyMsg = message.channel.send(lang.counter.successOfflineCh(ch)).then((replyMSG) => {
                                    setTimeout(async () => {
                                        await replyMSG.delete();
                                        await mp.delete();
                                        await msg.delete()
                                    }, 2000)

                                })
                                message.channel.send(lang.counter.nameQ).then((messageReply) =>{
                                    messageReply.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        var msg = cld.first();
                                        offlineCount.set(message.guild.id, JSON.stringify({id : ch.id, name: `${msg.content}`}))
                                        const replayMsg = message.channel.send(lang.counter.successOfflineName(msg.content)).then(rp =>{
                                            setTimeout(async () => {
                                                await rp.delete();
                                                await messageReply.delete();
                                                await msg.delete()
                                            }, 2000)
                                        })
                                        updateEmbed()
                                    })
                                })

                            }

                        });
                })
            }
            if(r.emoji.name == emoji[5]){
                 message.channel.send(lang.counter.channelChQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                return message.channel.send(lang.counter.errorNotChannel)
                            }
                            if (msg.content == 'off') {
                                await message.channel.send(lang.counter.disable("de salons")).then((e) => {
                                    channelCount.set(message.guild.id, JSON.stringify({id : undefined, name: `Non définie`}));
                                    updateEmbed()

                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            let ch;
                            if (!isNaN(msg.content)&& msg.content != 'off') {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                            if(msg.content != "off"){
                                if(ch.type != 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            
                            if (msg.content != "off" && ch.type == 'voice') {

                                const replyMsg = message.channel.send(lang.counter.successChannelCh(ch)).then((replyMSG) => {
                                    setTimeout(async () => {
                                        await replyMSG.delete();
                                        await mp.delete();
                                        await msg.delete()
                                    }, 2000)

                                })
                                message.channel.send(lang.counter.nameQ).then((messageReply) =>{
                                    messageReply.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        var msg = cld.first();
                                        channelCount.set(message.guild.id, JSON.stringify({id : ch.id, name: `${msg.content}`}))
                                        const replayMsg = message.channel.send(lang.counter.successChannelName(msg.content)).then(rp =>{
                                            setTimeout(async () => {
                                                await rp.delete();
                                                await messageReply.delete();
                                                await msg.delete()
                                            }, 2000)
                                        })
                                        updateEmbed()
                                    })
                                })


                            }

                        });
                })
            }
            if(r.emoji.name == emoji[6]){
                 message.channel.send(lang.counter.roleChQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                return message.channel.send(lang.counter.errorNotChannel)
                            }
                            if (msg.content == 'off') {
                                await message.channel.send(lang.counter.disable("de rôles")).then((e) => {
                                    roleCount.set(message.guild.id, JSON.stringify({id : undefined, name: `Non définie`}));
                                    updateEmbed()

                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            let ch;
                            if (!isNaN(msg.content)&& msg.content != 'off') {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                            if(msg.content != "off"){
                                if(ch.type != 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            if (msg.content != "off" && ch.type == 'voice') {

                                const replyMsg = message.channel.send(lang.counter.successRoleCh(ch)).then((replyMSG) => {
                                    setTimeout(async () => {
                                        await replyMSG.delete();
                                        await mp.delete();
                                        await msg.delete()
                                    }, 2000)

                                })
                                message.channel.send(lang.counter.nameQ).then((messageReply) =>{
                                    messageReply.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        var msg = cld.first();
                                        roleCount.set(message.guild.id, JSON.stringify({id : ch.id, name: `${msg.content}`}))
                                        const replayMsg = message.channel.send(lang.counter.successRoleName(msg.content)).then(rp =>{
                                            setTimeout(async () => {
                                                await rp.delete();
                                                await messageReply.delete();
                                                await msg.delete()
                                            }, 2000)
                                        })
                                        updateEmbed()
                                    })
                                })

                            }

                        });
                })
            }
            if(r.emoji.name == emoji[7]){
                message.channel.send(lang.counter.boostChQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            var msg = cld.first();
                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'off') {
                                return message.channel.send(lang.counter.errorNotChannel)
                            }
                            if (msg.content == 'off') {
                                await message.channel.send(lang.counter.disable("de booster")).then((e) => {
                                    boosterCount.set(message.guild.id, JSON.stringify({id : undefined, name: `Non définie`}));
                                    updateEmbed()

                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            let ch;
                            if (!isNaN(msg.content)&& msg.content != 'off') {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first()&& msg.content != 'off') ch = msg.mentions.channels.first();
                            if(msg.content != "off"){
                                if(ch.type != 'voice') await message.channel.send(lang.counter.notVoice).then((e) => {
                                    return setTimeout(() => { e.delete() }, 2000);
                                })
                            }
                            if (msg.content != "off" && ch.type == 'voice') {

                                const replyMsg = message.channel.send(lang.counter.successBoostCh(ch)).then((replyMSG) => {
                                    setTimeout(async () => {
                                        await replyMSG.delete();
                                        await mp.delete();
                                        await msg.delete()
                                    }, 2000)

                                })
                                message.channel.send(lang.counter.nameQ).then((messageReply) =>{
                                    messageReply.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                                    .then(async cld => {
                                        var msg = cld.first();
                                        boosterCount.set(message.guild.id, JSON.stringify({id : ch.id, name: `${msg.content}`}))
                                        const replayMsg = message.channel.send(lang.counter.successBoostName(msg.content)).then(rp =>{
                                            setTimeout(async () => {
                                                await rp.delete();
                                                await messageReply.delete();
                                                await msg.delete()
                                            }, 2000)
                                        })
                                        updateEmbed()
                                    })
                                })


                            }

                        });
                })
            }
            if(r.emoji.name == emoji[8]){
                message.channel.send(lang.setlogs.cancel).then((mp) => {
                    memberCount.delete(message.guild.id);
                    botCount.delete(message.guild.id);
                    onlineCount.delete(message.guild.id);
                    offlineCount.delete(message.guild.id);
                    channelCount.delete(message.guild.id);
                    roleCount.delete(message.guild.id);
                    boosterCount.delete(message.guild.id);
                    collector.stop();
                    setTimeout(async () => { mp.delete() }, 2000)
                    return msg.delete();

                })
            }
            if(r.emoji.name == emoji[9]){
                message.channel.send(lang.setlogs.save).then(async (mp) => {
                    this.connection.query(`UPDATE guildConfig SET memberCount = '${memberCount.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET botCount = '${botCount.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET voiceCount = '${voiceCount.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET onlineCount = '${onlineCount.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET offlineCount = '${offlineCount.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET channelCount = '${channelCount.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET roleCount = '${roleCount.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET boosterCount = '${boosterCount.get(message.guild.id)}' WHERE guildId = '${message.guild.id}'`)
                  
                    collector.stop();
                    setTimeout(async () => { mp.delete() }, 2000)
                    const memberChInfo = JSON.parse(memberCount.get(message.guild.id))
                    const botChInfo = JSON.parse(botCount.get(message.guild.id))
                    const voiceChInfo = JSON.parse(voiceCount.get(message.guild.id))
                    const onlineChInfo = JSON.parse(onlineCount.get(message.guild.id))
                    const offlineChInfo = JSON.parse(offlineCount.get(message.guild.id))
                    const channelChInfo = JSON.parse(channelCount.get(message.guild.id))
                    const roleChInfo = JSON.parse(roleCount.get(message.guild.id))
                    const boostChInfo = JSON.parse(boosterCount.get(message.guild.id))

                    StateManager.emit('counterUp', message.guild.id, [{name : memberChInfo.name, id : memberChInfo.id, type: 'member'},{name : botChInfo.name, id : botChInfo.id, type: 'bot'},{name : voiceChInfo.name, id : voiceChInfo.id, type: 'voice'},{name : onlineChInfo.name, id : onlineChInfo.id, type: 'online'},{name : offlineChInfo.name, id : offlineChInfo.id, type: 'offline'},{name : channelChInfo.name, id : channelChInfo.id, type: 'channel'},{name : roleChInfo.name, id : roleChInfo.id, type: 'role'},{name : boostChInfo.name, id : boostChInfo.id, type: 'booster'}])
                  
                    await message.guild.members.fetch();
                    if(memberChInfo.id != undefined){
                        const memberCh = message.guild.channels.cache.get(memberChInfo.id)
                        memberCh.setName(`${memberChInfo.name} ${message.guild.memberCount}`, 'MemberCount').then(() =>{
                            memberCount.delete(message.guild.id);
                        })
                    }
                    if(botChInfo.id != undefined){
                        const botCh = message.guild.channels.cache.get(botChInfo.id)
                        botCh.setName(`${botChInfo.name} ${message.guild.members.cache.filter(m => m.user.bot).size}`, 'BotCount').then(() =>{
                            botCount.delete(message.guild.id);
                        })
                    }
                    if(voiceChInfo.id != undefined){
                        let count = 0;

                        const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
                        for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
                        const voiceCh = message.guild.channels.cache.get(voiceChInfo.id)
                        voiceCh.setName(`${voiceChInfo.name} ${count}`, 'VoiceCount').then(() =>{
                            voiceCount.delete(message.guild.id);
                        })
                    }
                    if(onlineChInfo.id != undefined){
                        const onlineCh = message.guild.channels.cache.get(onlineChInfo.id)
                        onlineCh.setName(`${onlineChInfo.name} ${message.guild.members.cache.filter(member => member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").size}`, 'OnlineCount').then(() =>{
                            onlineCount.delete(message.guild.id);
                        })
                    }
                    if(offlineChInfo.id != undefined){
                        const offlineCh = message.guild.channels.cache.get(offlineChInfo.id)
                        offlineCh.setName(`${offlineChInfo.name} ${message.guild.members.cache.filter(member => member.presence.status == "offline").size}`, 'OfflineCount').then(() =>{
                            offlineCount.delete(message.guild.id);
                        })
                    }
                    if(channelChInfo.id != undefined){
                        const channelCh = message.guild.channels.cache.get(channelChInfo.id)
                        channelCh.setName(`${channelChInfo.name} ${message.guild.channels.cache.size}`, 'ChannelCount').then(() =>{
                            channelCount.delete(message.guild.id);
                        })
                    }
                    if(roleChInfo.id != undefined){
                        const roleCh = message.guild.channels.cache.get(roleChInfo.id)
                        roleCh.setName(`${roleChInfo.name} ${message.guild.roles.cache.size}`, 'RoleCount').then(() =>{
                            roleCount.delete(message.guild.id);
                        })
                    }
                    if(boostChInfo.id != undefined){
                        const boostCh = message.guild.channels.cache.get(boostChInfo.id)
                        boostCh.setName(`${boostChInfo.name} ${message.guild.premiumSubscriptionCount || '0'}`, 'BoosterCount').then(() =>{
                            boosterCount.delete(message.guild.id);
                        })
                    }

                    


                    // botCount.delete(message.guild.id);
                    // onlineCount.delete(message.guild.id);
                    // offlineCount.delete(message.guild.id);
                    // channelCount.delete(message.guild.id);
                    // roleCount.delete(message.guild.id);
                    // boosterCount.delete(message.guild.id);
                    return msg.delete();

                })
            }
           
            function updateEmbed() {
                embed.setDescription(lang.counter.embedDescription(JSON.parse(memberCount.get(message.guild.id)).name, JSON.parse(botCount.get(message.guild.id)).name, JSON.parse(voiceCount.get(message.guild.id)).name, JSON.parse(onlineCount.get(message.guild.id)).name, JSON.parse(offlineCount.get(message.guild.id)).name, JSON.parse(channelCount.get(message.guild.id)).name, JSON.parse(roleCount.get(message.guild.id)).name, JSON.parse(boosterCount.get(message.guild.id)).name))
                msg.edit(embed)
                // msgembed.addField(`\`🕙\`  Durée`, `${prettyMilliseconds(time.get(message.guild.id))}`, true)
                // msgembed.addField(`\`🏷️\`  Salon`, `<#${channel}>`, true)
                // msgembed.addField(`\`🕵️\` Gagnant imposé`, `<@${win}>`, true)
                // msgembed.addField(`\`🔊\` Présence en vocal`, `${voice}`, true)
                // msgembed.addField(`\`🎁\` Gain`, `${gains}`, true)

            }
        })
    })
});

embedsColor(guildEmbedColor);
langF(guildLang);
