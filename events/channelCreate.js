const StateManager = require('../utils/StateManager');
var checkBotOwner = require('../function/check/botOwner');
var checkWl = require('../function/check/checkWl');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
const logsChannelId = new Map();
const Discord = require('discord.js');
const { Logger } = require('advanced-command-handler');
const guildEmbedColor = new Map();
const guildAntiraidConfig = new Map();
const { Event } = require('advanced-command-handler');
module.exports = new Event(
    {
        name: 'channelCreate',
        //optionnal :
    },
    module.exports = async (handler, channel) => {
        this.connection = StateManager.connection;
        let guild = channel.guild
        if (channel.type == "dm") return;
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guildEmbedColor.get(channel.guild.id)

        const isOnFetched = await this.connection.query(`SELECT channelCreate FROM antiraid WHERE guildId = '${channel.guild.id}'`);
        const isOnfetched = isOnFetched[0][0].channelCreate;
        let isOn;
        if (isOnfetched == "1") { isOn = true };
        if (isOnFetched == "0") { isOn = false };
        let action;
        if (isOn) {
            action = await channel.guild.fetchAuditLogs({ type: "CHANNEL_CREATE" }).then(async (audit) => audit.entries.first());

        } else {
            return;
        }
        if (action.executor.id === handler.client.user.id) return;
        var isOwner = checkBotOwner(channel.guild.id, action.executor.id);

        const isWlOnFetched = await this.connection.query(`SELECT channelCreate FROM antiraidWlBp WHERE guildId = '${channel.guild.id}'`);
        const isWlOnfetched = isWlOnFetched[0][0].channelCreate;
        let isOnWl;
        if (isWlOnfetched == "1") { isOnWl = true };
        if (isWlOnfetched == "0") { isOnWl = false };
        if (isOnWl == true) {
            var isWl = checkWl(channel.guild.id, action.executor.id);

        }
        // let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${channel.guild.id}'`);
        // let isWlfetched =  isWlFetched[0][0].whitelisted.toString();
        // let isWl1 = isWlfetched.split(",");
        // let isWl;
        // if (isWl1.includes(action.executor.id)) { isWl = true };
        // if (!isWl1.includes(action.executor.id)) { isWl = false };
      
        if (isOwner == true || guild.ownerID == action.executor.id || isOn == false) {
            return;
        } else if (isOwner == true || guild.ownerID == action.executor.id || isOn == false || isOnWl == true && isWl == true) {
            return;

        } else if (isOn == true && isOwner == false || guild.owner.id !== action.executor.id || isOnWl == true && isWl == false || isOnWl == false) {
            try{
                channel.delete()
            }catch(e){
                if(e.toString().toLowerCase().includes('missing permissions')){
               

    
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
                    if(logChannel != undefined){
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



            let guild = handler.client.guilds.cache.find(guild => guild.id === action.target.guild.id);
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
						
						for(const[id] of botRole){
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
                    if(logChannel != undefined){
                        logChannel.send(logsEmbed);

                    }
            }else {
              
    
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
                    if(logChannel != undefined){
                        logChannel.send(logsEmbed);

                    }
            }
        }

    }
);

logsChannelF(logsChannelId, 'raid');

embedsColor(guildEmbedColor);
StateManager.on('antiraidConfF', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})

