const StateManager = require('../utils/StateManager');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
const logsChannelId = new Map();
const guildEmbedColor = new Map();
const guildCommandPrefixes = new Map();
const Discord = require('discord.js')
var checkWl = require('../function/check/checkWl');
const guildAntiraidConfig = new Map();

var checkBotOwner = require('../function/check/botOwner');
const { Event } = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'roleDelete',
	},
	module.exports = async (handler, role) => {
		this.connection = StateManager.connection;
		const color = guildEmbedColor.get(role.guild.id)


		let guild = role.guild;
		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
		const isOnFetched = await this.connection.query(`SELECT roleDelete FROM antiraid WHERE guildId = '${role.guild.id}'`);
		const isOnfetched = isOnFetched[0][0].roleDelete;
		let isOn;
		if (isOnfetched == "1") { isOn = true };
		if (isOnFetched == "0") { isOn = false };
		let action;
		if (isOn) {
			action = await role.guild.fetchAuditLogs({ type: "ROLE_DELETE" }).then(async (audit) => audit.entries.first());

		} else {
			return;
		}
		let logChannelId = logsChannelId.get(role.guild.id);
     

		let logChannel
		if (logChannelId != undefined) {
			logChannel = role.guild.channels.cache.get(logChannelId)
			

		}
		if (action.executor.id === handler.client.user.id) return;
		var isOwner = checkBotOwner(role.guild.id, action.executor.id);


		const isWlOnFetched = await this.connection.query(`SELECT roleDelete FROM antiraidWlBp WHERE guildId = '${role.guild.id}'`);
		const isWlOnfetched = isWlOnFetched[0][0].roleDelete;
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

			let targetMember = guild.members.cache.get(action.executor.id);
			if (targetMember == undefined) {
				await role.guild.members.fetch().then((members) => {
					targetMember = members.get(action.executor.id)
				})
			}
			if (role.managed == true) {
				return
			}

			let newRole = await role.guild.roles.create({
				data: role
			})
			newRole.setPosition(role.position)

			let after = guildAntiraidConfig.get(role.guild.id);



			if (targetMember.roles.highest.comparePositionTo(role.guild.me.roles.highest) <= 0) {

				if (after.roleDelete === 'ban') {
					guild.members.ban(action.executor.id)
				} else if (after.roleDelete === 'kick') {
					guild.member(action.executor.id).kick(
						`OneForAll - Type: roleDelete `
					)
				} else if (after.roleDelete === 'unrank') {
					let roles = []
					let role = await guild.member(action.executor.id).roles.cache
						.map(role => roles.push(role.id))
					role
					guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: roleDelete`)
					if (action.executor.bot) {
						let botRole = targetMember.roles.cache.filter(r => r.managed)
						// let r = guild.roles.cache.get(botRole.id)
						
						for(const[id] of botRole){
							botRole = guild.roles.cache.get(id)
						}
						botRole.setPermissions(0, `OneForAll - Type: roleDelete `)
					}
				}
			


				const logsEmbed = new Discord.MessageEmbed()
					.setTitle(`\`❌\`Suppression d'un rôle `)
					.setDescription(`
			\`👨‍💻\`Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a supprimé le rôle :\n
			\`\`\`➡ : ${role.name}\`\`\`
			\`🧾\`Sanction : ${after.roleDelete}

		`)
					.setTimestamp()
					.setFooter('🕙')
					.setColor(`${color}`);
					if(logChannel != undefined){
						logChannel.send(logsEmbed);
					}

			}else {

    
                const logsEmbed = new Discord.MessageEmbed()
				.setTitle(`\`❌\`Suppression d'un rôle `)
				.setDescription(`
				\`👨‍💻\`Auteur : **${targetMember.user.tag}** \`(${action.executor.id})\` a supprimé le rôle :\n
				\`\`\`➡ : ${role.name}\`\`\`
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
)
logsChannelF(logsChannelId, 'raid');

embedsColor(guildEmbedColor);
StateManager.on('antiraidConfF', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})

