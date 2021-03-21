﻿const StateManager = require('../utils/StateManager');
var checkBotOwner = require('../function/check/botOwner');
var embedsColor = require('../function/embedsColor');
const guildEmbedColor = new Map();
const logsChannelId = new Map();
var logsChannelF = require('../function/fetchLogs');
const guildCommandPrefixes = new Map();
const { CommandHandlerError, Logger, BetterEmbed, Command, getThing } = require('advanced-command-handler');
const { DateTime } = require('luxon');
const Discord = require('discord.js');
const antilinkGuild = new Map();
// antispam
const usersMap = new Map();
const guildMuteRole = new Map();
const spamGuild = new Map();
var checkWl = require('../function/check/checkWl');
const guildAntiraidConfig = new Map();
const statsOn = new Map();

const guildLang = new Map();
var langF = require('../function/lang')
/**
 * Verify if the user, and the client has all the permissions of the Command.
 * @param {Message} message - The message.
 * @param {Command} command - Command to verify the permissions.
 * @returns {{client: Permissions[], user: Permissions[]}} - Missing permissions.
 */
function verifyPerms(message, command) {
	const clientMissingPermissions = [];
	const userMissingPermissions = [];
	if (!message.guild)
		return {
			client: clientMissingPermissions,
			user: userMissingPermissions,
		};

	if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
		command.clientPermissions.forEach(permission => {
			if (!Discord.Permissions.FLAGS[permission]) {
				throw new CommandHandlerError(
					'eventMessage',
					`Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`
				);
			}

			if (!message.channel.permissionsFor(message.guild.me).has(permission, false)) {
				clientMissingPermissions.push(permission);
			}
		});
	}

	command.userPermissions.forEach(permission => {
		if (!Discord.Permissions.FLAGS[permission]) {
			throw new CommandHandlerError(
				'eventMessage',
				`Permission '${permission}' is not a valid Permission Flag see the full list here : https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS.`
			);
		}

		if (!message.channel.permissionsFor(message.member).has(permission, false)) {
			userMissingPermissions.push(permission);
		}
	});

	return {
		client: clientMissingPermissions,
		user: userMissingPermissions,
	};
}

/**
 * Create an Embed Objet for listing the missing permisisons of a member or a client.
 * @param {Permissions[]} permissions - The missing Permisisons.
 * @param {boolean} client - If the missing permissions are to the client.
 * @returns {object} - An Embed Object.
 */
