const StateManager = require('../utils/StateManager');
const Event = require('../structures/Handler/Event');

let checkBotOwner = require('../function/check/botOwner');
const guildEmbedColor = new Map();
let checkWl = require('../function/check/checkWl');
let logsChannelF = require('../function/fetchLogs');
let embedsColor = require('../function/embedsColor');
const Discord = require('discord.js')
const logsChannelId = new Map();
const guildAntiraidConfig = new Map();
module.exports = class guildUpdate extends Event {
	constructor() {
		super({
			name: 'guildUpdate',
		});
	}

	async run(client, oldGuild, newGuild) {

		const color = guildEmbedColor.get(oldGuild.id)
		this.connection = StateManager.connection;

		if (!oldGuild.me.hasPermission("VIEW_AUDIT_LOG")) return;
		const isOnFetched = await this.connection.query(`SELECT nameUpdate FROM antiraid WHERE guildId = '${oldGuild.id}'`);
		const isOnfetched = isOnFetched[0][0].nameUpdate;
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
			action = await oldGuild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(async (audit) => audit.entries.first());

		} else {
			return;
		}
		// console.log("ss", checkBotOwner(channel.guild.id, action.executor.id))
		if (action.changes[0].key == 'name' && action.executor.id != client
.user.id) {
			let logChannelId = logsChannelId.get(oldGuild.id);
			let logChannel;
			if (logChannelId != undefined) {
				logChannel = client
.guilds.cache.get(oldGuild.id).channels.cache.get(logChannelId)
			}

			let isOwner = checkBotOwner(oldGuild.id, action.executor.id);


			const isWlOnFetched = await this.connection.query(`SELECT nameUpdate FROM antiraidWlBp WHERE guildId = '${oldGuild.id}'`);
			const isWlOnfetched = isWlOnFetched[0][0].nameUpdate;
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
				let isWl = checkWl(oldGuild.id, action.executor.id);

			}
			// let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${channel.guild.id}'`);
			// let isWlfetched = isWlFetched[0][0].whitelisted.toString();
			// let isWl1 = isWlfetched.split(",");
			// let isWl;
			// if (isWl1.includes(action.executor.id)) { isWl = true };
			// if (!isWl1.includes(action.executor.id)) { isWl = false };
			if (isOwner == true || oldGuild.ownerID == action.executor.id || isOn == false) {
				return;
			} else if (isOwner == true || oldGuild.ownerID == action.executor.id || isOn == false || isOnWl == true && isWl == true) {
				return;
			} else if (isOn == true && isOwner == false || oldGuild.owner.id !== action.executor.id || isOnWl == true && isWl == false || isOnWl == false) {
				try {
					await oldGuild.setName(action.changes[0].old, `OneForAll - Type: guildUpdate - changeName`)
				} catch (e) {

					if (e.toString().toLowerCase().includes('missing permissions')) {


						const logsEmbed = new Discord.MessageEmbed()
							.setTitle('\`📣\` Modification du nom du serveur')
							.setDescription(`
					\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié le nom du serveur \n
                        \`\`\`${action.changes[0].old} en ${action.changes[0].new}\`\`\`
                        
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

				let after = guildAntiraidConfig.get(oldGuild.id);


				let targetMember = oldGuild.members.cache.get(action.executor.id);
				if (targetMember == undefined) {
					await oldGuild.guild.members.fetch().then((members) => {
						targetMember = members.get(action.executor.id)
					})
				}
				if (targetMember.roles.highest.comparePositionTo(oldGuild.me.roles.highest) <= 0) {

					if (after.regionUpdate == 'ban') {
						oldGuild.members.ban(action.executor.id)


					} else if (after.nameUpdate == 'kick') {
						oldGuild.member(action.executor.id).kick(
							`OneForAll - Type: guildUpdate - changeName`
						)


					} else if (after.nameUpdate == 'unrank') {

						let roles = []
						let role = await oldGuild.member(action.executor.id).roles.cache
							.map(role => roles.push(role.id))
						role
						oldGuild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: guildUpdate - changeName`)
						if (action.executor.bot) {
							let botRole = targetMember.roles.cache.filter(r => r.managed)
							// let r = guild.roles.cache.get(botRole.id)

							for (const [id] of botRole) {
								botRole = oldGuild.roles.cache.get(id)
							}
							botRole.setPermissions(0, `OneForAll - Type: guildUpdate - changeName`)
						}


					}


					if (logChannel != undefined) {
						if (action.executor.id === client
.user.id) return;
						const logsEmbed = new Discord.MessageEmbed()
							.setTitle('\`📣\` Modification du nom du serveur')
							.setDescription(`
					\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié le nom du serveur \n
					\`\`\`${action.changes[0].old} en ${action.changes[0].new}\`\`\`
           \`🧾\` Sanction : ${after.nameUpdate}

        `)
							.setTimestamp()
							.setFooter("🕙")
							.setColor(`${color}`)
						logChannel.send(logsEmbed);
					}

				} else {


					const logsEmbed = new Discord.MessageEmbed()
						.setTitle('\`📣\` Modification du nom du serveur')
						.setDescription(`
				\`👨‍💻\` Auteur : **${action.executor.tag}** \`(${action.executor.id})\` a modifié le nom du serveur \n
				\`\`\`${action.changes[0].old} en ${action.changes[0].new}\`\`\`
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
