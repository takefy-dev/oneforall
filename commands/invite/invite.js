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

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;

        const config = args[0] === "config";
        const color = guildData.get('color')
        let userData;
        if (!args[0]) {
            userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`)
            let count = userData.get('invite');
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
            userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${member.user.id}`)
            let count = userData.get('invite');
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
            const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
            if (!guildData.isGuildOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
            const msg = await message.channel.send(lang.loading)
            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌', '✅']
            for (const em of emojis) await msg.react(em)
            const invite = guildData.get('invite');
            let tempInvite = client.functions.copyObject(invite);
            let enableEmoji = () => {
                return tempInvite.enable ? '<:778348494712340561:781153837850820619>' : '<:778348495157329930:781189773645578311>'
            }
            const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };

            const embed = new Discord.MessageEmbed()
                .setTitle(lang.invite.titleConfig)
                .setDescription(lang.invite.descConfig(tempInvite.id, message.guild, enableEmoji(), tempInvite.message))
                .setTimestamp()
                .setColor(`${color}`)
                .setFooter(client.user.username);
            msg.edit(" ", embed).then(async m => {
                const collector = m.createReactionCollector(filter, {time: 900000});
                collector.on('end', () => {
                    m.delete()
                })
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === emojis[0]) {
                        message.channel.send(lang.invite.chQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (msg.content.toLowerCase() === 'cancel') {
                                        await msg.delete()
                                        await mp.delete()
                                        return message.channel.send(lang.cancel);
                                    }
                                    const channel = msg.mentions.channels.first() || message.guild.channels.cache.get(msg.content);
                                    if (channel.type !== 'text') return message.channel.send(`Invalide type of channel`)
                                    tempInvite.id = channel.id;
                                    await msg.delete()
                                    await mp.delete()
                                    updateEmbed()
                                });
                        })
                    }
                    if (r.emoji.name === emojis[1]) {
                        message.channel.send(lang.invite.msgQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(async cld => {
                                    let msg = cld.first();
                                    if (msg.content.toLowerCase() === 'cancel') {
                                        await msg.delete()
                                        await mp.delete()
                                        return message.channel.send(lang.cancel);
                                    }

                                    tempInvite.message = msg.content;
                                    await msg.delete()
                                    await mp.delete()
                                    updateEmbed()
                                });
                        })
                    }
                    if (r.emoji.name === emojis[2]) {
                        const invitedHelp = '{invitedTag} ・ Sert à afficher le tag du membre qui a été invité'
                        const inviterHelp = "{inviterTag} ・ Sert à afficher le tag du membre qui a invité"
                        const inviterMention = "{inviterMention} ・ Sert à mentionner le membre qui a invité"
                        const invitedMention = "{invitedMention} ・ Sert à mentionner le membre qui a été invité"
                        const accountCreate = "{creation} ・ Sert à afficher quand le membre qui a été invité a créé son compte"
                        const countHelp = "{count} ・ Sert à afficher le nombre d'invitation que l'inviteur possède"
                        const fakeHelp = "{fake}  ・ Sert à afficher le nombre d'invitation fake que l'inviteur possède"
                        const leaveHelp = "{leave}  ・ Sert à afficher le nombre d'invitation leave que l'inviteur possède"
                        const totalMemberHelp = "{memberTotal} ・ Sert à afficher le nombre total de membres sur le serveur"
                        const space = "{space} ・ Sert à faire un retour à la ligne"
                        const help = new Discord.MessageEmbed()
                            .setTitle(`Help`)
                            .setDescription(lang.invite.helpDesc(invitedHelp, inviterHelp, invitedMention, inviterMention, accountCreate, countHelp, fakeHelp, leaveHelp, totalMemberHelp, space))
                            .setTimestamp()
                            .setColor(`${color}`)
                            .setFooter(client.user.username);
                        message.channel.send(help)
                    }
                    if (r.emoji.name === emojis[3]) {
                        tempInvite.enable = !tempInvite.enable;
                        updateEmbed()
                    }
                    if (r.emoji.name === emojis[4]) {
                        tempInvite = {};
                        collector.stop()

                    }
                    if (r.emoji.name === emojis[5]) {
                        guildData.set('invite', tempInvite).save().then(() => {
                            message.channel.send(`Configuration saved`)
                        })
                    }
                })
            })

            function updateEmbed() {
                embed.setDescription(lang.invite.descConfig(tempInvite.id, message.guild, enableEmoji(), tempInvite.message))
                msg.edit(embed)
            }
        } else if (args[0] === "sync") {
            const newInv = await message.guild.fetchInvites()
            await message.guild.members.fetch()
            const invitesCount = new Map();
            for (const [code, invite] of newInv) {
                guildData.cachedInv.set(code, invite)
                const member = await message.guild.members.resolve(invite.inviter.id)
                if (member && invite) {
                    if (!invitesCount.has(member.id)) invitesCount.set(member.id, 0)
                    let amount = invitesCount.get(member.id);
                    invitesCount.set(member.id, amount += invite.uses)
                }

            }
            for (const [id, count] of invitesCount) {
                userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${id}`).set('invite', {join: count, leave: 0, fake: 0, bonus: 0}).save()
            }
            invitesCount.clear()

            message.channel.send(lang.invite.syncSuccess)
        }

    }
}