function missingPermission(permissions, client = false) {
	const msg = `<:720681441670725645:780539422479351809> \`ERREUR\` Vous n'avez pas la permission requise \`${permissions}\``;

	return msg;
}
function missingPermissionC(permissions, client = false) {
	const msg = `<:720681441670725645:780539422479351809> \`ERREUR\` Je n'ai pas la permission requise \`${permissions}\``;
	return msg;

}
const { Event } = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'message',
	},
	async (handler, message) => {
		if (message.guild == null) return;
		if(!guildLang.has(message.guild.id)) return;

		const color = guildEmbedColor.get(message.guild.id)
		this.connection = StateManager.connection;
		const lang = require(`../lang/${guildLang.get(message.guild.id)}`);

		function hasDiscordInvite(string) {
			let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

			if (discordInvite.test(string)) return true;
			return false;
		}

		function deleteMessage(message, type) {
			if (message.author.id == handler.client.user.id) return;
			if (message.deletable) {
				message.delete().catch(() => { });
			}


			if (type === 'link') { var msg = `${message.author}, vous n'êtes pas autorisé à poster des liens` } else { var msg = `${message.author}, votre message a été supprimé sans raison.` }
			var embed = new Discord.MessageEmbed()
				.setColor(`${color}`)
				.setDescription(msg);
			message.channel.send(embed)


		}
		// handler.client.api.applications(handler.client.user.id).commands.post({data: {
		// 	name: 'help',
		// 	description: 'Mon prefix est: \`!\`'
		// }})
		// if (statsOn.get(message.guild.id) == '1') {
		// 	let count = 1

		// 	const msgAuthorInfo = msgCounter.filter(u => u.authorInfo.id == message.author.id)

		// 	if (msgAuthorInfo.size === 0) {
		// 		msgCounter.set(message.id, { guildId: message.guild.id, authorInfo: { id: message.author.id, msgCount: 1 }, channelId: message.channel.id })

		// 	} else {
		// 		console.log(msgAuthorInfo)
		// 		count = msgAuthorInfo.reduce((counter, info) => {
		// 			console.log(info.authorInfo.msgCount)
		// 			console.log("cc",counter)
		// 			return info.authorInfo.msgCount + counter
		// 		}, 1)
		// 		count += 1
		// 		console.log(count)
		// 		msgCounter.set(message.id, { guildId: message.guild.id, authorInfo: { id: message.author.id, msgCount: count }, channelId: message.channel.id })
		// 		console.log(msgAuthorInfo)

		// 	}

		// 	console.log(count)
		// 	// console.log(msgCounter.filter(u => u.authorId == "188356697482330122"))
		// 	// console.log(msgCounter)
		// 	// msgCounter.set(message.author.id, [{guildId : message.author.id, channelId : message.channel.id, msgId: message.id, msgCount = msgCounter.get(message.)}])
		// 	// let msgCounter = 0;
		// 	// await this.connection.query(`SELECT numberMsg FROM statsMsg WHERE channelId = '${message.channel.id}' AND userId = '${message.author.id}'`).then(async (res) => {
		// 	// 	if (res[0].length != 0) {
		// 	// 		msgCounter = res[0][0].numberMsg + 1;
		// 	// 		await this.connection.query(`UPDATE statsMsg SET numberMsg = '${msgCounter}', lastMessageDate=NOW(), lastMessageId='${message.id}' WHERE channelId = '${message.channel.id}' AND userId = '${message.author.id}'`)
		// 	// 	} else {
		// 	// 		msgCounter += 1
		// 	// 		await this.connection.query(`INSERT INTO statsMsg (userId, guildId, channelId,lastMessageId,numberMsg, lastMessageDate) VALUES ('${message.author.id}', '${message.guild.id}', '${message.channel.id}', '${message.id}' ,'${msgCounter}', NOW()) `)

		// 	// 	}
		// 	// })
		// }
		const isAntilinkOn = antilinkGuild.get(message.guild.id);

		let isAntilink
		if (isAntilinkOn == "0") { isAntilink = false }
		if (isAntilinkOn == '1') { isAntilink = true }
		if (isAntilinkOn == false) {
			if (message.author.bot) return;
		}

		let isOnWl;

		if (isAntilink == true) {
			const isWlOnFetched = await this.connection.query(`SELECT antilink FROM antiraidWlBp WHERE guildId = '${message.guild.id}'`);
			const isWlOnfetched = isWlOnFetched[0][0].antilink;
			if (isWlOnfetched == "1") { isOnWl = true };
			if (isWlOnfetched == "0") { isOnWl = false };
			if (isOnWl == true) {
				var isWl = checkWl(message.guild.id, message.author.id);

				// let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${message.guild.id}'`);
				// let isWlfetched = isWlFetched[0][0].whitelisted.toString();
				// let isWl1 = isWlfetched.split(",");
				// if (isWl1.includes(message.author.id)) { isWl = true };
				// if (!isWl1.includes(message.author.id)) { isWl = false };
			}

		}
		var isOwner = checkBotOwner(message.guild.id, message.author.id);
		if (isOwner == false && isAntilink == true && hasDiscordInvite(message.content) && message.author.id != message.guild.ownerID && isOnWl == false && message.webhookID == null) {
			deleteMessage(message, 'link');

			let logChannelId = logsChannelId.get(message.guild.id);
			if (logChannelId == undefined) return;


			let logChannel = handler.client.guilds.cache.get(message.guild.id).channels.cache.get(logChannelId)
			if (logChannel == undefined) return;
			if (message.author.id === handler.client.user.id) return;
			const user = message.guild.members.cache.get(message.author.id)
			const logsEmbed = new Discord.MessageEmbed()
				.setTitle('\`❌\` Post de lien')
				.setDescription(`
           \`👨‍💻\` Auteur : **${user.user.tag}** \`(${user.id})\` a posté un lien  \n
            \`\`\`${message.content}\`\`\`

        `)
				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)
			logChannel.send(logsEmbed);
		} else if (isOwner == false && isAntilink == true && hasDiscordInvite(message.content) && isOnWl == true && isWl == false && message.author.id != message.guild.ownerID && message.webhookID == null) {
			deleteMessage(message, 'link');

			let logChannelId = logsChannelId.get(message.guild.id);
			if (logChannelId == undefined) return;

			let logChannel = handler.client.guilds.cache.get(message.guild.id).channels.cache.get(logChannelId)
			if (logChannel == undefined) return;
			if (message.author.id === handler.client.user.id) return;
			const user = message.guild.members.cache.get(message.author.id)
			const logsEmbed = new Discord.MessageEmbed()
				.setTitle('\`❌\` Post de lien ')
				.setDescription(`
           \`👨‍💻\` Auteur : **${user.user.tag}** \`(${user.id})\` a posté un lien \n
            \`\`\`${message.content}\`\`\`

        `)
				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)
			logChannel.send(logsEmbed);

		}

		//#region antispam
		let isSpamF = spamGuild.get(message.guild.id);
		let isSpamOn;
		if (isSpamF == '1') isSpamOn = true;
		if (isSpamF == '0') isSpamOn = false;
		const LIMIT = 5;
		const TIME = 7000;
		const DIFF = 3000;
		if (isOwner == false && isSpamOn == true && message.webhookID == null && !message.member.hasPermission('ADMINISTRATOR') && message.author.id != message.guild.ownerID && isOnWl == false) {
			const muteRole = message.guild.roles.cache.get(guildMuteRole.get(message.guild.id));

			if (usersMap.has(message.author.id)) {
				const userData = usersMap.get(message.author.id);
				const { lastMessage, timer } = userData;
				const difference = message.createdTimestamp - lastMessage.createdTimestamp;
				let msgCount = userData.msgCount;
				if (difference > DIFF) {
					clearTimeout(timer);
					// console.log("Clear timeout");
					userData.msgCount = 1;
					userData.lastMessage = message;
					userData.timer = setTimeout(() => {
						usersMap.delete(message.author.id);
						// console.log('removed from reset')
					}, TIME)
					usersMap.set(message.author.id, userData)
				}
				else {
					++msgCount;
					if (parseInt(msgCount) === LIMIT) {
						message.member.roles.add(muteRole);
						message.channel.send(`${message.member}, vous avez été mute car vous spammez`)
					} else {
						userData.msgCount = msgCount;
						usersMap.set(message.author.id, userData);
					}
				}
			} else {
				let fn = () => setTimeout(() => {
					usersMap.delete(message.author.id);
					// console.log('removed from map')
				}, TIME)
				usersMap.set(message.author.id, {
					msgCount: 1,
					lastMessage: message,
					timer: fn
				});

			}
		} else if (isOwner == false && isSpamOn == true && message.webhookID == null && !message.member.permissions.has('ADMINISTRATOR') && isOnWl == true && isWl == false && message.author.id != message.guild.ownerID) {
			const muteRole = message.guild.roles.cache.get(guildMuteRole.get(message.guild.id));


			if (usersMap.has(message.author.id)) {
				const userData = usersMap.get(message.author.id);
				const { lastMessage, timer } = userData;
				const difference = message.createdTimestamp - lastMessage.createdTimestamp;
				let msgCount = userData.msgCount;
				if (difference > DIFF) {
					clearTimeout(timer);
					// console.log("Clear timeout");
					userData.msgCount = 1;
					userData.lastMessage = message;
					userData.timer = setTimeout(() => {
						usersMap.delete(message.author.id);
						// console.log('removed from reset')
					}, TIME)
					usersMap.set(message.author.id, userData)
				}
				else {
					++msgCount;
					if (parseInt(msgCount) === LIMIT) {
						if(muteRole){
							message.member.roles.add(muteRole);
							message.channel.send(`${message.member}, vous avez été mute car vous spammez`)
						}
						
					} else {
						userData.msgCount = msgCount;
						usersMap.set(message.author.id, userData);
					}
				}
			} else {
				let fn = () => setTimeout(() => {
					usersMap.delete(message.author.id);
					// console.log('removed from map')
				}, TIME)
				usersMap.set(message.author.id, {
					msgCount: 1,
					lastMessage: message,
					timer: fn
				});

			}
		}


		//#endregion antispam
		let prefix = guildCommandPrefixes.get(message.guild.id);
		const botMention = message.mentions.has(handler.client.user)

		if (botMention) {
			if (message.content.includes("@here") || message.content.includes("@everyone")) return false;
			if (prefix == undefined) return message.channel.send(`Votre serveurs n'est pas dans ma base de donnée veuillez me réajouter !`)
			return message.channel.send(`<:778353230484471819:780727288903237663> Mon prefix est: \`${prefix}\``)
		}


		if (message.content.startsWith(prefix)) {
			prefix = prefix;
		} else {
			return
		}

		if (message.author.bot || message.system) return;


		const messageToString = message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content;
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		/**
		 * The command that have been searched through the message content.
		 * @type {Command | null} -
		 */
		const cmd = await getThing('command', args[0].toLowerCase().normalize());
		args.shift();
		if (prefix) {

			if (cmd) {

				if (message.author.id == "679559090741051393") return message.channel.send("Tu es blacklist freik");
				if (message.author.id == "709534713500401685") return message.channel.send("Tu es blacklist Dowzy");
				if (message.author.id == "754832699889418262") return message.channel.send("Tu es blacklist Dowzy");
				if (message.author.id == "738127567860662374") return message.channel.send("Tu es blacklist oruma");
				if (message.author.id == "720036345896108103") return message.channel.send("Tu es blacklist oruma");
				if (message.author.id == "780019344511336518") return message.channel.send("Tu es blacklist next");
				if (message.author.id == "755439561529622558") return message.channel.send("Tu es blacklist hades");

				if (!handler.client.isOwner(message.author.id) && (['owner', 'wip', 'mod'].includes(cmd.category) || cmd.tags.includes('ownerOnly'))) {
					await message.channel.send("Tu n'es pas le créateur du bot. Tu n'as donc pas les permissions d'executer cette commande.");
					return Logger.log(
						`${Logger.setColor('magenta', message.author.tag)} tried the ownerOnly command ${Logger.setColor('gold', cmd.name)} on the guild ${Logger.setColor('teal', message.guild.name)}.`
					);
				}

				if (message.guild) {
					if(cmd.tags.includes("voiceOnly") && !message.member.voice.channel){
						return await message.channel.send(lang.error.voiceChat)
					}
					Logger.log(`${Logger.setColor('magenta', message.author.tag)} executed the command ${Logger.setColor('gold', cmd.name)} on the guild ${Logger.setColor('teal', message.guild.name)}.`);

					const verified = verifyPerms(message, cmd);
					// if (verified.client.length > 0) return message.channel.send({ embed: missingPermission(verified.client, true) });
					if (verified.client.length > 0) return message.channel.send(missingPermissionC(verified.client));
					if (verified.user.length > 0 && !handler.client.isOwner(message.author.id)) return message.channel.send(missingPermission(verified.user));

					if (cmd.tags.includes("nsfw") && !message.channel.nsfw) {
						const embed = new BetterEmbed({
							title: 'Error :',
							description: 'Les commandes NSFW sont uniquement disponible dans des salons NSFW.',
							footer: handler.client.user.username,
							footerIcon: handler.client.user.displayAvatarURL,
						});
						await message.channel.send(embed.build());
					}
				} else {
					Logger.log(`${Logger.setColor('magenta', message.author.tag)} executed the command ${Logger.setColor('gold', cmd.name)} in private messages.`);
					if (cmd.tags.includes("guildOnly")) {
						await message.channel.send('Cette commande est uniquement disponible sur un serveur.');
						return Logger.log(`${Logger.setColor('magenta', message.author.tag)} tried the command ${Logger.setColor('gold', cmd.name)} only available on guild but in private.`);
					}
					
				}

				if (handler.cooldowns.has(message.author.id)) {
					return message.channel.send(`Veuillez executer la commande dans \`${handler.cooldowns.get(message.author.id)}\` secondes.`);
				} else if (cmd.cooldown > 0) {
					handler.cooldowns.set(message.author.id, cmd.cooldown);
					setTimeout(() => {
						handler.cooldowns.delete(message.author.id);
					}, cmd.cooldown * 1000);
				}

				cmd.run(handler.client, message, args).catch(async warning => {
					Logger.warn(`A small error was made somewhere with the command ${Logger.setColor('gold', cmd.name)}.
			Date : ${Logger.setColor('yellow', DateTime.local().toFormat('TT'))}${Logger.setColor('red', '\nError : ' + warning.stack)}`);

					if (handler.client.isOwner(message.author.id)) {
						const embedLog = new BetterEmbed();
						embedLog.color = '#dd0000';
						embedLog.description = 'An error occurred with the command : **' + cmd.name + '**.';
						embedLog.fields.push({
							name: 'Informations :',
							value: `\nSent by : ${message.author} (\`${message.author.id}\`)\n\nOnto : **${message.guild.name}** (\`${message.guild.id}\`)\n\nInto : ${message.channel} (\`${message.channel.id})\``,
						});

						embedLog.fields.push({
							name: 'Error :',
							value: warning.stack.length > 1024 ? warning.stack.substring(0, 1021) + '...' : warning.stack,
						});

						embedLog.fields.push({
							name: 'Message :',
							value: messageToString,
						});
						// for(const own of handler.owners){
						// 	let cache = handler.client.users.cache
						// 	let user;
						// 	if(cache.has(own)){
						// 		user = cache.get(own)
						// 	}else{
						// 		user = await handler.client.users.fetch(own) 
						// 	}
						// 	try{
						// 		user.send(embedLog)

						// 	}catch(err){
						// 		return;
						// 	}
						// }
						// return 
					}
				});
			}
		}

	}
)




