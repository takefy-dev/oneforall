const StateManager = require('../utils/StateManager');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
const logsChannelId = new Map();
const guildCommandPrefixes = new Map();
const guildEmbedColor = new Map();
const Discord = require('discord.js')
var checkWl = require('../function/check/checkWl');
const guildAntiraidConfig = new Map();

var checkBotOwner = require('../function/check/botOwner');
const { Event } = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'roleCreate',
	},
	module.exports = async (handler, role) => {
		const color = guildEmbedColor.get(role.guild.id)
		this.connection = StateManager.connection;
		let guild = role.guild;
		let logChannelId = logsChannelId.get(role.guild.id);
     

		let logChannel
		if (logChannelId != undefined) {
			logChannel = role.guild.channels.cache.get(logChannelId)


		}
		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
		const isOnFetched = await this.connection.query(`SELECT roleCreate FROM antiraid WHERE guildId = '${role.guild.id}'`);
		const isOnfetched = isOnFetched[0][0].roleCreate;
		let isOn;
		if (isOnfetched == "1") { isOn = true };
		if (isOnFetched == "0") { isOn = false };
		let action;
		if (isOn) {
			action = await role.guild.fetchAuditLogs({ type: "ROLE_CREATE" }).then(async (audit) => audit.entries.first());

		} else {
			return;
		}

		if (action.executor.id === handler.client.user.id) return;
		var isOwner = checkBotOwner(role.guild.id, action.executor.id);


		const isWlOnFetched = await this.connection.query(`SELECT roleCreate FROM antiraidWlBp WHERE guildId = '${role.guild.id}'`);
		const isWlOnfetched = isWlOnFetched[0][0].roleCreate;
		let isOnWl;
		if (isWlOnfetched == "1") { isOnWl = true };
		if (isWlOnfetched == "0") { isOnWl = false };
		if (isOnWl == true) {
			var isWl = checkWl(role.guild.id, action.executor.id);

		}
		// let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${role.guild.id}'`);
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
			let guild = handler.client.guilds.cache.find(guild => guild.id === role.guild.id);
			if (role.managed == true) {
				return
			}

			try{
				role.delete();

			}catch(e){
				if(e.toString().toLowerCase().includes('missing permissions')){

	
					const logsEmbed = new Discord.MessageEmbed()
					.setTitle(`\`❌\`Création d'un rôle `)
					.setDescription(`
					\`👨‍💻\`Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a créé le rôle :\n
					\`\`\`➡ : ${role.name}\`\`\`
					
					\`🧾\`Erreur : Je n'ai pas assez de permissions pour remodifier ce rôles
					`)
					.setTimestamp()
					.setFooter("🕙")
					.setColor(`${color}`)
					if (logChannel != undefined){
						return logChannel.send(logsEmbed);
	
					}
				}
			}

			let after = guildAntiraidConfig.get(role.guild.id);

			let targetMember = guild.members.cache.get(action.executor.id);
            if (targetMember == undefined) {
                await role.guild.members.fetch().then((members) => {
                    targetMember = members.get(action.executor.id)
                })
            }
			if (targetMember.roles.highest.comparePositionTo(role.guild.me.roles.highest) <= 0) {

				if (after.roleCreate === 'ban') {
					guild.members.ban(action.executor.id)
				} else if (after.roleCreate === 'kick') {
					guild.member(action.executor.id).kick(
						 `OneForAll - Type: roleCreate `
					)
				} else if (after.roleCreate === 'unrank') {
					let roles = []
					let role = await guild.member(action.executor.id).roles.cache
						.map(role => roles.push(role.id))
					role
					guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: roleCreate`)
					if (action.executor.bot) {
						let botRole = targetMember.roles.cache.filter(r => r.managed)
						// let r = guild.roles.cache.get(botRole.id)
						
						for(const[id] of botRole){
							botRole = guild.roles.cache.get(id)
						}
						botRole.setPermissions(0, `OneForAll - Type: roleCreate`)
					}
				}
				if (logChannelId == undefined) return;
				let logChannel = handler.client.guilds.cache.get(role.guild.id).channels.cache.get(logChannelId)

				


				const logsEmbed = new Discord.MessageEmbed()
					.setTitle(`\`❌\`Création d'un rôle `)
					.setDescription(`
			\`👨‍💻\`Auteur : **${guild.members.cache.get(action.executor.id).user.tag}** \`(${action.executor.id})\` a créé le rôle :\n
			\`\`\`➡ : ${role.name}\`\`\`
			\`🧾\`Sanction : ${after.roleCreate}

		`)
					.setTimestamp()
					.setFooter('🕙')
					.setColor(`${color}`);
					if (logChannel != undefined){
						return logChannel.send(logsEmbed);
	
					}
			}else {
                

    
                const logsEmbed = new Discord.MessageEmbed()
					.setTitle(`\`❌\`Création d'un rôle `)
                    .setDescription(`
					\`👨‍💻\`Auteur : **${guild.members.cache.get(action.executor.id).user.tag}** \`(${action.executor.id})\` a créé le rôle :\n
					\`\`\`➡ : ${role.name}\`\`\`
                    \`🧾\`Sanction : Aucune car il possède  plus de permissions que moi
                `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
					if (logChannel != undefined){
						return logChannel.send(logsEmbed);
	
					}
            }
		}
	}
)
logsChannelF(logsChannelId, 'raid');

embedsColor(guildEmbedColor);
StateManager.on('antiraidConfF', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
