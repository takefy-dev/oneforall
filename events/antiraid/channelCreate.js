const StateManager = require('../../utils/StateManager');
let checkBotOwner = require('../../function/check/botOwner');
let checkWl = require('../../function/check/checkWl');
let logsChannelF = require('../../function/fetchLogs');
const logsChannelId = new Map();
const Discord = require('discord.js');
const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')


module.exports = class channelCreate extends Event {
    constructor() {
        super({
            name: 'channelCreate',
        });
    }

    async run(client, channel) {
        let guild = channel.guild
        if (channel.type === "dm") return;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guild.color;
        const antiraidConfig = guild.antiraid;
        const isOn = antiraidConfig.enable[this.name];
        if(!isOn) return;

        let action = await channel.guild.fetchAuditLogs({type: "CHANNEL_CREATE"}).then(async (audit) => audit.entries.first());

        if (action.executor.id === client.user.id)  return Logger.log(`No sanction oneforall`, `CHANNEL DELETE`, 'pink');
        if(guild.ownerID === action.executor.id) return Logger.log(`No sanction crown`, `CHANNEL DELETE`, 'pink');

        let isGuildOwner = guild.isGuildOwner(action.executor.id);
        let isBotOwner = client.isOwner(action.executor.id);


        let isWlBypass = antiraidConfig.bypass[this.name];
        if (isWlBypass) var isWl = guild.isGuildWl(action.executor.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL DELETE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            try {
                channel.delete()
            } catch (e) {
                if (e.toString().toLowerCase().includes('missing permissions')) {


                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle("\`📣\` Création d'un channel")
                        .setDescription(`
                    \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a crée le channel:\n
                    \`\`\`${action.target.name}\`\`\`
                    \`🧾\`Erreur : Je n'ai pas assez de permissions pour remodifier ce rôles
                    `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    if (logChannel != undefined) {
                        logChannel.send(logsEmbed);

                    }
                }
            }

            let logChannelId = logsChannelId.get(channel.guild.id);

            let logChannel
            if (logChannelId != undefined) {
                logChannel = channel.guild.channels.cache.get(logChannelId)

            }
            let after = guildAntiraidConfig.get(channel.guild.id);


            let guild = client.guilds.cache.find(guild => guild.id === action.target.guild.id);

            let targetMember = guild.members.cache.get(action.executor.id);
            if (targetMember == undefined) {
                await channel.guild.members.fetch().then((members) => {
                    targetMember = members.get(action.executor.id)
                })
            }
            if (targetMember.roles.highest.comparePositionTo(channel.guild.me.roles.highest) <= 0) {
                if (after.channelCreate === 'ban') {
                    guild.members.ban(action.executor.id)
                } else if (after.channelCreate === 'kick') {
                    guild.member(action.executor.id).kick(
                        `OneForAll - Type: channelCreate `
                    )
                } else if (after.channelCreate === 'unrank') {
                    let roles = []
                    let role = await guild.member(action.executor.id).roles.cache
                        .map(role => roles.push(role.id))
                    role
                    guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: channelCreate`)
                    if (action.executor.bot) {
                        let botRole = targetMember.roles.cache.filter(r => r.managed)
                        // let r = guild.roles.cache.get(botRole.id)

                        for (const [id] of botRole) {
                            botRole = guild.roles.cache.get(id)
                        }
                        botRole.setPermissions(0, `OneForAll - Type: channelCreate`)
                    }
                }


                const logsEmbed = new Discord.MessageEmbed()
                    .setTitle("\`📣\` Création d'un channel")
                    .setDescription(`
           \`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a crée le channel:\n
            \`\`\`${action.target.name}\`\`\`
           \`🧾\` Sanction : ${after.channelCreate}

        `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                if (logChannel != undefined) {
                    logChannel.send(logsEmbed);

                }
            } else {


                const logsEmbed = new Discord.MessageEmbed()
                    .setTitle("\`📣\` Création d'un channel")
                    .setDescription(`
                    \`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a crée le channel:\n
                    \`\`\`${action.target.name}\`\`\`
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
};

logsChannelF(logsChannelId, 'raid');

StateManager.on('antiraidConfF', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})

