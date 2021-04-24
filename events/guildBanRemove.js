const StateManager = require('../utils/StateManager');
let checkBotOwner = require('../function/check/botOwner');
let logsChannelF = require('../function/fetchLogs');
let embedsColor = require('../function/embedsColor');
let checkWl = require('../function/check/checkWl');
const guildAntiraidConfig = new Map();
const logsChannelId = new Map();
const Discord = require('discord.js')
const guildEmbedColor = new Map();
let count = new Map();
const countGuild = new Map();
const Event = require('../structures/Handler/Event');

module.exports = class guildBanRemove extends Event {
	constructor() {
		super({
			name: 'guildBanRemove',
		});
	}

	async run(client, guild, user) {
		this.connection = StateManager.connection;
		if (!guild.me.hasPermission("VIEW_AUDIT_LOG")) return;

		const color = guildEmbedColor.get(guild.id)
		//#region log unban 
		let logChannelId = logsChannelId.get(guild.id);
		let logChannel
		if (logChannelId != undefined) {
			logChannel = client
.guilds.cache.get(guild.id).channels.cache.get(logChannelId)
			let action = await guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE"}).then(async (audit) => audit.entries.first());
			const {executor, target} = action;
			if (executor.id == client
.user.id) return;
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
			if (logChannel != undefined) {
				logChannel.send(logsEmbed)

			}
		}
		;
		//#endregion log unban
	}
};
logsChannelF(logsChannelId, 'mod');


embedsColor(guildEmbedColor);
