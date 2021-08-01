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
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;

        const color = guildData.get('color')
        const config = args[0] === "config";
        const count = args[0] === "count"
        const tempConfig = client.functions.copyObject(guildData.get('soutien'))
        if (config) {
            const msg = await message.channel.send(lang.loading)
            const emojis = ["1️⃣","2️⃣","3️⃣","❌", "✅"]
            for(const em of emojis) await msg.react(em);
            let enableEmoji = () => {
                return tempConfig.enable ? '<:778348494712340561:781153837850820619>' : '<:778348495157329930:781189773645578311>'
            }


            const embed = new Discord.MessageEmbed()
                .setTitle(lang.soutien.title)
                .setDescription(lang.soutien.description(tempConfig.roleId, tempConfig.message, enableEmoji(), message.guild))
                .setTimestamp()
                .setColor(`${color}`)
                .setFooter(client.user.username);
            msg.edit({content:null, embeds: [embed]})
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
                        const roleId = response.id;

                        message.channel.send(lang.soutien.success(response))
                        tempConfig.roleId = roleId;
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


                        message.channel.send(lang.soutien.successEditRl);
                        message.channel.send(`${response}`);
                        tempConfig.message = response
                        updateEmbed()


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
                        })
                    })

                } else if (reaction.emoji.name === "3️⃣") {

                      tempConfig.enable = !tempConfig.enable;
                      updateEmbed()

                } else if (reaction.emoji.name === "❌") {

                    await data_res.stop('cancel')
                    return await msg.delete()
                } else if (reaction.emoji.name === "✅") {
                    await msg.delete()
                    guildData.set('soutien', tempConfig).save();
                }

            });
            data_res.on('end', (collected, reason) => {
                if(reason === 'cancel') message.channel.send(lang.cancel)

            });

            function updateEmbed() {
                embed.setDescription(lang.soutien.description(tempConfig.roleId, tempConfig.message, enableEmoji()))
                msg.edit({embeds: [embed]})
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