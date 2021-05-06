const soutienId = new Map();
const soutienMsg = new Map();
const soutienOn = new Map();
let SqlString = require('sqlstring');
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'soutien',
            description: 'Show the menu for the soutient | Affiche le menu pour le soutient',
            usage: 'soutien <config>',
            clientPermissions: ['ADD_REACTIONS'],
            category: 'owners',
            guildOwnerOnly: true,
            cooldown: 2

        });
    }

    async run(client, message, args) {
        if (!client.botperso) return;
        const lang = client.lang(message.guild.lang)

        const color = message.guild.color
        const config = args[0] === "config";
        const count = args[0] === "count"


        soutienId.set(message.guild.id, message.guild.config.soutienId);

        soutienMsg.set(message.guild.id, message.guild.config.soutienMsg);
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

            await msg.react("1️⃣");
            await msg.react("2️⃣");
            await msg.react("3️⃣");
            await msg.react("❌");
            await msg.react('✅')
            const isOn = message.guild.config.soutienOn
            let isOnS
            if (!isOn) {
                isOnS = '<:778348495157329930:781189773645578311>'
            }
            if (isOn) {
                isOnS = '<:778348494712340561:781153837850820619>'
            }


            const embed = new Discord.MessageEmbed()
                .setTitle(lang.soutien.title)
                .setDescription(lang.soutien.description(soutienId, soutienMsg, isOnS, message.guild))
                .setTimestamp()
                .setColor(`${color}`)
                .setFooter(client.user.username);
            msg.edit(" ", embed)
            const data_res = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
            data_res.on("collect", async (reaction) => {
                await reaction.users.remove(message.author);
                if (reaction.emoji.name === "1️⃣") {
                    let question = await message.channel.send(lang.soutien.roleQ)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                    }).then(async (collected) => {


                        await collected.first().delete()
                        question.delete()
                        if (collected.first().content.toLowerCase() === "cancel") {
                            return message.channel.send(lang.cancel);
                        }
                        const response = collected.first().mentions.roles.first();
                        const channelId = response.id;

                        message.channel.send(lang.soutien.success(response))
                        soutienId.set(message.guild.id, channelId)
                        updateEmbed()


                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.soutien.errorTimeOut)
                    })
                } else if (reaction.emoji.name === "2️⃣") {

                    let question = await message.channel.send(lang.soutien.msgQ)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 120000,
                    }).then(async (collected) => {


                        await collected.first().delete()
                        if (collected.first().content.toLowerCase() === "cancel") {
                            return message.channel.send(lang.cancel);
                        }
                        let response = collected.first().content;


                        updateEmbed()
                        message.channel.send(lang.soutien.successEditRl);
                        message.channel.send(`${response}`);
                        soutienMsg.set(message.guild.id, response)
                        let question = await message.channel.send(lang.soutien.rmAllRlQ)
                        const filter = m => message.author.id === m.author.id;
                        message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 120000,
                        }).then(async (collected) => {


                            await collected.first().delete()
                            question.delete()
                            const response = collected.first().content.toLowerCase();
                            const rlId = soutienId.get(message.guild.id)
                            if (collected.first().content.toLowerCase() === "cancel") {
                                return message.channel.send(lang.cancel);
                            } else if (response === lang.yes) {
                                try {
                                    const Role = message.guild.roles.cache.get(rlId);
                                    Role.members.forEach((member) => { // Looping through the members of Role.
                                        setTimeout(() => {
                                            member.roles.remove(Role); // Removing the Role.
                                        }, 1000);
                                    });
                                } catch (err) {
                                    console.log(err)
                                    return message.channel.send(lang.soutien.errorRmAllRl(rlId))
                                }
                            } else if (response === lang.no) {
                                return message.channel.send(lang.soutien.successNo)
                            } else if (collected.first().content.toLowerCase() !== lang.no || collected.first().content.toLowerCase() !== lang.yes) {
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

                } else if (reaction.emoji.name === "3️⃣") {
                    let question = await message.channel.send(lang.soutien.enableQ)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 120000,
                    }).then(async (collected) => {
                        await collected.first().delete()
                        question.delete()
                        if (collected.first().content.toLowerCase() === "cancel") {
                            return message.channel.send(lang.cancel);
                        } else if (collected.first().content.toLowerCase() === lang.yes) {


                            message.channel.send(lang.soutien.successEnable);
                            soutienOn.set(message.guild.id, true)
                            updateEmbed()
                        } else if (collected.first().content.toLowerCase() === lang.no) {



                            message.channel.send(lang.soutien.successDisable);
                            soutienOn.set(message.guild.id, false)

                        } else if (collected.first().content.toLowerCase() !== lang.no || collected.first().content.toLowerCase() !== lang.yes) {
                            return message.channel.send(lang.error.NoYes)
                        }
                        updateEmbed()
                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.soutien.errorTimeOut2M)
                    })
                } else if (reaction.emoji.name === "❌") {

                    await data_res.stop()
                    return await msg.delete()
                }else if(reaction.emoji.name === "✅"){
                    message.guild.updateSoutien(soutienId.get(message.guild.id), soutienMsg.get(message.guild.id), soutienOn.get(message.guild.id))
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
    }
}