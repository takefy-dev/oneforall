const StateManager = require('../utils/StateManager');
let embedsColor = require('../function/embedsColor');
const Discord = require('discord.js')
let logsChannelF = require('../function/fetchLogs');
const memberId = new Map();
const memberName = new Map();
const guildCommandPrefixes = new Map();
const logsChannelId = new Map();
const logsModId = new Map();
const guildEmbedColor = new Map();
let count = new Map();
const countGuild = new Map();
let checkBotOwner = require('../function/check/botOwner');
const Event = require('../structures/Handler/Event');

module.exports = class guildMemberRemove extends Event {
	constructor() {
		super({
			name: 'guildMemberRemove',
		});
	}

	async run(client, member) {
		const { guild } = member
		const newInv = await guild.fetchInvites()
		for(const [code, invite] of newInv){
			guild.cachedInv.set(code, invite)
		}
// 		this.connection = StateManager.connection;
// 		// let guild = member.guild;
// 		// let memberCount = guild.memberCount;
// 		// let memberCountCh = guild.channels.cache.get(memberId.get(guild.id));
// 		// let name = memberName.get(member.guild.id);
//
// 		// memberCountCh.setName(`${name} ${memberCount}`).then(() =>{
// 		// 	console.log(" ")
// 		// })
//
// 		//#region wl remove when leave
//
// 		const isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${member.guild.id}'`)
// 		const isWlfetched = isWlFetched[0][0].whitelisted.toString();
// 		const isWl1 = isWlfetched.split(',')
// 		let isWl = false;
// 		if (isWl1.includes(member.id)) {
// 			isWl = true
// 		}
// 		;
// 		if (isWl = true) {
// 			for (let i = 0; i < isWl1.length; i++) {
//
// 				if (isWl1[i] === member.id) {
//
// 					isWl1.splice(i, 1);
// 					try {
// 						await this.connection.query(`UPDATE guildConfig SET whitelisted = '${isWl1}' WHERE guildId = '${member.guild.id}'`)
// 					} catch (err) {
// 						console.log(err);
// 					}
// 				}
// 			}
//
// 		}
// 		//#endregion wl remove when leave
//
// 		//#region owner remove when leave
// 		const isOwnerFetched = await this.connection.query(`SELECT owner FROM guildConfig WHERE guildId = '${member.guild.id}'`)
// 		const isOwnerfetched = isOwnerFetched[0][0].owner.toString();
// 		const isOwner1 = isOwnerfetched.split(',')
// 		let isOwnerss = false;
// 		if (isOwner1.includes(member.id)) {
// 			isOwnerss = true
// 		}
// 		;
// 		if (isOwnerss = true) {
// 			for (let i = 0; i < isOwner1.length; i++) {
//
// 				if (isOwner1[i] === member.id) {
//
// 					isOwner1.splice(i, 1);
// 					try {
// 						await this.connection.query(`UPDATE guildConfig SET owner = '${isOwner1}' WHERE guildId = '${member.guild.id}'`)
// 					} catch (err) {
// 						console.log(err);
// 					}
// 				}
// 			}
//
// 		}
// 		//#endregion owner remove when leave
// 		//#region  antickick
// 		const guild = member.guild
// 		const color = guildEmbedColor.get(guild.id)
// 		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
//
//
// 		let logChannelId = logsChannelId.get(guild.id);
// 		let logChannel
// 		if (logChannelId != undefined) {
// 			logChannel = guild.channels.cache.get(logChannelId)
//
// 		}
// 		;
//
//
// 		//#region  anti mass kick
// 		const isOnFetched = await this.connection.query(`SELECT antiKick FROM antiraid WHERE guildId = '${guild.id}'`);
// 		const isOnfetched = isOnFetched[0][0].antiKick;
// 		let isOn;
// 		if (isOnfetched == "1") {
// 			isOn = true
// 		}
// 		;
// 		if (isOnFetched == "0") {
// 			isOn = false
// 		}
// 		;
//
// 		let action = await guild.fetchAuditLogs({type: "KICK_MEMBERS"}).then(async (audit) => audit.entries.first());
//
// 		if (action.executor.id === client
// .user.id) return;
// 		let isOwner = checkBotOwner(guild.id, action.executor.id);
// 		const actionTime = new Date(action.createdTimestamp);
// 		const actualDate = new Date(Date.now());
// 		const formatedActionTime = parseInt(actionTime.getHours()) + parseInt(actionTime.getMinutes()) + parseInt(actionTime.getSeconds())
// 		const formatedActualtime = parseInt(actualDate.getHours()) + parseInt(actualDate.getMinutes()) + parseInt(actualDate.getSeconds())
// 		if (await (formatedActualtime - formatedActionTime) >= 0 && await (formatedActualtime - formatedActionTime) <= 3) {
// 			let logModId = logsModId.get(guild.id);
// 			let logMod
// 			if (logModId != undefined && action.action == 'MEMBER_KICK') {
// 				logMod = client
// .guilds.cache.get(member.guild.id).channels.cache.get(logModId)
// 				const embed = new Discord.MessageEmbed()
// 					.setTitle("\`🚫\` Un membre a été exclu")
// 					.setDescription(`
// 					\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a exclu :\n
// 						\`\`\`${action.target.username}\`\`\`
//
// 					`)
// 					.setTimestamp()
// 					.setFooter("🕙")
// 					.setColor(`${color}`);
// 				logMod.send(embed)
//
//
// 			}
// 			;
// 			const isWlOnFetched = await this.connection.query(`SELECT antiKick FROM antiraidWlBp WHERE guildId = '${guild.id}'`);
// 			const isWlOnfetched = isWlOnFetched[0][0].antiKick;
// 			let isOnWl;
// 			if (isWlOnfetched == "1") {
// 				isOnWl = true
// 			}
// 			;
// 			if (isWlOnfetched == "0") {
// 				isOnWl = false
// 			}
// 			;
//
// 			if (isOwner == true || guild.ownerID == action.executor.id || isOn == false) {
// 				return;
// 			} else if (isOwner == true || guild.ownerID == action.executor.id || isOn == false || isOnWl == true && isWl == true) {
// 				return;
//
//
// 			} else if (isOn == true && isOwner == false || guild.owner.id !== action.executor.id || isOnWl == true && isWl == false || isOnWl == false) {
// 				if (countGuild.get(guild.id) == undefined) {
// 					count.set(action.executor.id, 0)
// 					countGuild.set(guild.id, count)
//
// 				}
//
//
// 				// console.log(count.has(action.executor.id))
// 				let limitF = await this.connection.query(`SELECT antiKickLimit FROM antiraidconfig WHERE guildId = '${guild.id}'`);
// 				let limit = parseInt(limitF[0][0].antiKickLimit);
// 				let targetMember = guild.members.cache.get(action.executor.id);
// 				if (targetMember == undefined) {
// 					await member.guild.members.fetch().then((members) => {
// 						targetMember = members.get(action.executor.id)
// 					})
// 				}
//
// 				if (parseInt(countGuild.get(guild.id).get(action.executor.id)) < limit) {
// 					// const counter = countGuild.get(guild.id).get(action.executor.id) + 1
//
// 					countGuild.get(guild.id).set(action.executor.id, count.get(action.executor.id) + 1)
// 					const banCounter = new Discord.MessageEmbed()
// 						.setTitle("\`🚫\` Un membre a été exclu")
// 						.setDescription(`
// 				\`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a exclu :\n
// 					\`\`\`${action.target.username}\`\`\`
// 				\`🧾\` Compteur : ${count.get(action.executor.id)} exclu (${limit - count.get(action.executor.id) + 1} exclu avant d'executer la sanction)
//
// 				`)
// 						.setTimestamp()
// 						.setFooter("🕙")
// 						.setColor(`${color}`);
//
//
// 					if (logChannel == undefined || logChannel.guild.id != member.guild.id) return;
//
//
// 					logChannel.send(banCounter)
// 				} else {
// 					let guild1 = client
// .guilds.cache.find(g => g.id === guild.id);
//
//
// 					countGuild.get(guild1.id).set(action.executor.id, parseInt(count.get(action.executor.id)) + 1)
//
//
// 					let after = await this.connection.query(`SELECT antiKick FROM antiraidconfig WHERE guildId = '${guild.id}'`)
//
//
// 					if (targetMember.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
//
// 						if (after[0][0].antiKick === 'ban') {
// 							guild1.members.ban(getKey(countGuild.get(guild.id), limit), `OneForAll - Type: antiMassKick `)
// 						} else if (after[0][0].antiKick === 'kick') {
// 							guild1.member(getKey(countGuild.get(guild.id), limit)).kick(
// 								`OneForAll - Type: antiMassKick `
// 							)
// 						} else if (after[0][0].antiKick === 'unrank') {
// 							let roles = []
// 							let role = await guild1.member(getKey(countGuild.get(guild.id), limit)).roles.cache
// 								.map(role => roles.push(role.id))
// 							role
// 							guild1.members.cache.get(getKey(countGuild.get(guild.id), limit)).roles.remove(roles, `OneForAll - Type: antiMassKick`)
// 							if (action.executor.bot) {
// 								let botRole = targetMember.roles.cache.filter(r => r.managed)
// 								// let r = guild.roles.cache.get(botRole.id)
//
// 								for (const [id] of botRole) {
// 									botRole = guild.roles.cache.get(id)
// 								}
// 								botRole.setPermissions(0, `OneForAll - Type: antiMassKick `)
// 							}
// 						}
//
// 						const logsEmbed = new Discord.MessageEmbed()
// 							.setTitle("\`🚫\` Un membre a été exclu")
// 							.setDescription(`
// 			   \`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a exclu ${countGuild.get(guild.id).get(action.executor.id)} membre(s) :\n
// 				\`\`\`${action.target.username}\`\`\`
// 			   \`🧾\` Sanction : ${after[0][0].antiKick}
//
// 			`)
// 							.setTimestamp()
// 							.setFooter("🕙")
// 							.setColor(`${color}`)
// 						if (logChannel != undefined) {
// 							logChannel.send(logsEmbed);
//
// 						}
// 					} else {
//
//
// 						const logsEmbed = new Discord.MessageEmbed()
// 							.setTitle("\`🚫\` Un membre a été exclu")
// 							.setDescription(`
// 						\`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a exclu ${countGuild.get(guild.id).get(action.executor.id)} membre(s) :\n
// 							\`\`\`${action.target.username}\`\`\`
// 							\`🧾\`Sanction : Aucune car il possède  plus de permissions que moi
// 						`)
// 							.setTimestamp()
// 							.setFooter("🕙")
// 							.setColor(`${color}`)
// 						if (logChannel != undefined) {
// 							logChannel.send(logsEmbed);
//
// 						}
// 					}
// 				}
//
//
// 			}
// 		}
//
// 		//#endregion anti mass kick


	}
}
logsChannelF(logsChannelId, 'raid');
logsChannelF(logsModId, 'mod');

embedsColor(guildEmbedColor);
// StateManager.on('memberCountChannelFetched', (guildId, count) => {
// 	memberId.set(guildId, count)
// })
// StateManager.on('memberCountChannelUpdate', (guildId, count) => {
// 	memberId.set(guildId, count)
// })
// StateManager.on('memberNameFetched', (guildId, name) => {
// 	memberName.set(guildId, name)
// })
// StateManager.on('memberNameUpdate', (guildId, name) => {
// 	memberName.set(guildId, name)
// })