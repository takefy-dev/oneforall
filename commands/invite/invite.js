const inviteChannel = new Map();
const inviteMsg = new Map();
const inviteOn = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'invite',
            description: "Setup the invite system or show the number of invitation of a member | Configurer le system d'invitation ou afficher le nombre d'invitation d'un membre",
            usage: 'invite [config / mention/ id]',
            category: 'invite',
            clientPermissions: ['ADD_REACTIONS'],
            aliases: ['welcome'],
            cooldown: 4

        });
    }

    async run(client, message, args) {

        const lang = client.lang(message.guild.lang)

        const config = args[0] === "config";
        const color = message.guild.color

        if (!args[0]) {

            let count = message.member.invite;
            let inv = "invite";
            if (count.join - count.leave > 1) {
                inv = 'invites'
            }
            const embed = new Discord.MessageEmbed()
                .setDescription(`${lang.invite.countDesc(message.author.tag || message.author.username, count.join - count.leave > 0 ? count.join - count.leave : 0, inv)}\n (__${count.join}__ join, __${count.leave}__ leave, __${count.fake}__ fake, __${count.bonus}__ bonus)`)
                .setColor(`${color}`)
                .setTimestamp()
                .setFooter(client.user.tag)
            message.reply(embed);
        } else if (message.mentions.members.first() || !isNaN(args[0])) {
            const member = await message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(async err => {
            })
            let count = member.invite;
            let inv = "invite";
            if (count.join - count.leave > 1) {
                inv = 'invites'
            }
            const embed = new Discord.MessageEmbed()
                .setDescription(`${lang.invite.countDesc(member.user.tag || member.user.username, count.join - count.leave > 0 ? count.join - count.leave : 0, inv)}\n (__${count.join}__ join, __${count.leave}__ leave, __${count.fake}__ fake, __${count.bonus}__ bonus)`)
                .setColor(`${color}`)
                .setTimestamp()
                .setFooter(client.user.tag)
            message.reply(embed);
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
            let isOnS = '<:778348494712340561:781153837850820619>'
            if (!isOn) {
                isOnS = '<:778348495157329930:781189773645578311>'
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
                    const invitedHelp = '${invitedTag} ・ Sert à afficher le tag du membre qui a été invité'
                    const inviterHelp = "${inviterTag} ・ Sert à afficher le tag du membre qui a invité"
                    const inviterMention = "${inviterMention} ・ Sert à mentionner le membre qui a invité"
                    const invitedMention = "${invitedMention} ・ Sert à mentionner le membre qui a été invité"
                    const accountCreate = "${creation} ・ Sert à afficher quand le membre qui a été invité a créé son compte"
                    const countHelp = "${count} ・ Sert à afficher le nombre d'invitation que l'inviteur possède"
                    const fakeHelp = "${fake}  ・ Sert à afficher le nombre d'invitation fake que l'inviteur possède"
                    const leaveHelp = "${leave}  ・ Sert à afficher le nombre d'invitation leave que l'inviteur possède"
                    const totalMemberHelp = "${memberTotal} ・ Sert à afficher le nombre total de membres sur le serveur"
                    const space = "${space} ・ Sert à faire un retour à la ligne"
                    const help = new Discord.MessageEmbed()
                        .setTitle(`Help`)
                        .setDescription(lang.invite.helpDesc(invitedHelp, inviterHelp, invitedMention, inviterMention, accountCreate, countHelp, fakeHelp, leaveHelp, totalMemberHelp, space))
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

                            isOnS = '<:778348494712340561:781153837850820619>'
                            inviteOn.set(message.guild.id, true)
                            updateEmbed()


                        } else if (collected.first().content.toLowerCase() === lang.no) {

                            isOnS = '<:778348495157329930:781189773645578311>'
                            inviteOn.set(message.guild.id, false)
                            updateEmbed()


                        } else if (collected.first().content.toLowerCase() !== lang.no || collected.first().content.toLowerCase() !== lang.yes) {
                            return message.channel.send(lang.error.YesNo)
                        }

                    }).catch((error) => {
                        console.log(error)
                        message.reply(lang.invite.timeout2M)
                    })
                }

                else if (reaction.emoji.name === "❌") {
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
                if (reason === "time") {
                    message.channel.send(lang.error.timeout)

                }
            });

            function updateEmbed() {
                embed.setDescription(lang.invite.descConfig(inviteChannel, message.guild, isOnS, inviteMsg))
                msg.edit(embed)
            }
        } else if (args[0] === "sync") {
            console.time("inv")
            const newInv = await message.guild.fetchInvites()
            await message.guild.members.fetch()
            const invitesCount = new Map();
            for (const [code, invite] of newInv) {
                message.guild.cachedInv.set(code, invite)
                const member = await message.guild.members.cache.get(invite.inviter.user.id)
                if (member && invite) {
                    if(!invitesCount.has(member.id)) invitesCount.set(member.id, 0)
                    let amount = invitesCount.get(member.id);
                    invitesCount.set(member.id, amount += invite.uses)


                }

            }
            for (const [id, count] of invitesCount) {
                const member = message.guild.members.cache.get(id);
                member.updateInvite = {join: count, leave: 0, fake: 0, bonus: 0};
            }
            invitesCount.clear()
            console.timeEnd("inv")

            message.channel.send(lang.invite.syncSuccess)
        }

    }
}
