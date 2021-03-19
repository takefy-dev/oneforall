const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
var checkOwner = require('../../function/check/botOwner');
const inviteChannel = new Map();
const inviteMsg = new Map();
const inviteOn = new Map();
const guildOwner = new Map();
const SqlString = require('sqlstring');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'invite',
    description: "Setup the invite system or show the number of invitation of a member | Configurer le system d'invitation ou afficher le nombre d'invitation d'un membre",
    // Optionnals :
    usage: '!invite [config / mention/ id]',
    category: 'owners',
    tags: ['guildOnly'],
    clientPermissions : ['ADD_REACTIONS'],
    aliases: ['welcome'],
    cooldown: 5
}, async (client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)
    
    this.connection = StateManager.connection;
    const config = args[0] == "config";
    const color = guildEmbedColor.get(message.guild.id);
    const help = args[0] == "help";
    if(help) {
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
            var userInviteCount = 0;
         
            for (var i = 0; i < userInvites.length; i++) {
                var invite = userInvites[i];
                userInviteCount += invite['uses'];
            }
            let inv = "invite";
            if(userInviteCount > 1){
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
    }else if(message.mentions.users.first() || !isNaN(args[0])){
        const user = await message.mentions.users.first() || await client.users.fetch(args[0]).catch(async err => {
            return await message.channel.send(lang.ban.noBan).then(mp => mp.delete({ timeout: 4000 }));
        })
        console.log(user)
        message.guild.fetchInvites().then(invites => {
            const userInvites = invites.array().filter(o => o.inviter.id === user.id);
            var userInviteCount = 0;
         
            for (var i = 0; i < userInvites.length; i++) {
                var invite = userInvites[i];
                userInviteCount += invite['uses'];
            }
            let inv = "invite";
            if(userInviteCount > 1){
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
        let owner = message.guild.ownerID;
    
        if(client.BotPerso){
            const config = require('../../config.json')
            owner = config.owner
        }
    
        if ((!client.isGuildOwner(message.guild.id, message.author.id) || owner !== message.author.id) && !client.isOwner(message.author.id))   return message.channel.send(lang.error.notListOwner)


        const msg = await message.channel.send(lang.loading)
        let reac1
        let reac2
        let reac3
        let reac4
        let reac5
        reac1 = await msg.react("1️⃣");
        reac2 = await msg.react("2️⃣");
        reac3 = await msg.react("3️⃣");
        reac5 = await msg.react("4️⃣");
        reac4 = await msg.react("❌");
        await this.connection.query(`SELECT inviteChannel FROM guildConfig WHERE guildId = '${message.guild.id}'`).then((result) => {
            inviteChannel.set(message.guild.id, result[0][0].inviteChannel);
        })

        await this.connection.query(`SELECT inviteMessage FROM guildConfig WHERE guildId = '${message.guild.id}'`).then((result) => {
            inviteMsg.set(message.guild.id, result[0][0].inviteMessage);
        })
        const isOn = await this.connection.query(`SELECT inviteOn FROM guildConfig WHERE guildId = '${message.guild.id}'`)
        let isOnS;
        if (isOn[0][0].inviteOn == '0') { isOnS = '<:778348495157329930:781189773645578311>' }
        if (isOn[0][0].inviteOn == '1') { isOnS = '<:778348494712340561:781153837850820619>' }
       
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.invite.titleConfig)
            .setDescription(lang.invite.descConfig(inviteChannel, message.guild, isOnS, inviteMsg))
            .setTimestamp()
            .setColor(`${color}`)
            .setFooter(client.user.username);
        msg.edit(" ", embed)
        const data_res = msg.createReactionCollector((reaction, user) => user.id === message.author.id);
        data_res.on("collect", async (reaction) => {
            reaction.users.remove(message.author);

            if (reaction.emoji.name == "1️⃣") {
                updateEmbed()
                let question = await message.channel.send(lang.invite.chQ)
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
                    const response = collected.first().mentions.channels.first();
                    const channelId = response.id;
                    await this.connection.query(`
                        UPDATE guildConfig SET inviteChannel = '${channelId}' WHERE guildId = '${message.guild.id}'
                    `).then(() => {
                        message.channel.send(lang.invite.successCh(response))
                        StateManager.emit('inviteChannelUpdate', message.guild.id, channelId)
                        inviteChannel.set(message.guild.id, channelId)
                        updateEmbed()

                    }).catch((error) => {
                        console.log(error)
                        return message.channel.send(lang.invite.errorCh(response))
                    })
                }).catch((error) => {
                    console.log(error)
                    message.reply(lang.invite.timeout)
                })
            } else if (reaction.emoji.name == "2️⃣") {
                let question = await message.channel.send(lang.invite.msgQ)
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
                        UPDATE guildConfig SET inviteMessage = ${SqlString.escape(response)} WHERE guildId = '${message.guild.id}'
                    `).then(() => {
                        message.channel.send(lang.invite.successMsg);
                        message.channel.send(`${response}`);
                        StateManager.emit('welcomeMsgUpdate', message.guild.id, response)
                        inviteMsg.set(message.guild.id, response)
                        updateEmbed()

                    }).catch((error) => {
                        console.log(error)
                        message.channel.send(lang.invite.errorMsg);
                        return message.channel.send(`${response}`);
                    })
                }).catch((error) => {
                    console.log(error)
                    message.reply(lang.invite.timeout2M)
                })
            } else if (reaction.emoji.name == "3️⃣") {
                const invitedHelp = '${invited} ・ Sert à afficher le membre qui a été invité'
                const inviterHelp = "${inviter} ・ Sert à afficher le membre qui a invité"
                const countHelp = "${count} ・ Sert à afficher le nombre d'invitation que l'inviteur possède"
                const totalMemberHelp = "${memberTotal} ・ Sert à afficher le nombre total de membres sur le serveur"
                const space = "${space} ・ Sert à faire un retour à la ligne"
                const help = new Discord.MessageEmbed()
                    .setTitle(lang.invite.title)
                    .setDescription(lang.invite.helpDesc(invitedHelp, inviterHelp, countHelp, totalMemberHelp, space))
                    .setTimestamp()
                    .setColor(`${color}`)
                    .setFooter(client.user.username);
                message.channel.send(help)
            } else if (reaction.emoji.name == "4️⃣") {
                let question = await message.channel.send(lang.invite.enableQ)
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
                        

                        await this.connection.query(`
                        UPDATE guildConfig SET inviteOn = '1' WHERE guildId = '${message.guild.id}'
                        `).then(() => {
                       

                            message.channel.send(lang.invite.successEnable);
                            StateManager.emit('inviteOn', message.guild.id, '1')
                            inviteOn.set(message.guild.id, true)
                            updateEmbed()

                        }).catch((error) => {
                            console.log(error)
                            return message.channel.send(lang.invite.errorEnable);

                        })
                    } else if (collected.first().content.toLowerCase() == lang.no) {


                        await this.connection.query(`
                        UPDATE guildConfig SET inviteOn = '0' WHERE guildId = '${message.guild.id}'
                        `).then(() => {
                            message.channel.send(lang.invite.successDisable);
                            StateManager.emit('inviteOn', message.guild.id, '0')
                            inviteOn.set(message.guild.id, false)
                            updateEmbed()

                        }).catch((error) => {
                            console.log(error)
                            return message.channel.send(lang.invite.errorDisable);

                        })
                    } else if (collected.first().content.toLowerCase() != lang.no || collected.first().content.toLowerCase() != lang.yes) {
                        return message.channel.send(lang.error.YesNo)
                    }

                }).catch((error) => {
                    console.log(error)
                    message.reply(lang.invite.timeout2M)
                })
            }

            else if (reaction.emoji.name == "❌") {
                await data_res.stop()
                return await msg.delete()
            }

        });
        data_res.on('end', collected => {
            inviteChannel.delete(message.guild.id)
            inviteMsg.delete(message.guild.id)
            inviteOn.delete(message.guild.id)
            guildOwner.delete(message.guild.id)
            message.channel.send(lang.error.timeout)
        });
        function updateEmbed() {
            embed.setDescription(lang.invite.descConfig(inviteChannel, message.guild, isOnS, inviteMsg))
            msg.edit(embed)
        }
    }

});

embedsColor(guildEmbedColor);
StateManager.on('ownerUpdate', (guildId, data) =>{
    guildOwner.set(guildId, data);
  })
  StateManager.on('ownerFetched', (guildId, data) =>{
    guildOwner.set(guildId, data);
  
  })
langF(guildLang);