StateManager.on('prefixFetched', (guildId, prefix) => {
	guildCommandPrefixes.set(guildId, prefix)
})

StateManager.on('prefixUpdate', (guildId, prefix) => {
	guildCommandPrefixes.set(guildId, prefix);
});

StateManager.on('spamUpdate', (guildId, spam) => {
	spamGuild.set(guildId, spam)
})
StateManager.on('spamFetched', (guildId, spam) => {
	spamGuild.set(guildId, spam)
})

StateManager.on('antilinkUpdate', (guildId, antilink) => {
	antilinkGuild.set(guildId, antilink)
})
StateManager.on('antilinkFetched', (guildId, antilink) => {
	antilinkGuild.set(guildId, antilink)
})
StateManager.on('addMuteRole', (guildId, muteRole) => {
	guildMuteRole.set(guildId, muteRole)
});

StateManager.on('muteIdFetched', (guildId, muteRole) => {
	guildMuteRole.set(guildId, muteRole)
});
logsChannelF(logsChannelId, 'mod');

embedsColor(guildEmbedColor);
StateManager.on('antiraidConfF', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
	guildAntiraidConfig.set(guildId, config)
})
StateManager.on('statsOnU', (guildId, on) => {
	statsOn.set(guildId, on)
})
StateManager.on('statsOnF', (guildId, on) => {
	statsOn.set(guildId, on)
})
langF(guildLang);