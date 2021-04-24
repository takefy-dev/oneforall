const StateManager = require('../utils/StateManager');
const antilinkGuild = new Map();
const Discord = require('discord.js')
let checkBotOwner = require('../function/check/botOwner');
let embedsColor = require('../function/embedsColor');
const guildEmbedColor = new Map();
const logsChannelId = new Map();
const logsMsgId = new Map();
let logsChannelF = require('../function/fetchLogs');

const Event = require('../structures/Handler/Event');

module.exports = class messageUpdate extends Event {
	constructor() {
		super({
			name: 'messageUpdate',
		});
	}

	async run(client, oldMessage, newMessage) {
		this.connection = StateManager.connection;
		if (oldMessage.guild == null) return;
		if (oldMessage.author == null) return;
		if (oldMessage.author.bot || newMessage.author.bot) return;

		const color = guildEmbedColor.get(oldMessage.guild.id)
		if (oldMessage.author == null) return;
		if (newMessage.guild == null) return;

		let logMsgId = logsMsgId.get(oldMessage.guild.id);


		let logMsgChannel
		if (logMsgId != undefined) {
			logMsgChannel = client
.guilds.cache.get(oldMessage.guild.id).channels.cache.get(logMsgId)


		}
		if (logMsgChannel != undefined && logMsgChannel.guild.id == oldMessage.guild.id) {
			const url = `https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id} `
			const logsEmbed = new Discord.MessageEmbed()
				.setTitle('\`📣\` Modification de message')
				.setDescription(`
          \`👨‍💻\` Auteur : **${oldMessage.author.tag}** \`(${oldMessage.author.id})\` a modifié son message \n
            \`\`\`${oldMessage.content}  ➡ ${newMessage.content}\`\`\`
          \`🧾\` ID : [\`${oldMessage.id}\`](${url})
        `)
				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)
			logMsgChannel.send(logsEmbed);
		}


		function hasDiscordInvite(string) {
			let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

			if (discordInvite.test(string)) return true;
			return false;
		}

		function deleteMessage(message, type) {
			if (newMessage.deletable) {
				newMessage.delete().catch(() => {
				});
			}

			if (type === 'link') {
				let msg = `${message.author}, vous n'êtes pas autorisé à poster des liens`
			} else {
				let msg = `${message.author}, votre message a été supprimé sans raison.`
			}
			let embed = new Discord.MessageEmbed()
				.setColor(`${color}`)
				.setDescription(msg);
			message.channel.send(embed)


		}

		const isAntilinkOn = antilinkGuild.get(oldMessage.guild.id);

		let isAntilink
		if (isAntilinkOn == "0") {
			isAntilink = false
		}
		if (isAntilinkOn == '1') {
			isAntilink = true
		}
		if (isAntilink == false) {
			if (oldMessage.author.bot) return;
		}

		let isOnWl;
		let isWl;

		if (isAntilink == true) {
			const isWlOnFetched = await this.connection.query(`SELECT antilink FROM antiraidWlBp WHERE guildId = '${oldMessage.guild.id}'`);
			const isWlOnfetched = isWlOnFetched[0][0].antilink;
			if (isWlOnfetched == "1") {
				isOnWl = true
			}
			;
			if (isWlOnfetched == "0") {
				isOnWl = false
			}
			;
			if (isOnWl == true) {
				let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${oldMessage.guild.id}'`);
				let isWlfetched = isWlFetched[0][0].whitelisted.toString();
				let isWl1 = isWlfetched.split(",");
				if (isWl1.includes(oldMessage.author.id)) {
					isWl = true
				}
				;
				if (!isWl1.includes(oldMessage.author.id)) {
					isWl = false
				}
				;
			}

		}
		// if(hasDiscordInvite(newMessage.content))deleteMessage(newMessage, 'link');
		let isOwner = checkBotOwner(newMessage.guild.id, newMessage.author.id);
		if (isOwner == true) return;
		if (isAntilink == true && hasDiscordInvite(newMessage.content) && newMessage.author.id != newMessage.guild.ownerID && isOnWl == false) {
			deleteMessage(newMessage, 'link');

			let logChannelId = logsChannelId.get(newMessage.guild.id);
			let logChannel = client
.guilds.cache.get(newMessage.guild.id).channels.cache.get(logChannelId)
			if (logChannel == undefined) return;
			if (newMessage.author.id === client
.user.id) return;
			const user = newMessage.guild.members.cache.get(newMessage.author.id)
			const logsEmbed = new Discord.MessageEmbed()
				.setTitle('\`❌\` Post de lien en modifiant un message')
				.setDescription(`
           \`👨‍💻\` Auteur : **${user.user.tag}** \`(${user.id})\` a posté un lien en modifiant son message \n
            \`\`\`${oldMessage.content} ➡ ${newMessage.content}\`\`\`

        `)
				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)
			logChannel.send(logsEmbed);
		} else if (isAntilink == true && hasDiscordInvite(newMessage.content) && isOnWl == true && isWl == false && newMessage.author.id != newMessage.guild.ownerID) {
			deleteMessage(newMessage, 'link');
			let logChannelId = logsChannelId.get(newMessage.guild.id);
			let logChannel = client
.guilds.cache.get(newMessage.guild.id).channels.cache.get(logChannelId)
			if (logChannel == undefined) return;
			if (newMessage.author.id === client
.user.id) return;
			const user = newMessage.guild.members.cache.get(newMessage.author.id)
			const logsEmbed = new Discord.MessageEmbed()
				.setTitle('\`❌\` Post de lien en modifiant un message')
				.setDescription(`
           \`👨‍💻\` Auteur : **${user.user.tag}** \`(${user.id})\` a posté un lien en modifiant son message \n
            \`\`\`${oldMessage.content} ➡ ${newMessage.content}\`\`\`

        `)
				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)
			logChannel.send(logsEmbed);
		}
	}
}



StateManager.on('antilinkUpdate', (guildId, antilink) => {
	antilinkGuild.set(guildId, antilink)
})
StateManager.on('antilinkFetched', (guildId, antilink) => {
	antilinkGuild.set(guildId, antilink)
})
embedsColor(guildEmbedColor);
logsChannelF(logsChannelId, 'raid');
logsChannelF(logsMsgId, 'msg');


