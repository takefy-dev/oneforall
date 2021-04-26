const StateManager = require('../../utils/StateManager');
const Event = require('../../structures/Handler/Event');

let checkBotOwner = require('../../function/check/botOwner');
const guildEmbedColor = new Map();
let checkWl = require('../../function/check/checkWl');
let logsChannelF = require('../../function/fetchLogs');
let embedsColor = require('../../function/embedsColor');
const Discord = require('discord.js')
const logsChannelId = new Map();
const guildAntiraidConfig = new Map();
module.exports = class guildRegionUpdate extends Event {
	constructor() {
		super({
			name: 'guildRegionUpdate',
		});
	}

	async run(client, guild, oldRegion, newRegion) {

		const color = guildEmbedColor.get(guild.id)
		this.connection = StateManager.connection;

		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
		const isOnFetched = await this.connection.query(`SELECT regionUpdate FROM antiraid WHERE guildId = '${guild.id}'`);
		const isOnfetched = isOnFetched[0][0].regionUpdate;
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
			action = await guild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());

		} else {
			return;
		}

		// console.log("ss", checkBotOwner(channel.guild.id, action.executor.id))
		if (action.changes[0].key == 'region' && action.executor.id != client
.user.id) {
			let logChannelId = logsChannelId.get(guild.id);
			let logChannel;
			if (logChannelId != undefined) {
				logChannel = client
.guilds.cache.get(guild.id).channels.cache.get(logChannelId)
			}

			let isOwner = checkBotOwner(guild.id, action.executor.id);


			const isWlOnFetched = await this.connection.query(`SELECT regionUpdate FROM antiraidWlBp WHERE guildId = '${guild.id}'`);
			const isWlOnfetched = isWlOnFetched[0][0].regionUpdate;
			let isOnWl;
			if (isWlOnfetched == "1") {
				isOnWl = true
			}
			;
			if (isWlOnfetched == "0") {
				isOnWl = false
			}
			;
			if (isOnWl == true) {
				let isWl = checkWl(guild.id, action.executor.id);

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
				try {
					await guild.setRegion(oldRegion, `OneForAll - Type: guildUpdate - changeRegion`)
				} catch (e) {
					console.log("err", e)
					if (e.toString().toLowerCase().includes('missing permissions')) {

						const logsEmbed = new Discord.MessageEmbed()
							.setTitle('\`📣\` Modification de région')
							.setDescription(`
                        \`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié la région du serveur \n
                        \`\`\`${oldRegion} en ${newRegion}\`\`\`
                        
                        \`🧾\`Erreur : Je n'ai pas assez de permissions pour remodifier la région
						`)
							.setTimestamp()
							.setFooter("🕙")
							.setColor(`${color}`)
						if (logChannel != undefined) {
							logChannel.send(logsEmbed);
						}
					}
				}

				let after = guildAntiraidConfig.get(guild.id);


				let targetMember = guild.members.cache.get(action.executor.id);
				if (targetMember == undefined) {
					await guild.members.fetch().then((members) => {
						targetMember = members.get(action.executor.id)
					})
				}
				if (targetMember.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {

					if (after.regionUpdate == 'ban') {
						guild.members.ban(action.executor.id)


					} else if (after.regionUpdate == 'kick') {
						guild.member(action.executor.id).kick(
							`OneForAll - Type: guildUpdate - changeRegion`
						)


					} else if (after.regionUpdate == 'unrank') {

						let roles = []
						let role = await guild.member(action.executor.id).roles.cache
							.map(role => roles.push(role.id))
						role
						guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: guildUpdate - changeRegion`)
						if (action.executor.bot) {
							let botRole = targetMember.roles.cache.filter(r => r.managed)
							// let r = guild.roles.cache.get(botRole.id)

							for (const [id] of botRole) {
								botRole = guild.roles.cache.get(id)
							}
							botRole.setPermissions(0, `OneForAll - Type: guildUpdate - changeRegion`)
						}


					}


					if (logChannel != undefined) {
						if (action.executor.id === client
.user.id) return;
						const logsEmbed = new Discord.MessageEmbed()
							.setTitle('\`📣\` Modification de région')
							.setDescription(`
					\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié la région du serveur \n
					\`\`\`${oldRegion} en ${newRegion}\`\`\`
           \`🧾\` Sanction : ${after.regionUpdate}

        `)
							.setTimestamp()
							.setFooter("🕙")
							.setColor(`${color}`)
						logChannel.send(logsEmbed);
					}

				} else {


					const logsEmbed = new Discord.MessageEmbed()
						.setTitle('\`📣\` Modification de région')
						.setDescription(`
				\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié la région du serveur \n
				\`\`\`${oldRegion} en ${newRegion}\`\`\`
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
	}
};
logsChannelF(logsChannelId, 'raid');
embedsColor(guildEmbedColor);
StateManager.on('antiraidConfF', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})


