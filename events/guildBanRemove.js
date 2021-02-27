const StateManager = require('../utils/StateManager');
var checkBotOwner = require('../function/check/botOwner');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
var checkWl = require('../function/check/checkWl');
const guildAntiraidConfig = new Map();
const logsChannelId = new Map();
const Discord = require('discord.js')
const guildEmbedColor = new Map();
var count = new Map();
const countGuild = new Map();
const { Event } = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'guildBanRemove',
	},
	module.exports = async (handler, guild, user) => {
		this.connection = StateManager.connection;
		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
		
		const color = guildEmbedColor.get(guild.id)
		//#region log unban 
		let logChannelId = logsChannelId.get(guild.id);
		let logChannel
		if (logChannelId != undefined) {
			logChannel = handler.client.guilds.cache.get(guild.id).channels.cache.get(logChannelId)
			let action = await guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then(async (audit) => audit.entries.first());
			const { executor, target } = action;
			if(executor.id == handler.client.user.id) return;
			const logsEmbed = new Discord.MessageEmbed()
				.setTitle("\`🚫\` Unbannissement d'un membre")
				.setDescription(`
					\`👨‍💻\` Auteur : **${executor.tag}** \`(${executor.id})\` a unbanni :\n
					\`\`\`${user.tag} (${user.id})\`\`\`

					`)
				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)

				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)
				if(logChannel != undefined){
					logChannel.send(logsEmbed)

				}
		};
		//#endregion log unban
	}
);
logsChannelF(logsChannelId, 'mod');


embedsColor(guildEmbedColor);
