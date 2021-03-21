const StateManager = require('../utils/StateManager');
const BaseEvent = require('../utils/structures/BaseEvent');
var checkBotOwner = require('../function/check/botOwner');
const guildEmbedColor = new Map();
var checkWl = require('../function/check/checkWl');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
const Discord = require('discord.js')
const logsChannelId = new Map();
const guildAntiraidConfig = new Map();
const { Event } = require('advanced-command-handler');
module.exports = new Event(
    {
        name: 'webhookUpdate',
    },
    module.exports = async (handler, channel) => {
        const color = guildEmbedColor.get(channel.guild.id)
        this.connection = StateManager.connection;

        let guild = channel.guild
        if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        const isOnFetched = await this.connection.query(`SELECT webhookCreate FROM antiraid WHERE guildId = '${channel.guild.id}'`);
        const isOnfetched = isOnFetched[0][0].webhookCreate;
        let isOn;
        if (isOnfetched == "1") { isOn = true };
        if (isOnFetched == "0") { isOn = false };

        let action;
        if (isOn) {
            action = await channel.guild.fetchAuditLogs({limit: 1, type: "WEBHOOK_CREATE" }).then(async (audit) => audit.entries.first());

        } else {
            return;
        }
        // console.log("ss", checkBotOwner(channel.guild.id, action.executor.id))

        if (action.executor.id === handler.client.user.id) return;
        var isOwner = checkBotOwner(channel.guild.id, action.executor.id);



        const isWlOnFetched = await this.connection.query(`SELECT webhookCreate FROM antiraidWlBp WHERE guildId = '${channel.guild.id}'`);
        const isWlOnfetched = isWlOnFetched[0][0].webhookCreate;
        let isOnWl;
        if (isWlOnfetched == "1") { isOnWl = true };
        if (isWlOnfetched == "0") { isOnWl = false };
        if (isOnWl == true) {
            var isWl = checkWl(channel.guild.id, action.executor.id);

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
            try{
                await channel.delete();
                var newChannel = await channel.clone()
                newChannel.setPosition(channel.position)
                const embed = new Discord.MessageEmbed()
                    .setDescription('👩‍💻 Si vous voulez ne plus être raid comme ce serveur alors le lien est ici ... [oneforall antiraid](https://discord.gg/rdrTpVeGWX)')
                    .setColor(`${color}`)
                    .setTimestamp()
                    .setFooter(handler.client.user.username)
                newChannel.send(embed)
            }catch(e){
                console.log("err", e)
					if(e.toString().toLowerCase().includes('missing permissions')){
						if (logChannel == undefined) return;
		
						const logsEmbed = new Discord.MessageEmbed()
                        .setTitle('\`❌\` Création de Weebhooks')
                        .setDescription(`
                        \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a crée un weehbooks \n
                        \`\`\`${action.target.name}\`\`\`
                        
                        \`🧾\`Erreur : Je n'ai pas assez de permissions pour remodifier ce rôles
						`)
						.setTimestamp()
						.setFooter("🕙")
						.setColor(`${color}`)
						 logChannel.send(logsEmbed);
					}
            }
      
            let after = guildAntiraidConfig.get(channel.guild.id);




            let guild = handler.client.guilds.cache.find(guild => guild.id === action.target.guildID);

            let targetMember = guild.members.cache.get(action.executor.id);
            if (targetMember == undefined) {
                await channel.guild.members.fetch().then((members) => {
                    targetMember = members.get(action.executor.id)
                })
            }
            if (targetMember.roles.highest.comparePositionTo(channel.guild.me.roles.highest) <= 0) {
                console.log(after.webhookCreate)
                if (after.webhookCreate == 'ban') {
                    guild.members.ban(action.executor.id)


                } else if (after.webhookCreate == 'kick') {
                    guild.member(action.executor.id).kick(
                        `OneForAll - Type: webhookCreate `
                    )



                } else if (after.webhookCreate == 'unrank') {

                    let roles = []
                    let role = await guild.member(action.executor.id).roles.cache
                        .map(role => roles.push(role.id))
                    role
                    guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: webhookCreate`)
                    if (action.executor.bot) {
                        let botRole = targetMember.roles.cache.filter(r => r.managed)
						// let r = guild.roles.cache.get(botRole.id)
						
						for(const[id] of botRole){
							botRole = guild.roles.cache.get(id)
						}
						botRole.setPermissions(0, `OneForAll - Type: webhookCreate`)
                    }



                }

                let logChannelId = logsChannelId.get(channel.guild.id);
                if (logChannelId == undefined) return;
                let logChannel = handler.client.guilds.cache.get(channel.guild.id).channels.cache.get(logChannelId)
                if (logChannel != undefined) {
                    if (action.executor.id === handler.client.user.id) return;
                    const logsEmbed = new Discord.MessageEmbed()
                        .setTitle('\`❌\` Création de Weebhooks')
                        .setDescription(`
           \`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a crée un weehbooks \n
            \`\`\`${action.target.name}\`\`\`
           \`🧾\` Sanction : ${after.webhookCreate}

        `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    logChannel.send(logsEmbed);
                }

            } else {
                if (logChannel == undefined) return;

                const logsEmbed = new Discord.MessageEmbed()
                .setTitle('\`❌\` Création de Weebhooks')
                .setDescription(`
   \`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a crée un weehbooks \n
    \`\`\`${action.target.name}\`\`\`
                \`🧾\`Sanction : Aucune car il possède  plus de permissions que moi
            `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                return logChannel.send(logsEmbed);
            }
        }
    }
)

logsChannelF(logsChannelId, 'raid');
embedsColor(guildEmbedColor);
// StateManager.on('afterF', (guildId, sanction) =>{
//     after.set(guildId, sanction)
// })
// StateManager.on('afterU', (guildId, sanction) =>{
//     after.set(guildId, sanction)
// })
StateManager.on('antiraidConfF', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
