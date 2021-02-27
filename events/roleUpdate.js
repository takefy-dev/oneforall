const StateManager = require('../utils/StateManager');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
var logsChannelF = require('../function/fetchLogs');
const logsChannelId = new Map();
const guildAntiraidConfig = new Map();
const guildEmbedColor = new Map();
var checkBotOwner = require('../function/check/botOwner');
const Discord = require('discord.js')
var checkWl = require('../function/check/checkWl');
const { Event } = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'roleUpdate',
	},
	module.exports = async (handler, oldRole, newRole) => {
		this.connection  = StateManager.connection;
		if (oldRole === newRole) return;
		const color = guildEmbedColor.get(oldRole.guild.id)
		let logChannelId = logsChannelId.get(oldRole.guild.id);
     

		let logChannel
		if (logChannelId != undefined) {
			logChannel = oldRole.guild.channels.cache.get(logChannelId)

		}

		let guild = oldRole.guild;
		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
		const isOnFetched = await this.connection.query(`SELECT roleUpdate FROM antiraid WHERE guildId = '${guild.id}'`);
		const isOnfetched = isOnFetched[0][0].roleUpdate;
		let isOn;
		if (isOnfetched == "1") { isOn = true };
		if (isOnFetched == "0") { isOn = false };

		let action;
		if (isOn) {
			action = await oldRole.guild.fetchAuditLogs({ type: "ROLE_UPDATE" }).then(async (audit) => audit.entries.first());

		} else {
			return;
		}
		const actionTime = new Date(action.createdTimestamp);
		const actualDate = new Date(Date.now());

		const formatedActionTime = parseInt(actionTime.getHours()) + parseInt(actionTime.getMinutes()) + parseInt(actionTime.getSeconds())
		const formatedActualtime = parseInt(actualDate.getHours()) + parseInt(actualDate.getMinutes()) + parseInt(actualDate.getSeconds())
		if (action.executor.id === handler.client.user.id) return;
		if (await (formatedActualtime - formatedActionTime) >= 0 && await (formatedActualtime - formatedActionTime) <= 3) {
			var isOwner = checkBotOwner(oldRole.guild.id, action.executor.id);


			const isWlOnFetched = await this.connection.query(`SELECT roleUpdate FROM antiraidWlBp WHERE guildId = '${guild.id}'`);
			const isWlOnfetched = isWlOnFetched[0][0].roleUpdate;
			let isOnWl;
			if (isWlOnfetched == "1") { isOnWl = true };
			if (isWlOnfetched == "0") { isOnWl = false };
			if (isOnWl == true) {
				var isWl = checkWl(oldRole.guild.id, action.executor.id);

			}
			// let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${guild.id}'`);
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
				if (action.executor.id === handler.client.user.id) return;
				let guild = handler.client.guilds.cache.find(guild => guild.id === action.target.guild.id);

				let targetMember = guild.members.cache.get(action.executor.id);
				if (targetMember == undefined) {
					await oldRole.guild.members.fetch().then((members) => {
						targetMember = members.get(action.executor.id)
					})
				}
				if (oldRole.managed == true && newRole.managed == true) {
					return
				}
				try{
					await oldRole.setName(oldRole.name)
					await oldRole.setPermissions(oldRole.permissions)
					// console.log("miss")
				}catch(e){
					console.log("err", e)
					if(e.toString().toLowerCase().includes('missing permissions')){

		
						const logsEmbed = new Discord.MessageEmbed()
						.setTitle(`\`❌\`Modification d'un rôle `)
						.setDescription(`
						\`👨‍💻\`Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a modifié le rôle : "**${oldRole.name}**"\n
						\`\`\`➡ : ${action.target.name}\`\`\`
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
			

				let after = guildAntiraidConfig.get(oldRole.guild.id);

				if (targetMember.roles.highest.comparePositionTo(oldRole.guild.me.roles.highest) <= 0) {

					if (after.roleUpdate === 'ban') {
						guild.members.ban(action.executor.id)
					} else if (after.roleUpdate === 'kick') {
						guild.member(action.executor.id).kick(
							 `OneForAll - Type: roleUpdate `
						)
					} else if (after.roleUpdate === 'unrank') {
						let roles = []
						let role = await guild.member(action.executor.id).roles.cache
							.map(role => roles.push(role.id))
						role
						guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: roleUpdate`)
						if (action.executor.bot) {
							let botRole = targetMember.roles.cache.filter(r => r.managed)
						// let r = guild.roles.cache.get(botRole.id)
						
						for(const[id] of botRole){
							botRole = guild.roles.cache.get(id)
						}
						botRole.setPermissions(0, `OneForAll - Type: roleUpdate`)
						}
					}
					

					const logsEmbed = new Discord.MessageEmbed()
						.setTitle(`\`❌\`Modification d'un rôle `)
						.setDescription(`
				\`👨‍💻\`Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a modifié le rôle : "**${oldRole.name}**"\n
				\`\`\`➡ : ${action.target.name}\`\`\`
				\`🧾\`Sanction : ${after.roleUpdate}
	
			`)
						.setTimestamp()
						.setFooter('🕙')
						.setColor(`${color}`);
						if(logChannel != undefined){
							logChannel.send(logsEmbed);

						}

				}else {
					

		
					const logsEmbed = new Discord.MessageEmbed()
					.setTitle(`\`❌\`Modification d'un rôle `)
					.setDescription(`
					\`👨‍💻\`Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a modifié le rôle : "**${oldRole.name}**"\n
					\`\`\`➡ : ${action.target.name}\`\`\`
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
