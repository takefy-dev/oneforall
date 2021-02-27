const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const soutienId = new Map();
const soutienMsg = new Map();
const guildOwner = new Map();
const soutienOn = new Map();
var checkOwner = require('../../function/check/botOwner');
var SqlString = require('sqlstring');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'soutien',
    description: 'Show the menu for the soutient | Affiche le menu pour le soutient',
    // Optionnals :
    usage: '!soutien <config>',
    clientPermissions: ['ADD_REACTIONS'],
    category: 'owners',
    cooldown: 3
}, async (client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)

    this.connection = StateManager.connection;
    const color = guildEmbedColor.get(message.guild.id);
    const config = args[0] == "config";
    const count = args[0] == "count"
    const sender = message.author.id;
    const owner = message.guild.ownerID;

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

    await this.connection.query(`SELECT soutienId FROM guildConfig WHERE guildId = '${message.guild.id}'`).then((result) => {
        soutienId.set(message.guild.id, result[0][0].soutienId);
    })

    await this.connection.query(`SELECT soutienMsg FROM guildConfig WHERE guildId = '${message.guild.id}'`).then((result) => {
        soutienMsg.set(message.guild.id, result[0][0].soutienMsg);
    })
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Informations Soutien`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setColor(`${color}`)
            .setTimestamp()
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter("Informations Soutien", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .addField('<:Support:785486768719265813> Soutien:', `[\`soutien config\`](https://discord.gg/WHPSxcQkVk) ・ Configuration du système de soutien\n[\`soutien count\`](https://discord.gg/WHPSxcQkVk) ・ Montrez combien de membres vous soutiennent`)
        message.channel.send(embed)
    }
    if (config) {
        const msg = await message.channel.send(lang.loading)
        let reac1
        let reac2
        let reac4
        let reac6;
        reac1 = await msg.react("1️⃣");
        reac2 = await msg.react("2️⃣");
        reac6 = await msg.react("3️⃣");
        reac4 = await msg.react("❌");
        const isOn = await this.connection.query(`SELECT soutienOn FROM guildConfig WHERE guildId = '${message.guild.id}'`)
        let isOnS
        if (isOn[0][0].soutienOn == '0') { isOnS = '<:778348495157329930:781189773645578311>' }
        if (isOn[0][0].soutienOn == '1') { isOnS = '<:778348494712340561:781153837850820619>' }


        const embed = new Discord.MessageEmbed()
            .setTitle(lang.soutien.title)
            .setDescription(lang.soutien.description(soutienId, soutienMsg, isOnS, message.guild))
            .setTimestamp()
            .setColor(`${color}`)
            .setFooter(client.user.username);
        msg.edit(" ", embed)
        const data_res = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
        data_res.on("collect", async (reaction) => {
            reaction.users.remove(message.author);
            if (reaction.emoji.name == "1️⃣") {
                let question = await message.channel.send(lang.soutien.roleQ)
                const filter = m => message.author.id === m.author.id;
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                }).then(async (collected) => {


                    collected.first().delete()
                    question.delete()
                    if (collected.first().content.toLowerCase() == "cancel") {
                        return message.channel.send(lang.cancel);
                    }
                    const response = collected.first().mentions.roles.first();
                    const channelId = response.id;
                    await this.connection.query(`
                        UPDATE guildConfig SET soutienId = '${channelId}' WHERE guildId = '${message.guild.id}'
                    `).then(() => {
                        updateEmbed()

                        message.channel.send(lang.soutien.success(response))
                        StateManager.emit('soutienIdUpdate', message.guild.id, channelId)
                        soutienId.set(message.guild.id, channelId)

                    }).catch((error) => {
                        console.log(error)
                        return message.channel.send(lang.soutien.errorAdd(response))
                    })
                }).catch((error) => {
                    console.log(error)
                    message.reply(lang.soutien.errorTimeOut)
                })
            } else if (reaction.emoji.name == "2️⃣") {

                let question = await message.channel.send(lang.soutien.msgQ)
                const filter = m => message.author.id === m.author.id;
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000,
                }).then(async (collected) => {


                    collected.first().delete()
                    question.delete()
                    if (collected.first().content.toLowerCase() == "cancel") {
                        return message.channel.send(lang.cancel);
                    }
                    let response = collected.first().content;

                    await this.connection.query(`
                        UPDATE guildConfig SET soutienMsg = ${SqlString.escape(response)} WHERE guildId = '${message.guild.id}'
                    `).then(async () => {
                        updateEmbed()
                        message.channel.send(lang.soutien.successEditRl);
                        message.channel.send(`${response}`);
                        StateManager.emit('soutienMsgUpdate', message.guild.id, response)
                        soutienMsg.set(message.guild.id, response)
                        let question = await message.channel.send(lang.soutien.rmAllRlQ)
                        const filter = m => message.author.id === m.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 120000,
                        }).then(async (collected) => {


                            collected.first().delete()
                            question.delete()
                            const response = collected.first().content.toLowerCase();
                            const rlId = soutienId.get(message.guild.id)
                            if (collected.first().content.toLowerCase() == "cancel") {
                                return message.channel.send(lang.cancel);
                            } else if (response == lang.yes) {
                                try {
                                    const Role = message.guild.roles.cache.get(rlId);
                                    Role.members.forEach((member) => { // Looping through the members of Role.
                                        setTimeout(() => {
                                            member.roles.remove(Role); // Removing the Role.
                                        }, 1000);
                                    });
                                }

                                catch (err) {
                                    console.log(err)
                                    return message.channel.send(lang.soutien.errorRmAllRl(rlId))
                                }
                            } else if (response == lang.no) {
                                return message.channel.send(lang.soutien.successNo)
                            }
                            else if (collected.first().content.toLowerCase() != lang.no || collected.first().content.toLowerCase() != lang.yes) {
                                return message.channel.send(lang.error.NoYes)
                            }
                            message.channel.send(lang.soutien.removingRl(rlId))
                        }).catch((error) => {
                            console.log(error)
                            message.reply(lang.soutien.errorTimeOut2M)
                        })
                    }).catch((error) => {
                        console.log(error)
                        message.channel.send(lang.soutien.errorChMsg);
                        return message.channel.send(`${response}`);
                    })
                }).catch((error) => {
                    console.log(error)
                    message.reply(lang.soutien.errorTimeOut2M)
                })

            } else if (reaction.emoji.name == "3️⃣") {
                let question = await message.channel.send(lang.soutien.enableQ)
                const filter = m => message.author.id === m.author.id;
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 120000,
                }).then(async (collected) => {
                    collected.first().delete()
                    question.delete()
                    if (collected.first().content.toLowerCase() == "cancel") {
                        return message.channel.send(lang.cancel);
                    } else if (collected.first().content.toLowerCase() == lang.yes) {
                        updateEmbed()

                        await this.connection.query(`
                        UPDATE guildConfig SET soutienOn = '1' WHERE guildId = '${message.guild.id}'
                        `).then(() => {
                            updateEmbed()

                            message.channel.send(lang.soutien.successEnable);
                            StateManager.emit('soutienOn', message.guild.id, '1')
                            soutienOn.set(message.guild.id, true)
                        }).catch((error) => {
                            console.log(error)
                            return message.channel.send(lang.soutien.errorEnable);

                        })
                    } else if (collected.first().content.toLowerCase() == lang.no) {


                        await this.connection.query(`
                        UPDATE guildConfig SET soutienOn = '0' WHERE guildId = '${message.guild.id}'
                        `).then(() => {
                            updateEmbed()
                            message.channel.send(lang.soutien.successDisable);
                            StateManager.emit('soutienOn', message.guild.id, '0')
                            soutienOn.set(message.guild.id, false)
                        }).catch((error) => {
                            console.log(error)
                            return message.channel.send();

                        })
                    } else if (collected.first().content.toLowerCase() != lang.no || collected.first().content.toLowerCase() != lang.yes) {
                        return message.channel.send(lang.error.NoYes)
                    }

                }).catch((error) => {
                    console.log(error)
                    message.reply(lang.soutien.errorTimeOut2M)
                })
            }


            else if (reaction.emoji.name == "❌") {
                updateEmbed()
                await data_res.stop()
                return await msg.delete()
            }

        });
        data_res.on('end', collected => {
            message.channel.send(lang.cancel)
        });
        function updateEmbed() {
            embed.setDescription(lang.soutien.description(soutienId, soutienMsg, isOnS, message.guild))
            msg.edit(embed)
        }
    } else if (count) {
        const rlId = soutienId.get(message.guild.id);
        const Role = message.guild.roles.cache.get(rlId);
        const count = Role.members.size;
        let Embed = new Discord.MessageEmbed()
            .setTitle("<:Support:785486768719265813> __Soutient__")
            .setDescription(lang.soutien.descriptionCount(count))
            .setColor(`${color}`)
            .setFooter(`${client.user.username}`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setTimestamp()
        message.channel.send(Embed)

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
