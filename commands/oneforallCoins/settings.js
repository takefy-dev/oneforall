const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
let embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
let langF = require('../../function/lang')
const coinSettings = new Map();
const userCoins = new Map();
module.exports = new Command({
    name: 'shop-settings',
    description: 'Setup the shop | Configurer le shop',
    // Optionnals :
    usage: '!shop-settings',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['coins-settings', 'coin-settings'],
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    cooldown: 4
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    const lang = client.lang(message.guild.lang)

    let owner = message.guild.ownerID;

    if (client.BotPerso) {
        const fs = require('fs');
        const path = './config.json';
        if (fs.existsSync(path)) {
            owner = require('../../config.json').owner;
        } else {
            owner = process.env.OWNER
        }
    }
    if (!client.isGuildOwner(message.guild.owners, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id))  return message.channel.send(lang.error.notListOwner)
    const color = message.guild.color
    const principalMsg = await message.channel.send(lang.loading)
    const emoji = ['🎥', '😶', '💌', '❌', '🌀','✅']
    for (const em of emoji) {
        await principalMsg.react(em)
    }
    const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
        dureefiltrer = response => { return response.author.id === message.author.id };
    const config = { enable: coinSettings.get(message.guild.id).enable, streamBoost: coinSettings.get(message.guild.id).streamBoost, muteDiviseur: coinSettings.get(message.guild.id).muteDiviseur, logs: coinSettings.get(message.guild.id).logs }
    const embed = new Discord.MessageEmbed()
        .setTitle(lang.coinSettings.title)
        .setDescription(lang.coinSettings.description(config.streamBoost, config.muteDiviseur, config.logs, config.enable == false ? 'Désactiver' : 'Activer'))
        .setColor(`${color}`)
        .setFooter(client.user.username)
        .setTimestamp()
    principalMsg.edit('', embed).then(async m => {
        const collector = m.createReactionCollector(filter, { time: 900000 });
        collector.on('collect', async r => {
            r.users.remove(message.author);
            if (r.emoji.name === emoji[0]) {
                message.channel.send(lang.coinSettings.streamBoostQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            let msg = cld.first();
                            if (msg.content === "cancel") return message.channel.send(lang.cancel).then(mps => mps.delete({ timeout: 4000 }))
                            if (isNaN(msg.content)) return message.channel.send(lang.coinSettings.onlyNumber).then(mp => mp.delete({ timeout: 4000 }))
                            config.streamBoost = msg.content
                            msg.delete()
                            mp.delete()
                            updateEmbed()
                        })
                })
            } else if (r.emoji.name === emoji[1]) {
                message.channel.send(lang.coinSettings.muteDiviseurQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            let msg = cld.first();
                            if (msg.content === "cancel") return message.channel.send(lang.cancel).then(mp => mp.delete({ timeout: 4000 }))
                            if (isNaN(msg.content)) return message.channel.send(lang.coinSettings.onlyNumber).then(mp => mp.delete({ timeout: 4000 }))
                            config.muteDiviseur = msg.content
                            msg.delete()
                            mp.delete()
                            updateEmbed()
                        })
                })

            } else if (r.emoji.name === emoji[2]) {
                message.channel.send(lang.coinSettings.logsQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            let msg = cld.first();

                            if (!msg.mentions.channels.first() && isNaN(msg.content) && msg.content != 'cancel') {
                                return message.channel.send(lang.coinSettings.errorNotChannel)
                            }
                            if (msg.content === "cancel") return message.channel.send(lang.cancel).then(mps => mps.delete({ timeout: 4000 }))
                            let ch;
                            if (!isNaN(msg.content)) {
                                try {
                                    ch = message.guild.channels.cache.get(msg.content)

                                } catch (err) {
                                    console.log("err", err)
                                }
                            } else if (msg.mentions.channels.first()) ch = msg.mentions.channels.first();

                            if (ch.type != 'text') await message.channel.send(lang.coinSettings.errorNotChannel).then((e) => {
                                return setTimeout(() => { e.delete() }, 2000);
                            })
                            config.logs = ch.id
                            updateEmbed()
                            setTimeout(() => {
                                msg.delete();
                                mp.delete();
                            }, 2000)
                        })
                })
            } else if (r.emoji.name === emoji[3]) {
                message.channel.send(lang.coinSettings.cancel).then((mp) => {

                    collector.stop();
                    setTimeout(async () => { mp.delete() }, 2000)
                    return principalMsg.delete();

                })
            }else if(r.emoji.name === emoji[4]){
                if(!config.enable){
                    config.enable = true;

                }else{
                    config.enable = false;
                }
                updateEmbed()

            } 
            
            
            else if (r.emoji.name === emoji[5]) {
           

                    this.connection.query(`UPDATE guildConfig SET streamBoost ='${config.streamBoost}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET muteDiviseur = '${config.muteDiviseur}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET coinsLogs = '${config.logs}' WHERE guildId = '${message.guild.id}'`)
                    this.connection.query(`UPDATE guildConfig SET coinsOn = '${config.enable ? '1' : '0'}' WHERE guildId = '${message.guild.id}'`)
                    coinSettings.set(message.guild.id, config)
                    message.channel.send(lang.coinSettings.save).then(mp => {
                        setTimeout(() => {
                            mp.delete()
                            principalMsg.delete()
                        }, 2000)
                    })
                    StateManager.emit('coinSettings', message.guild.id, config)

                



                

            }
            function updateEmbed() {
                embed.setDescription(lang.coinSettings.description(config.streamBoost, config.muteDiviseur, config.logs, config.enable == false ? 'Désactiver' : 'Activer'))
                principalMsg.edit(embed)
            }
        });

    })

});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('coinSettings', (guildId, settings) => {
    coinSettings.set(guildId, settings)
})
StateManager.on('guildCoins', (guildId, usersCoins) => {
    userCoins.set(guildId, usersCoins)
})