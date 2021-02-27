const StateManager = require('../utils/StateManager');
var checkBotOwner = require('../function/check/botOwner');
var checkWl = require('../function/check/checkWl');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
const logsChannelId = new Map();
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const guildAntiraidConfig = new Map();
const { Event } = require('advanced-command-handler');
module.exports = new Event(
    {
        name: 'channelUpdate',
    },
    module.exports = async (handler, oldChannel, newChannel) => {
        this.connection = StateManager.connection;
        let guild = oldChannel.guild
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const color = guildEmbedColor.get(oldChannel.guild.id)
        let logChannelId = logsChannelId.get(oldChannel.guild.id);
     

		let logChannel
		if (logChannelId != undefined && oldChannel != undefined) {
			logChannel = oldChannel.guild.channels.cache.get(logChannelId)

		}
        const isOnFetched = await this.connection.query(`SELECT channelUpdate FROM antiraid WHERE guildId = '${oldChannel.guild.id}'`);
        const isOnfetched = isOnFetched[0][0].channelUpdate;
        let isOn;
        if (isOnfetched == "1") { isOn = true };
        if (isOnFetched == "0") { isOn = false };
    
        let action;
    
        if (isOn) {
            action = await oldChannel.guild.fetchAuditLogs({ type: "CHANNEL_UPDATE" }).then(async (audit) => audit.entries.first());
    
    
        } else {
            return;
        }
        const actionTime = new Date(action.createdTimestamp);
        const actualDate = new Date(Date.now());
        const formatedActionTime = parseInt(actionTime.getHours()) + parseInt(actionTime.getMinutes()) + parseInt(actionTime.getSeconds())
        const formatedActualtime = parseInt(actualDate.getHours()) + parseInt(actualDate.getMinutes()) + parseInt(actualDate.getSeconds())
        if (await (formatedActualtime - formatedActionTime) >= 0 && await (formatedActualtime - formatedActionTime) <= 3) {
    
            if (action.executor.id === handler.client.user.id) return;
            var isOwner = checkBotOwner(oldChannel.guild.id, action.executor.id);
        
        
            const isWlOnFetched = await this.connection.query(`SELECT channelUpdate FROM antiraidWlBp WHERE guildId = '${oldChannel.guild.id}'`);
            const isWlOnfetched = isWlOnFetched[0][0].channelUpdate;
            let isOnWl;
            if (isWlOnfetched == "1") { isOnWl = true };
            if (isWlOnfetched == "0") { isOnWl = false };
            var isWl;
            if (isOnWl == true) {
                isWl = checkWl(oldChannel.guild.id, action.executor.id);
        
            }
            // let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${oldChannel.guild.id}'`);
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
                    oldChannel.setName(oldChannel.name)
                    oldChannel.setParent(oldChannel.parentID)
                }catch(e){
                    if(e.toString().toLowerCase().includes('missing permissions')){
                        

		
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
                        if(logChannel != undefined){
                            return logChannel.send(logsEmbed);

                        }
					}
                }
                
                let after = guildAntiraidConfig.get(oldChannel.guild.id);
        
        
        
                let guild = handler.client.guilds.cache.find(guild => guild.id === oldChannel.guild.id);
                let targetMember = guild.members.cache.get(action.executor.id);
                if (targetMember == undefined) {
                    await oldChannel.guild.members.fetch().then((members) => {
                        targetMember = members.get(action.executor.id)
                    })
                }
                if(targetMember.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0){
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
                            
                            for(const[id] of botRole){
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
                        if(logChannel != undefined){
                            return logChannel.send(logsEmbed);

                        }
                }else{

            
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
                        if(logChannel != undefined){
                            return logChannel.send(logsEmbed);

                        }
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
