const StateManager = require('../utils/StateManager');
var checkBotOwner = require('../function/check/botOwner');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
var checkWl = require('../function/check/checkWl');
const guildAntiraidConfig = new Map();
const logsChannelId = new Map();
const logsModId = new Map();
const Discord = require('discord.js')
const guildEmbedColor = new Map();
var count = new Map();
const countGuild = new Map();
const { Event } = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'guildBanAdd',
	},
	module.exports = async (handler, guild, user) => {
		this.connection = StateManager.connection;
		function getKey(map, val) {
			return [...map].find(([key, value]) => val === value)[0];
		}
		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
		const color = guildEmbedColor.get(guild.id)
		let logChannelId = logsChannelId.get(guild.id);
		let logChannel
		if (logChannelId != undefined) {
			logChannel = handler.client.guilds.cache.get(guild.id).channels.cache.get(logChannelId)
			
		
		};
		let action = await guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD" }).then(async (audit) => audit.entries.first());

		let logModId = logsModId.get(guild.id);
		let logMod
		
		if (logModId != undefined) {
			logMod = handler.client.guilds.cache.get(guild.id).channels.cache.get(logModId)
			if(logMod == undefined) return
			const embed = new Discord.MessageEmbed()
				.setTitle("\`🚫\` Ajout d'un bannissement à un membre")
				.setDescription(`
			\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a banni :\n
				\`\`\`${action.target.username}\`\`\`
			`)
				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`);
			logMod.send(embed)
		};
		const isOnFetched = await this.connection.query(`SELECT ban FROM antiraid WHERE guildId = '${guild.id}'`);
		const isOnfetched = isOnFetched[0][0].ban;
		let isOn;
		if (isOnfetched == "1") { isOn = true };
		if (isOnFetched == "0") { isOn = false };


		if (action.executor.id === handler.client.user.id) return;
		var isOwner = checkBotOwner(guild.id, action.executor.id);


		const isWlOnFetched = await this.connection.query(`SELECT ban FROM antiraidWlBp WHERE guildId = '${guild.id}'`);
		const isWlOnfetched = isWlOnFetched[0][0].ban;
		let isOnWl;
		if (isWlOnfetched == "1") { isOnWl = true };
		if (isWlOnfetched == "0") { isOnWl = false };
		var isWl;
		if (isOnWl == true) {
			isWl = checkWl(guild.id, action.executor.id);
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


		} else if (isOn == true && isOwner == false || guild.ownerID !== action.executor.id || isOnWl == true && isWl == false || isOnWl == false) {
			if(!count.has(action.executor.id)){
				count.set(action.executor.id, 0)
			
			}
		


			// console.log(count.has(action.executor.id))
			let after = guildAntiraidConfig.get(guild.id);

			
			let limit = parseInt(after.antiBanLimit);
			let targetMember = guild.members.cache.get(action.executor.id);
			if (targetMember == undefined) {
				await guild.members.fetch().then((members) => {
					targetMember = members.get(action.executor.id)
				})
			}

			if (parseInt(count.get(action.executor.id)) < limit) {
				// const counter = countGuild.get(guild.id).get(action.executor.id) + 1
			
				const add = count.get(action.executor.id) + 1
				count.set(action.executor.id, add)
				const banCounter = new Discord.MessageEmbed()
					.setTitle("\`🚫\` Ajout d'un bannissement à un membre")
					.setDescription(`
				\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a banni :\n
					\`\`\`${user.tag}\`\`\`
				\`🧾\` Compteur : ${count.get(action.executor.id)} ban (${limit - count.get(action.executor.id) + 1} ban avant d'executer la sanction)
		
				`)
					.setTimestamp()
					.setFooter("🕙")
					.setColor(`${color}`);


				if(logChannel != undefined){
					logChannel.send(banCounter)

				}
			} else {
				let guild1 = handler.client.guilds.cache.find(g => g.id === guild.id);

				const add = count.get(action.executor.id) + 1
				count.set(action.executor.id, add)



				// console.log("limit", limit)
				// console.log("count",countGuild.get(guild.id))
				// for(member of countGuild.get(guild.id).keys()){
				// 	console.log(member)
				// }
				// console.log("getkey",getKey(countGuild.get(guild.id)))

				if (targetMember.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {

					if (after.ban === 'ban') {
						guild1.members.ban(action.executor.id).then(() =>{
							count.delete(action.executor.id)
						})
					} else if (after.ban === 'kick') {
						guild1.member(action.executor.id).kick(
							`OneForAll - Type: antiMassBan `
						).then(() =>{
							count.delete(action.executor.id)
						})
					} else if (after.ban === 'unrank') {
						let roles = []
						let role = await guild1.member(action.executor.id).roles.cache
							.map(role => roles.push(role.id))
						role
						guild1.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: antiMassBan`).then(() =>{
							count.delete(action.executor.id)
						})
						if (action.executor.bot) {
							let botRole = targetMember.roles.cache.filter(r => r.managed)
							// let r = guild.roles.cache.get(botRole.id)
							
							for(const[id] of botRole){
								botRole = guild.roles.cache.get(id)
							}
							botRole.setPermissions(0,  `OneForAll - Type: antiMassBan`).then(() =>{
								count.delete(action.executor.id)
							})
							
						}
					}

					const logsEmbed = new Discord.MessageEmbed()
						.setTitle("\`🚫\` Ajout d'un bannissement à un membre")
						.setDescription(`
			   \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a banni ${count.get(action.executor.id)} membre(s) :\n
				\`\`\`${user.tag}\`\`\`
			   \`🧾\` Sanction : ${after.ban}
	
			`)
						.setTimestamp()
						.setFooter("🕙")
						.setColor(`${color}`)



					if(logChannel != undefined){
						logChannel.send(logsEmbed)
	
					}
				}else {
					

		
					const logsEmbed = new Discord.MessageEmbed()
					.setTitle("\`🚫\` Ajout d'un bannissement à un membre")
					.setDescription(`
					\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a banni ${count.get(action.executor.id)} membre(s) :\n
						\`\`\`${user.tag}\`\`\`
						\`🧾\`Sanction : Aucune car il possède  plus de permissions que moi
					`)
						.setTimestamp()
						.setFooter("🕙")
						.setColor(`${color}`)
						if(logChannel != undefined){
							logChannel.send(logsEmbed)
		
						}
				}
			}



		}
	}
);
logsChannelF(logsChannelId, 'raid');
logsChannelF(logsModId, 'mod');

embedsColor(guildEmbedColor);
StateManager.on('banCountReset', () => {
	countGuild.clear()
})
StateManager.on('antiraidConfF', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
