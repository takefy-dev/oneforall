const StateManager = require('../../utils/StateManager');
const guildCommandPrefixes = new Map();
let checkBotOwner = require('../../function/check/botOwner');
let logsChannelF = require('../../function/fetchLogs');
let embedsColor = require('../../function/embedsColor');
const logsChannelId = new Map();
const guildEmbedColor = new Map();
const Discord = require('discord.js');
const { cpus } = require('os');
const msgInvite = new Map();
const channelInvite = new Map();
const guildInvites = new Map();
// const onlineId = new Map();
const memberId = new Map();
const memberName = new Map();
const inviteOn = new Map();
const ms = require("ms");
const moment = require("moment");
const guildAntiraidConfig = new Map();
const isBlFetched = require('../../function/check/checkBl')
// const voiceId = new Map();
const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
const Event = require('../../structures/Handler/Event');

module.exports = class guildMemberAdd extends Event {
	constructor() {
		super({
			name: 'guildMemberAdd',
		});
	}

	async run(client, member) {
		this.connection = StateManager.connection;

		if (!guildInvites.has(member.guild.id)) {
			if (member.guild.me.hasPermission('MANAGE_GUILD')) {
				await member.guild.fetchInvites()
					.then(invites => {
						guildInvites.set(member.guild.id, invites)
					}).catch((err) => {
						console.log(err)
					})

			}
		}
		const color = guildEmbedColor.get(member.guild.id)
		let logChannelId = logsChannelId.get(member.guild.id);
		let guild = member.guild;
		let logChannel
		if (logChannelId != undefined) {
			logChannel = client
.guilds.cache.get(member.guild.id).channels.cache.get(logChannelId)


		}
		;
		//#region blacklist
		const isOnBlF = await this.connection.query(`SELECT isOn FROM blacklist WHERE userId = '${member.guild.ownerID}'`)
		if (isOnBlF[0][0] != undefined) {
			let isOnBl = isOnBlF[0][0].isOn;
			if (isOnBl == '1') {
				const isBl = isBlFetched(member.guild.ownerID, member.id);
				if (isBl == true) {
					member.guild.members.ban(member.id, {reason: `Blacklist`}).then(() => {
						if (logChannel == undefined || logChannel.guild.id != member.guild.id) return;

						const logsEmbed = new Discord.MessageEmbed()
							.setTitle("\`🤵\` Un membre a rejoins en étant blacklist !")
							.setDescription(`
						\`👨‍💻\` Auteur : **${member}** \`(${member.id})\` est blacklist:\n
						\`🧾\` Sanction : Ban
					
						`)
							.setTimestamp()
							.setFooter("🕙")
							.setColor(`${color}`)
						if (logChannel != undefined) {
							logChannel.send(logsEmbed);

						}
					})
				}
			}
		}
		////#endregion blacklist


		//#region anti alt
		const isOnF = await this.connection.query(`SELECT antiDc FROM antiraid WHERE guildId = '${member.guild.id}'`)
		let isOnSS = isOnF[0][0].antiDc
		if (isOnSS == '1') {
			const time = ms(Date.now() - member.user.createdTimestamp, {long: true});
			const requireTimeF = await this.connection.query(`SELECT antiDcLimit FROM antiraidconfig WHERE guildId = '${member.guild.id}'`)
			const requireTime = requireTimeF[0][0].antiDcLimit;


			if (requireTime.includes("day") || requireTime.includes("days")) {
				if (parseInt(requireTime.replace(" days", " ").replace(" day", " ")) > parseInt(time.replace(" days", " ").replace(" day", " ")) || time.includes(" hours") || time.includes(" hour") || time.includes(" minutes") || time.includes(" minute") || time.includes(" secondes") || time.includes(" second")) {
					alt(member)
				}
			} else if (requireTime.includes("hours") || requireTime.includes("hour")) {
				if (requireTime.replace(" hours", " ").replace(" hour", " ") > time.replace(" hours", " ").replace(" hour", " ") || time.includes(" minutes") || time.includes(" minute") || time.includes(" secondes") || time.includes(" second")) {
					alt(member)
				}
			} else if (requireTime.includes("minutes") || requireTime.includes("minute")) {
				if (requireTime.replace(" minutes", " ").replace(" minute", " ") > time.replace(" minutes", " ").replace(" minute", " ") || time.includes(" secondes") || time.includes(" second")) {
					alt(member)
				}
			} else if (requireTime.includes("seconds") || requireTime.includes("second")) {
				if (requireTime.replace(" seconds", " ").replace(" second", " ") > time.replace(" seconds", " ").replace(" second", " ")) {
					alt(member)
				}
			}

			async function alt(member) {
				this.connection = StateManager.connection;
				let guild1 = client
.guilds.cache.find(guild => guild.id === member.guild.id);

				let sanctionF = guildAntiraidConfig.get(guild1.id);

				const rejetEmbed = new Discord.MessageEmbed()
					.setTitle(`**Compte créé trop récemment !**`)
					.setDescription(`Bonjour ${member}, \n
		Vous avez été **${sanctionF.antiDc}** car vous avez rejoins avec un compte créé trop récemment.
	`)
					.setColor(`${color}`)
					.setTimestamp()
					.setFooter(`OneForAll`)

				member.send(rejetEmbed)
				sleep(500);

				if (sanctionF.antiDc === 'ban') {
					guild1.members.ban(member.id)
				} else if (sanctionF.antiDc === 'kick') {
					guild1.member(member.id).kick({
						reason: `OneForAll - Type: antiDc`
					})
				}


				const logsEmbed = new Discord.MessageEmbed()
					.setTitle("\`🤵\` Un membre a rejoins avec un compte créé trop récemment !")
					.setDescription(`
	   \`👨‍💻\` Auteur : **${member}** \`(${member.id})\` à créé son compte il y a:\n
		\`\`\`${time}\`\`\`
	   \`🧾\` Sanction : ${sanctionF.antiDc}

		`)
					.setTimestamp()
					.setFooter("🕙")
					.setColor(`${color}`)
				if (logChannel != undefined) {
					logChannel.send(logsEmbed);

				}
			}


		}

		//#endregion anti alt

		//#region  invite
		const isOnss = inviteOn.get(guild.id);
		if (isOnss == '1') {
			if (member.user.bot == false) {
				const cachedInv = guildInvites.get(member.guild.id);
				const newInv = await member.guild.fetchInvites();

				guildInvites.set(member.guild.id, newInv);
				try {
					const usedInv = newInv.find(inv => cachedInv.get(inv.code).uses < inv.uses)
					const chInv = member.guild.channels.cache.get(channelInvite.get(member.guild.id));
					const msgPreset = msgInvite.get(member.guild.id);
					const invited = `<@${member.id}>`;
					if (usedInv == undefined) {
						if (member.guild.features.includes("VANITY_URL")) {
							member.guild.fetchVanityData()
								.then(res => {
									if (res.code) {
										chInv.send(`<@${member.id}> a été invite par l'url personnalisé du serveur`)

									} else {
										return;
									}
									;
								})
								.catch(console.error);
						}
					}
					let inviter;
					let count;
					let memberTotal;
					if (usedInv != undefined) {
						inviter = `${guild.members.cache.get(usedInv.inviter.id).user.tag}`;
						count = `${usedInv.uses}`;
						memberTotal = `${member.guild.memberCount}`
					}


					const space = `\n`
					if (chInv != undefined && usedInv != undefined) {
						if (msgPreset.includes("${invited}") || msgPreset.includes("${inviter}") || msgPreset.includes("${count}") || msgPreset.includes("${memberTotal}") || msgPreset.includes("${space}")) {
							let msg
							if (msgPreset.includes("${inviter}")) {
								msg = msgPreset.replace("${inviter}", inviter)
								msg = msg.replace("${invited}", invited);
								msg = msg.replace("${count}", count)
								msg = msg.replace("${memberTotal}", memberTotal)
								while (msg.includes("${space}")) {
									msg = msg.replace("${space}", space)
								}
							} else if (msgPreset.includes("${invited}")) {
								msg = msgPreset.replace("${inviter}", inviter)
								msg = msg.replace("${invited}", invited);
								msg = msg.replace("${count}", count)
								msg = msg.replace("${memberTotal}", memberTotal)
								while (msg.includes("${space}")) {
									msg = msg.replace("${space}", space)
								}
							} else if (msgPreset.includes("${memberTotal}")) {
								msg = msgPreset.replace("${inviter}", inviter)
								msg = msg.replace("${invited}", invited);
								msg = msg.replace("${count}", count)
								msg = msg.replace("${memberTotal}", memberTotal)
								while (msg.includes("${space}")) {
									msg = msg.replace("${space}", space)
								}
							} else if (msgPreset.includes("${memberTotal}")) {
								msg = msgPreset.replace("${inviter}", inviter)
								msg = msg.replace("${invited}", invited);
								msg = msg.replace("${count}", count)
								msg = msg.replace("${memberTotal}", memberTotal)
								while (msg.includes("${space}")) {
									msg = msg.replace("${space}", space)
								}
							} else if (msgPreset.includes("${space}")) {
								msg = msgPreset.replace("${inviter}", inviter)
								msg = msg.replace("${invited}", invited);
								msg = msg.replace("${count}", count)
								msg = msg.replace("${memberTotal}", memberTotal)
								while (msg.includes("${space}")) {
									msg = msg.replace("${space}", space)
								}
							} else {
								msg = msgPreset;
							}

							chInv.send(`${msg}`)
						}


					}


				} catch (err) {
					console.log(err);
				}
			}
		}
		//#endregion invite


		//#region antiraid

		// if (oldRole === newRole) return;

		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
		const isOnFetched = await this.connection.query(`SELECT bot FROM antiraid WHERE guildId = '${member.guild.id}'`);
		const isOnfetched = isOnFetched[0][0].bot;
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
			if (member.user.bot == false) return;
			action = await member.guild.fetchAuditLogs({type: "BOT_ADD",}).then((audit) => audit.entries.first());

		} else {
			return;
		}
		if (action.executor.id === client
.user.id) return;
		let isOwner = checkBotOwner(guild.id, action.executor.id);


		const isWlOnFetched = await this.connection.query(`SELECT bot FROM antiraidWlBp WHERE guildId = '${member.guild.id}'`);
		const isWlOnfetched = isWlOnFetched[0][0].bot;
		let isOnWl;
		if (isWlOnfetched == "1") {
			isOnWl = true
		}
		;
		if (isWlOnfetched == "0") {
			isOnWl = false
		}
		;

		let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${member.guild.id}'`);
		let isWlfetched = isWlFetched[0][0].whitelisted.toString();
		let isWl1 = isWlfetched.split(",");
		let isWl;
		if (isWl1.includes(action.executor.id)) {
			isWl = true
		}
		;
		if (!isWl1.includes(action.executor.id)) {
			isWl = false
		}
		;

		if (isOwner == true || member.guild.ownerID == action.executor.id || isOn == false) {
			return;
		} else if (isOwner == true || member.guild.ownerID == action.executor.id || isOn == false || isOnWl == true && isWl == true) {

			return;
		} else if (isOn == true && isOwner == false || guild.owner.id !== action.executor.id || isOnWl == true && isWl == false || isOnWl == false) {
			try {
				member.kick(action.target.id)

			} catch (e) {
				if (e.toString().toLowerCase().includes('missing permissions')) {


					const logsEmbed = new Discord.MessageEmbed()
						.setTitle("\`🤖\` Ajout d'un Bot")
						.setDescription(`
				\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a ajouté le bot :\n
					\`\`\`${action.target.username}\`\`\`
					
					\`🧾\`Erreur : Je n'ai pas assé de permissions pour remodifier ce rôles
					`)
						.setTimestamp()
						.setFooter("🕙")
						.setColor(`${color}`)
					if (logChannel != undefined) {
						logChannel.send(logsEmbed);

					}

				}
			}
			let after = await this.connection.query(`SELECT bot FROM antiraidconfig WHERE guildId = '${member.guild.id}'`)


			let guild1 = client
.guilds.cache.find(guild => guild.id === member.guild.id);
			let targetMember = guild1.members.cache.get(action.executor.id);
			if (targetMember.roles.highest.comparePositionTo(member.guild.me.roles.highest) <= 0) {

				if (after[0][0].bot === 'ban') {
					guild1.members.ban(action.executor.id)
				} else if (after[0][0].bot === 'kick') {
					guild1.member(action.executor.id).kick(
						`OneForAll - Type: botAdd `
					)
				} else if (after[0][0].bot === 'unrank') {
					let roles = []
					let role = await guild1.member(action.executor.id).roles.cache
						.map(role => roles.push(role.id))
					role
					guild1.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: botAdd`)
					if (action.executor.bot) {
						let botRole = targetMember.roles.cache.filter(r => r.managed)
						// let r = guild.roles.cache.get(botRole.id)

						for (const [id] of botRole) {
							botRole = guild.roles.cache.get(id)
						}
						botRole.setPermissions(0, `OneForAll - Type: botAdd `)
					}
				}


				if (logChannel != undefined) {
					const logsEmbed = new Discord.MessageEmbed()
						.setTitle("\`🤖\` Ajout d'un Bot")
						.setDescription(`
           \`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a ajouté le bot :\n
            \`\`\`${action.target.username}\`\`\`
           \`🧾\` Sanction : ${after[0][0].bot}

        `)
						.setTimestamp()
						.setFooter("🕙")
						.setColor(`${color}`)
					logChannel.send(logsEmbed);
				}

			} else {


				const logsEmbed = new Discord.MessageEmbed()
					.setTitle("\`🤖\` Ajout d'un Bot")
					.setDescription(`
						\`👨‍💻\` Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a ajouté le bot :\n
						\`\`\`${action.target.username}\`\`\`
						\`🧾\`Sanction : Aucune car il possède  plus de permissions que moi
						`)
					.setTimestamp()
					.setFooter("🕙")
					.setColor(`${color}`)
				if (logChannel != undefined) {
					logChannel.send(logsEmbed);

				}
			}
			//#endregion
		}

	}
}

logsChannelF(logsChannelId, 'raid');

embedsColor(guildEmbedColor);
StateManager.on('welcomeMsgUpdate', (guildId, msg) => {
	msgInvite.set(guildId, msg)
})

StateManager.on('welcomeMsgFetched', (guildId, msg) => {
	msgInvite.set(guildId, msg)
})
StateManager.on('inviteChannelUpdate', (guildId, ch) => {
	channelInvite.set(guildId, ch)
})

StateManager.on('inviteChannelFetched', (guildId, ch) => {
	channelInvite.set(guildId, ch)
})

StateManager.on('newInv', (guildId, inv) => {
	guildInvites.set(guildId, inv)
})

StateManager.on('inviteOn', (guildId, soutienMsgs) => {
	inviteOn.set(guildId, soutienMsgs);
})
StateManager.on('inviteOnFetched', (guildId, invte) => {
	inviteOn.set(guildId, invte);
})

StateManager.on('antiraidConfF', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
