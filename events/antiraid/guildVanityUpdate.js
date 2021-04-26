const StateManager = require('../../utils/StateManager');
const Event = require('../../structures/Handler/Event');

let checkBotOwner = require('../../function/check/botOwner');
const guildEmbedColor = new Map();
let checkWl = require('../../function/check/checkWl');
let logsChannelF = require('../../function/fetchLogs');
let embedsColor = require('../../function/embedsColor');
const Discord = require('discord.js')
const logsChannelId = new Map();
const guildAntiraidConfig = new Map();
const fetch = require('node-fetch');
module.exports = class guildVanityUpdate extends Event {
    constructor() {
        super({
            name: 'guildVanityUpdate',
        });
    }

    async run(client, guild, oldVanityURL, newVanityURL) {


        const color = guildEmbedColor.get(guild.id)
        this.connection = StateManager.connection;
        let logChannelId = logsChannelId.get(guild.id);
        let logChannel;
        if (logChannelId != undefined) {
            logChannel = client
.guilds.cache.get(guild.id).channels.cache.get(logChannelId)
        }

        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const isOnFetched = await this.connection.query(`SELECT vanityUpdate FROM antiraid WHERE guildId = '${guild.id}'`);
        const isOnfetched = isOnFetched[0][0].vanityUpdate;
        let isOn;
        if (isOnfetched == "1") {
            isOn = true
        }
        ;
        if (isOnFetched == "0") {
            isOn = false
        }
        ;

        let action;
        if (isOn) {
            action = await guild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());

        } else {
            return;
        }
        // console.log("ss", checkBotOwner(channel.guild.id, action.executor.id))
        if (action.changes[0].key == 'vanity_url_code' && action.executor.id != client
.user.id && newVanityURL != guildAntiraidConfig.get(guild.id).vanityUpdateBypass) {

            let isOwner = checkBotOwner(guild.id, action.executor.id);


            const isWlOnFetched = await this.connection.query(`SELECT vanityUpdate FROM antiraidWlBp WHERE guildId = '${guild.id}'`);
            const isWlOnfetched = isWlOnFetched[0][0].vanityUpdate;
            let isOnWl;
            if (isWlOnfetched == "1") {
                isOnWl = true
            }
            ;
            if (isWlOnfetched == "0") {
                isOnWl = false
            }
            ;
            if (isOnWl == true) {
                let isWl = checkWl(guild.id, action.executor.id);

            }
            // let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${channel.guild.id}'`);
            // let isWlfetched = isWlFetched[0][0].whitelisted.toString();
            // let isWl1 = isWlfetched.split(",");
            // let isWl;
            // if (isWl1.includes(action.executor.id)) { isWl = true };
            // if (!isWl1.includes(action.executor.id)) { isWl = false };
            if (isOwner == true || guild.ownerID == action.executor.id || isOn == false) {
                return;
            } else if (isOwner == true || guild.ownerID == action.executor.id || isOn == false || isOnWl == true && isWl == true) {
                return;
            } else if (isOn == true && isOwner == false || guild.owner.id !== action.executor.id || isOnWl == true && isWl == false || isOnWl == false) {

                try {
                    await fetch(`https://discord.com/api/v8/guilds/${guild.id}/vanity-url`, {
                        "credentials": "include",
                        "headers": {
                            "accept": "*/*",
                            "authorization": "Bot " + client
.token,
                            "content-type": "application/json",
                        },
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "body": JSON.stringify({
                            "code": oldVanityURL
                        }),
                        "method": "PATCH",
                        "mode": "cors"
                    })
                } catch (e) {
                    if (e.toString().toLowerCase().includes('missing permissions')) {

                        if (newVanityURL != null) {
                            const logsEmbed = new Discord.MessageEmbed()
                                .setTitle(`\`📣\` Modification de l'url personnalisé`)
                                .setDescription(`
                        \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié l'url personnalisé \n
                        \`\`\`${oldVanityURL} en ${newVanityURL}\`\`\`
                            \`🧾\`Erreur : Je n'ai pas assez de permissions pour remodifier la région
                            `)
                                .setTimestamp()
                                .setFooter("🕙")
                                .setColor(`${color}`)
                            if (logChannel != undefined) {
                                logChannel.send(logsEmbed);

                            }
                        } else {
                            const logsEmbed = new Discord.MessageEmbed()
                                .setTitle(`\`❌\` Suppression de l'url personnalisé`)
                                .setDescription(`
                        \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a supprimé l'url personnalisé \n
                        \`\`\`${oldVanityURL}\`\`\`
                            \`🧾\`Erreur : Je n'ai pas assez de permissions pour remodifier la région
                            `)
                                .setTimestamp()
                                .setFooter("🕙")
                                .setColor(`${color}`)
                            if (logChannel != undefined) {
                                logChannel.send(logsEmbed);

                            }
                        }

                    }
                }

                let after = guildAntiraidConfig.get(guild.id);


                let targetMember = guild.members.cache.get(action.executor.id);
                if (targetMember == undefined) {
                    await guild.members.fetch().then((members) => {
                        targetMember = members.get(action.executor.id)
                    })
                }
                if (targetMember.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {

                    if (after.vanityUpdate == 'ban') {
                        guild.members.ban(action.executor.id)


                    } else if (after.vanityUpdate == 'kick') {
                        guild.member(action.executor.id).kick(
                            `OneForAll - Type: guildUpdate - vanityUrl`
                        )


                    } else if (after.vanityUpdate == 'unrank') {

                        let roles = []
                        let role = await guild.member(action.executor.id).roles.cache
                            .map(role => roles.push(role.id))
                        role
                        guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: guildUpdate - vanityUrl`)
                        if (action.executor.bot) {
                            let botRole = targetMember.roles.cache.filter(r => r.managed)
                            // let r = guild.roles.cache.get(botRole.id)

                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            botRole.setPermissions(0, `OneForAll - Type: guildUpdate - vanityUrl`)
                        }


                    }


                    if (logChannel != undefined) {
                        if (newVanityURL != null) {
                            const logsEmbed = new Discord.MessageEmbed()
                                .setTitle(`\`📣\` Modification de l'url personnalisé`)
                                .setDescription(`
                            \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié l'url personnalisé \n
                            \`\`\`${oldVanityURL} en ${newVanityURL}\`\`\`
                    \`🧾\` Sanction : ${after.vanityUpdate}
            
                    `)
                                .setTimestamp()
                                .setFooter("🕙")
                                .setColor(`${color}`)
                            if (logChannel != undefined) {
                                logChannel.send(logsEmbed);

                            }
                        } else {
                            const logsEmbed = new Discord.MessageEmbed()
                                .setTitle(`\`❌\` Suppression de l'url personnalisé`)
                                .setDescription(`
                        \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a supprimé l'url personnalisé \n
                        \`\`\`${oldVanityURL}\`\`\`
                    \`🧾\` Sanction : ${after.vanityUpdate}
            
                    `)
                                .setTimestamp()
                                .setFooter("🕙")
                                .setColor(`${color}`)
                            if (logChannel != undefined) {
                                logChannel.send(logsEmbed);

                            }
                        }

                    }

                } else {
                    if (newVanityURL != null) {
                        const logsEmbed = new Discord.MessageEmbed()
                            .setTitle(`\`📣\` Modification de l'url personnalisé`)
                            .setDescription(`
                        \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié l'url personnalisé \n
                        \`\`\`${oldVanityURL} en ${newVanityURL}\`\`\`
                        \`🧾\`Sanction : Aucune car il possède  plus de permissions que moi
                    `)
                            .setTimestamp()
                            .setFooter("🕙")
                            .setColor(`${color}`)
                        if (logChannel != undefined) {
                            logChannel.send(logsEmbed);

                        }
                    } else {
                        const logsEmbed = new Discord.MessageEmbed()
                            .setTitle(`\`❌\` Suppression de l'url personnalisé`)
                            .setDescription(`
                    \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a supprimé l'url personnalisé \n
                    \`\`\`${oldVanityURL}\`\`\`
                        \`🧾\`Sanction : Aucune car il possède  plus de permissions que moi
                    `)
                            .setTimestamp()
                            .setFooter("🕙")
                            .setColor(`${color}`)
                        if (logChannel != undefined) {
                            logChannel.send(logsEmbed);

                        }
                    }

                }
            }
        }
    }
};
logsChannelF(logsChannelId, 'raid');

embedsColor(guildEmbedColor);
StateManager.on('antiraidConfF', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})


