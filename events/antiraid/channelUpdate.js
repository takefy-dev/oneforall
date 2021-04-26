const StateManager = require('../../utils/StateManager');
let checkBotOwner = require('../../function/check/botOwner');
let checkWl = require('../../function/check/checkWl');
let logsChannelF = require('../../function/fetchLogs');
let embedsColor = require('../../function/embedsColor');
const logsChannelId = new Map();
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const guildAntiraidConfig = new Map();
const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");
module.exports = class channelUpdate extends Event {
    constructor() {
        super({
            name: 'channelUpdate',
        });
    }

    async run(client, oldChannel, newChannel) {
        this.connection = StateManager.connection;
        let guild = oldChannel.guild;

        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        let logChannelId = logsChannelId.get(oldChannel.guild.id);


        let logChannel
        if (logChannelId != undefined && oldChannel != undefined) {
            logChannel = oldChannel.guild.channels.cache.get(logChannelId)

        }
        const color = guild.color

        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const antiraidConfig = guild.antiraid;
        const isOn = antiraidConfig.enable[this.name];
        if(!isOn) return;
        let action = await guild.fetchAuditLogs({type: "CHANNEL_DELETE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id)  return Logger.log(`No sanction oneforall`, `${this.name}`, 'pink');
        if(guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `${this.name}`, 'pink');

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL DELETE`, 'pink');

        const actionTime = new Date(action.createdTimestamp);
        const actualDate = new Date(Date.now());
        const formatedActionTime = parseInt(actionTime.getHours()) + parseInt(actionTime.getMinutes()) + parseInt(actionTime.getSeconds())
        const formatedActualtime = parseInt(actualDate.getHours()) + parseInt(actualDate.getMinutes()) + parseInt(actualDate.getSeconds())
        if (await (formatedActualtime - formatedActionTime) >= 0 && await (formatedActualtime - formatedActionTime) <= 3) {

           if (isWlBypass && !isWl || !isWlBypass) {
                try {
                    oldChannel.setName(oldChannel.name)
                    await oldChannel.setParent(oldChannel.parentID)
                } catch (e) {
                    if (e.toString().toLowerCase().includes('missing permissions')) {


                        const logsEmbed = new Discord.MessageEmbed()
                            .setTitle("\`📣\` Modification d'un channel")
                            .setDescription(`
                       \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié le channel:\n
                        \`\`\`${oldChannel.name} en ${newChannel.name}\`\`\`
                        \`🧾\`Erreur : Je n'ai pas assez de permissions pour remodifier ce rôles
						`)
                            .setTimestamp()
                            .setFooter("🕙")
                            .setColor(`${color}`)
                        if (logChannel != undefined) {
                            return logChannel.send(logsEmbed);

                        }
                    }
                }

                let after = guildAntiraidConfig.get(oldChannel.guild.id);


                let guild = client
.guilds.cache.find(guild => guild.id === oldChannel.guild.id);
                let targetMember = guild.members.cache.get(action.executor.id);
                if (targetMember == undefined) {
                    await oldChannel.guild.members.fetch().then((members) => {
                        targetMember = members.get(action.executor.id)
                    })
                }
                if (targetMember.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
                    if (after.channelUpdate === 'ban') {
                        guild.members.ban(action.executor.id)
                    } else if (after.channelUpdate === 'kick') {
                        guild.member(action.executor.id).kick(
                            `OneForAll - Type: channelUpdate `
                        )
                    } else if (after.channelUpdate === 'unrank') {
                        let roles = []
                        let role = await guild.member(action.executor.id).roles.cache
                            .map(role => roles.push(role.id))
                        role
                        guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: channelUpdate`)
                        if (action.executor.bot) {
                            let botRole = targetMember.roles.cache.filter(r => r.managed)
                            // let r = guild.roles.cache.get(botRole.id)

                            for (const [id] of botRole) {
                                botRole = guild.roles.cache.get(id)
                            }
                            botRole.setPermissions(0, `OneForAll - Type: channelUpdate `)
                        }
                    }


                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle("\`📣\` Modification d'un channel")
                        .setDescription(`
                       \`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a modifié le channel:\n
                        \`\`\`${oldChannel.name} en ${newChannel.name}\`\`\`
                       \`🧾\` Sanction : ${after.channelUpdate}
                    `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    if (logChannel != undefined) {
                        return logChannel.send(logsEmbed);

                    }
                } else {


                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle("\`📣\` Modification d'un channel")
                        .setDescription(`
                       \`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a modifié le channel:\n
                        \`\`\`${oldChannel.name} en ${newChannel.name}\`\`\`
                        \`🧾\`Sanction : Aucune car il possède  plus de permissions que moi
                    `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    if (logChannel != undefined) {
                        return logChannel.send(logsEmbed);

                    }
                }


            }
        }


    }
}
logsChannelF(logsChannelId, 'raid');

embedsColor(guildEmbedColor);
StateManager.on('antiraidConfF', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
