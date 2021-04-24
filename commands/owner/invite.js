const inviteChannel = new Map();
const inviteMsg = new Map();
const inviteOn = new Map();
const guildOwner = new Map();
const SqlString = require('sqlstring');
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'invite',
            description: "Setup the invite system or show the number of invitation of a member | Configurer le system d'invitation ou afficher le nombre d'invitation d'un membre",
            usage: '!invite [config / mention/ id]',
            category: 'owners',
            clientPermissions: ['ADD_REACTIONS'],
            aliases: ['welcome'],
            cooldown: 4

        });
    }

    async run(client, message, args) {

        const lang = client.lang(message.guild.lang)

        const config = args[0] === "config";
        const color = message.guild.color
        const help = args[0] === "help";
        if (help) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`Informations Invitations`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
                .setColor(`${color}`)
                .setTimestamp()
                .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
                .setFooter("Informations Invitations", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
                .addField('<:invite_oeople:785494680904138763> Invitations:', `[\`invite config\`](https://discord.gg/WHPSxcQkVk) ・ Setup du système d'invitations\n[\`invite mention/id\`](https://discord.gg/WHPSxcQkVk) ・ Voyez combien d'invitations un utilisateur possède `)
            message.channel.send(embed)
        }
        if (!args[0]) {

            message.guild.fetchInvites().then(invites => {
                    const userInvites = invites.array().filter(o => o.inviter.id === message.author.id);
                    let userInviteCount = 0;

                    for (let i = 0; i < userInvites.length; i++) {
                        let invite = userInvites[i];
                        userInviteCount += invite['uses'];
                    }
                    let inv = "invite";
                    if (userInviteCount > 1) {
                        inv = 'invites'
                    }
                    const embed = new Discord.MessageEmbed()
                        .setDescription(lang.invite.countDesc(message.author, userInviteCount, inv))
                        .setColor(`${color}`)
                        .setTimestamp()
                        .setFooter(client.user.tag)
                    message.reply(embed);
                }
            )
        } else if (message.mentions.users.first() || !isNaN(args[0])) {
            const user = await message.mentions.users.first() || await client.users.fetch(args[0]).catch(async err => {
                return await message.channel.send(lang.ban.noBan).then(mp => mp.delete({timeout: 4000}));
            })
            message.guild.fetchInvites().then(invites => {
                    const userInvites = invites.array().filter(o => o.inviter.id === user.id);
                    let userInviteCount = 0;

                    for (let i = 0; i < userInvites.length; i++) {
                        let invite = userInvites[i];
                        userInviteCount += invite['uses'];
                    }
                    let inv = "invite";
                    if (userInviteCount > 1) {
                        inv = 'invites'
                    }
                    const embed = new Discord.MessageEmbed()
                        .setDescription(lang.invite.countDesc(user, userInviteCount, inv))
                        .setColor(`${color}`)
                        .setTimestamp()
                        .setFooter(client.user.tag)
                    message.channel.send(embed);
                }
            )
        }

        if (config) {
            if (!message.guild.isGuildOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)


            const msg = await message.channel.send(lang.loading)

            await msg.react("1️⃣");
            await msg.react("2️⃣");
            await msg.react("3️⃣");
            await msg.react("4️⃣");
            await msg.react("❌");
            await msg.react('✅')

            inviteChannel.set(message.guild.id, message.guild.config.inviteChannel)
            inviteMsg.set(message.guild.id, message.guild.config.inviteMessage)

            const isOn = message.guild.config.inviteOn
            let isOnS;
            if (isOn) {
                isOnS = '<:778348495157329930:781189773645578311>'
            }
            if (!isOn) {
                isOnS = '<:778348494712340561:781153837850820619>'
            }

            const embed = new Discord.MessageEmbed()
                .setTitle(lang.invite.titleConfig)
                .setDescription(lang.invite.descConfig(inviteChannel, message.guild, isOnS, inviteMsg))
                .setTimestamp()
                .setColor(`${color}`)
                .setFooter(client.user.username);
            msg.edit(" ", embed)
            const data_res = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
            data_res.on("collect", async (reaction) => {
                await reaction.users.remove(message.author);

                if (reaction.emoji.name === "1️⃣") {
                    let question = await message.channel.send(lang.invite.chQ)
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
                        const response = collected.first().mentions.channels.first();
                        const channelId = response.id;
                        inviteChannel.set(message.guild.id, channelId)
                        updateEmbed()

                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.invite.timeout)
                    })
                } else if (reaction.emoji.name === "2️⃣") {
                    let question = await message.channel.send(lang.invite.msgQ)
                    const filter = m => message.author.id === m.author.id;
                    message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 120000,
                    }).then(async (collected) => {
                        await collected.first().delete()
                        question.delete()
                        if (collected.first().content.toLowerCase() === "cancel") {
                            return message.channel.send(lang.cancel);
                        }
                        let response = collected.first().content;


                        message.channel.send(lang.invite.successMsg);
                        message.channel.send(`${response}`);
                        inviteMsg.set(message.guild.id, response)
                        updateEmbed()

                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.invite.timeout2M)
                    })
                } else if (reaction.emoji.name === "3️⃣") {
                    const invitedHelp = '${invited} ・ Sert à afficher le membre qui a été invité'
                    const inviterHelp = "${inviter} ・ Sert à afficher le membre qui a invité"
                    const countHelp = "${count} ・ Sert à afficher le nombre d'invitation que l'inviteur possède"
                    const totalMemberHelp = "${memberTotal} ・ Sert à afficher le nombre total de membres sur le serveur"
                    const space = "${space} ・ Sert à faire un retour à la ligne"
                    const help = new Discord.MessageEmbed()
                        .setTitle(`Help`)
                        .setDescription(lang.invite.helpDesc(invitedHelp, inviterHelp, countHelp, totalMemberHelp, space))
                        .setTimestamp()
                        .setColor(`${color}`)
                        .setFooter(client.user.username);
                    message.channel.send(help)
                } else if (reaction.emoji.name === "4️⃣") {
                    let question = await message.channel.send(lang.invite.enableQ)
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


                            inviteOn.set(message.guild.id, true)
                            updateEmbed()


                        } else if (collected.first().content.toLowerCase() === lang.no) {


                            inviteOn.set(message.guild.id, false)
                            updateEmbed()


                        } else if (collected.first().content.toLowerCase() !== lang.no || collected.first().content.toLowerCase() !== lang.yes) {
                            return message.channel.send(lang.error.YesNo)
                        }

                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.invite.timeout2M)
                    })
                } else if (reaction.emoji.name === "❌") {
                    await data_res.stop()
                    return await msg.delete()
                } else if (reaction.emoji.name === '✅') {
                    await message.guild.updateInviteConfig(inviteChannel.get(message.guild.id), inviteMsg.get(message.guild.id), inviteOn.get(message.guild.id)).then(res => {
                        message.channel.send(`Configuration save`);


                        return msg.delete()
                    })
                }

            });
            data_res.on('end', (collected, reason) => {
                inviteChannel.delete(message.guild.id)
                inviteMsg.delete(message.guild.id)
                inviteOn.delete(message.guild.id)
                if(reason === "time"){
                    message.channel.send(lang.error.timeout)

                }
            });

            function updateEmbed() {
                embed.setDescription(lang.invite.descConfig(inviteChannel, message.guild, isOnS, inviteMsg))
                msg.edit(embed)
            }
        }

    }
}