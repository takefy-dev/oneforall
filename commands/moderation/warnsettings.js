
const warnSanction = new Map();
const tempWarn = new Map();
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'warn-config',
            description: 'Configure the warn system | Configurer le system de warn',
            // Optionnals :
            usage: '!warn-config',
            category: 'moderation',
            tags: ['guildOnly'],
            aliases: ['setwarn', 'warnconfig', 'warnsetup', 'warn-conf', 'warn config'],
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['EMBED_LINKS'],
            guildOwnerOnly : true,
        });
    }
    async run(client, message,args){

    const warnBan = warnSanction.get(message.guild.id).ban
    const warnKick = warnSanction.get(message.guild.id).kick
    const warnMute = warnSanction.get(message.guild.id).mute
    tempWarn.set(message.guild.id, warnSanction.get(message.guild.id))

    const principalMsg = await message.channel.send(lang.loading)
    const emoji = ['💥', '💢', '😶','❌', '✅']
    for(const em of emoji) {
        await principalMsg.react(em)
    }
    const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
    dureefiltrer = response => { return response.author.id === message.author.id };
    const embed = new Discord.MessageEmbed()
    .setTitle(lang.warn.settingsTitle)
    .setDescription(lang.warn.description(warnBan, warnKick, warnMute))
    .setFooter(client.user.tag)
    .setColor(`${color}`)
    .setTimestamp();
    principalMsg.edit(' ', embed).then(async m => {
        const collector = m.createReactionCollector(filter, { time: 900000 });
        collector.on('collect', async r => {
            r.users.remove(message.author);
            if(r.emoji.name === emoji[0]){
                message.channel.send(lang.warn.banQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            let msg = cld.first();
                            if(msg.content.toLowerCase() === 'cancel') return message.channel.send(lang.cancel).then(mps => {
                                setTimeout( () => {
                                    mp.delete()
                                    msg.delete()
                                    mps.delete()
                                }, 4000)
                            })
                            if(isNaN(msg.content)) return message.channel.send(lang.warn.onlyNumber).then(mps => {
                                setTimeout( () => {
                                    mp.delete()
                                    msg.delete()
                                    mps.delete()
                                }, 4000)
                            })
                            
                            tempWarn.get(message.guild.id).ban = msg.content;
                            updateEmbed()
                            setTimeout( () => {
                                mp.delete()
                                msg.delete()
                            }, 4000)


                        })
                })
            }else if(r.emoji.name === emoji[1]){
                message.channel.send(lang.warn.kickQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            let msg = cld.first();
                            if(msg.content.toLowerCase() === 'cancel') return message.channel.send(lang.cancel).then(mps => {
                                setTimeout( () => {
                                    mp.delete()
                                    msg.delete()
                                    mps.delete()
                                }, 4000)
                            })
                            if(isNaN(msg.content)) return message.channel.send(lang.warn.onlyNumber).then(mps => {
                                setTimeout( () => {
                                    mp.delete()
                                    msg.delete()
                                    mps.delete()
                                }, 4000)
                            })
                            
                            tempWarn.get(message.guild.id).kick = msg.content;
                            updateEmbed()
                            setTimeout( () => {
                                mp.delete()
                                msg.delete()
                            }, 4000)


                        })
                    })
            }else if (r.emoji.name === emoji[2]){
                message.channel.send(lang.warn.muteQ).then(mp => {
                    mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                        .then(async cld => {
                            let msg = cld.first();
                            if(msg.content.toLowerCase() === 'cancel') return message.channel.send(lang.cancel).then(mps => {
                                setTimeout( () => {
                                    mp.delete()
                                    msg.delete()
                                    mps.delete()
                                }, 4000)
                            })
                            if(isNaN(msg.content)) return message.channel.send(lang.warn.onlyNumber).then(mps => {
                                setTimeout( () => {
                                    mp.delete()
                                    msg.delete()
                                    mps.delete()
                                }, 4000)
                            })
                            
                            tempWarn.get(message.guild.id).mute = msg.content;
                            updateEmbed()
                            setTimeout( () => {
                                mp.delete()
                                msg.delete()
                            }, 4000)


                        })
                    })
            }else if(r.emoji.name === emoji[3]){
                message.channel.send(lang.warn.cancel).then((mp) => {
                    tempWarn.delete(message.guild.id);
                    collector.stop();
                    setTimeout(async () => { mp.delete() }, 2000)
                    return principalMsg.delete();

                })
            }else if(r.emoji.name === emoji[4]){
                message.channel.send(lang.warn.save).then(async (mp) => {
                    const tempoWarn = tempWarn.get(message.guild.id)
                    warnSanction.set(message.guild.id, tempoWarn)
                    await this.connection.query(`UPDATE guildConfig SET warnBan='${tempWarn.get(message.guild.id).ban}'`)
                    await this.connection.query(`UPDATE guildConfig SET warnKick='${tempWarn.get(message.guild.id).kick}'`)
                    await this.connection.query(`UPDATE guildConfig SET warnMute='${tempWarn.get(message.guild.id).mute}'`)
                    StateManager.emit('warnU', message.guild.id, tempoWarn)
                    collector.stop();
                    principalMsg.delete()
                })
            }
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    message.channel.send(lang.error.timeout)
                }
                tempWarn.delete(message.guild.id)
            });
           
        })
        function updateEmbed() {
            const tempWarns = tempWarn.get(message.guild.id)
            embed.setDescription(lang.warn.description(tempWarns.ban, tempWarns.kick, tempWarns.mute))
            principalMsg.edit(embed)

        }
    })
  

}}