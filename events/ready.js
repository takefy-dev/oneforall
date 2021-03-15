const StateManager = require('../utils/StateManager');
const mysql = require('mysql2/promise');
const { Logger } = require('advanced-command-handler');
const { DateTime } = require('luxon');
const fetchIsOn = new Map();
const fs = require('fs')
const guildCommandPrefixes = new Map();
const BotPerso = require('../utils/BotPerso');
const { Event } = require('advanced-command-handler');
const counter = new Map();
const fetchCounter = require('../function/fetchCounter');
const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function getKey(map, val) {
	return [...map].find(([key, value]) => val === value)[0];
}
module.exports = new Event(
	{
		name: 'ready',
		once: true
	},
	module.exports = async (handler) => {
		this.connection = StateManager.connection;
		const checkUnmutes = require("../function/check/tempmute.js");
		checkUnmutes.init(handler.client);
		setInterval(function () {
			StateManager.emit('banCountReset')
		}, 8.64 * 10 ** 7);
		// setInterval(function () {
		// 	StateManager.emit('banCountReset')
		// }, 60000);
		setInterval(function () {
			StateManager.emit('kickCountReset')
		}, 4, 32 * 10 ** 7);
		// setInterval(async function () {
		// 	this.botperso = BotPerso.botperso;
		// 	let guildArray;
		// 	let guildCount;
		// 	let channelArray;
		// 	let userArray;
		// 	await handler.client.shard.fetchClientValues("guilds.cache.size").then((res) => {
		// 		guildArray = res
		// 	});
		// 	await handler.client.shard.fetchClientValues("channels.cache.size").then((res) => {
		// 		channelArray = res
		// 	});
		// 	await handler.client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')
		// 		.then(results => {
		// 			userArray = results.reduce((acc, memberCount) => acc + memberCount, 0).toLocaleString()
		// 		})
		// 	// await this.botperso.query(`UPDATE stats SET guildCount = '${guildArray.reduce((acc, guildCount) => acc + guildCount, 0).toLocaleString()}'`)
		// 	// await this.botperso.query(`UPDATE stats SET channelCount = '${channelArray.reduce((acc, channelCount) => acc + channelCount, 0).toLocaleString()}'`)
		// 	// await this.botperso.query(`UPDATE stats SET userCount = '${userArray}'`)
		// 	// await this.botperso.query(`UPDATE stats SET guildCount = '${handler.client.guilds.cache.size.toLocaleString()}'`)
		// 	// await this.botperso.query(`UPDATE stats SET channelCount = '${handler.client.channels.cache.size.toLocaleString()}'`)
		// 	// await this.botperso.query(`UPDATE stats SET userCount = '${handler.client.guilds.cache.filter(g => g.available).reduce((a, b) => a + b.memberCount, 0).toLocaleString()}'`)
		// }, 20000)

		/**
		 * Log information of the bot in the console.
		 * @returns {void}
		 */
		function log() {
			Logger.event(`Date : ${Logger.setColor('yellow', DateTime.local().toFormat('TT'))}`);
			Logger.event(`RAM used  : ${Logger.setColor('magenta', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + Logger.setColor('magenta', 'MB'));
		}

		Logger.event(
			Logger.setColor('#c0433f', `Client online ! Client ${Logger.setColor('orange', handler.client.user.username, '#c0433f')} has ${handler.client.guilds.cache.size + Logger.setColor('#c0433f')
				} guilds, it sees ${handler.client.users.cache.size + Logger.setColor('#c0433f')
				} users.`)
		);
		// setInterval(async() => {
		// 	let guildArray;

		// 	await handler.client.shard.fetchClientValues("guilds.cache.size").then((res) => {
		// 		guildArray = res
		// 	});

		// 	handler.client.user.setActivity(`${guildArray.reduce((prev, guildCount) => prev + guildCount, 0)} Servers | !help`, { type: 'WATCHING' })
		// }, 60000); // Runs this every 60 seconds.
	

		handler.client.guilds.cache.forEach(async guild => {
			if (guild.deleted) return guild.leave()


			if (guild.deleted) return guild.leave()
			await this.connection.query(`SELECT memberCount, botCount, voiceCount, onlineCount, offlineCount, channelCount, roleCount, boosterCount FROM guildConfig WHERE guildId = '${guild.id}'`).then((result) => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;
				const member = JSON.parse(result[0][0].memberCount);
				const bot = JSON.parse(result[0][0].botCount);
				const voice = JSON.parse(result[0][0].voiceCount);
				const online = JSON.parse(result[0][0].onlineCount);
				const offline = JSON.parse(result[0][0].offlineCount);
				const channel = JSON.parse(result[0][0].channelCount);
				const role = JSON.parse(result[0][0].roleCount);
				const booster = JSON.parse(result[0][0].boosterCount);
				// StateManager.emit('memberCountFetch', guildId, member);
				// StateManager.emit('botCountFetch', guildId, bot);
				// StateManager.emit('voiceCountFetch', guildId, voice);
				// StateManager.emit('onlineCountFetch', guildId, online);
				// StateManager.emit('offlineCountFetch', guildId, offline);
				// StateManager.emit('channelCountFetch', guildId, channel);
				// StateManager.emit('roleCountFetch', guildId, role);
				StateManager.emit('counterFetched', guildId, [{ name: member.name, type: 'member', id: member.id }, { name: bot.name, id: bot.id, type: 'bot' }, { name: voice.name, id: voice.id, type: 'voice' }, { name: online.name, id: online.id, type: 'online' }, { name: offline.name, id: offline.id, type: 'offline' }, { name: channel.name, id: channel.id, type: 'channel' }, { name: role.name, id: role.id, type: 'role' }, { name: booster.name, id: booster.id, type: 'booster' }]);
			}).catch(error => console.error(error))
			await this.connection.query(
				`SELECT prefix FROM guildConfig WHERE guildId = '${guild.id}'`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const prefix = result[0][0].prefix;
				guildCommandPrefixes.set(guild.id, result[0][0].prefix);
				StateManager.emit('prefixFetched', guildId, prefix);
			}).catch(err => console.log(err));
			this.connection.query(
				`SELECT embedColors FROM guildConfig WHERE guildId = '${guild.id}'`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const color = result[0][0].embedColors;
				StateManager.emit('colorFetched', guildId, color);

			})
			this.connection.query(`
			SELECT muteRoleId FROM guildConfig WHERE guildId = '${guild.id}';
			`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const muteId = result[0][0].muteRoleId;
				StateManager.emit('muteIdFetched', guildId, muteId);

			}).catch(error => console.error(error))
			this.connection.query(`
			SELECT setup FROM guildConfig WHERE guildId = '${guild.id}';
			`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const setup = result[0][0].setup;
				StateManager.emit('setupDoneFetched', guildId, setup);

			}).catch(error => console.error(error))

			this.connection.query(`
			SELECT memberRole FROM guildConfig WHERE guildId = '${guild.id}';
			`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const setup = result[0][0].memberRole;
				StateManager.emit('memberRoleFetched', guildId, setup);

			}).catch(error => console.error(error))

			this.connection.query(`
			SELECT spam FROM antiraid WHERE guildId = '${guild.id}';
			`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const spam = result[0][0].spam;
				StateManager.emit('spamFetched', guildId, spam);

			}).catch(error => console.error(error))
			this.connection.query(`
			SELECT antilink FROM antiraid WHERE guildId = '${guild.id}';
			`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const antilink = result[0][0].antilink;
				StateManager.emit('antilinkFetched', guildId, antilink);

			}).catch(error => console.error(error))

			this.connection.query(`
			SELECT antiraidLog, modLog, voiceLog, msgLog FROM guildConfig WHERE guildId = '${guild.id}';
			`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const antiraidLog = result[0][0].antiraidLog;
				const modLog = result[0][0].modLog;
				const voiceLog = result[0][0].voiceLog;
				const msgLog = result[0][0].msgLog;
				StateManager.emit('raidLogFetch', guildId, antiraidLog);
				StateManager.emit('modLogFetch', guildId, modLog);
				StateManager.emit('voiceLogFetch', guildId, voiceLog);
				StateManager.emit('msgLogFetch', guildId, msgLog);

			}).catch(error => console.error(error))

			this.connection.query(`
			SELECT inviteMessage FROM guildConfig WHERE guildId = '${guild.id}';
			`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const invitemsg = result[0][0].inviteMessage;
				const invstr = invitemsg.toString();
				StateManager.emit('welcomeMsgFetched', guildId, invstr);

			}).catch(error => console.error(error))

			this.connection.query(`
		SELECT inviteChannel FROM guildConfig WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const invchannel = result[0][0].inviteChannel;
				StateManager.emit('inviteChannelFetched', guildId, invchannel);

			}).catch(error => console.error(error))


			this.connection.query(`
			SELECT soutienMsg FROM guildConfig WHERE guildId = '${guild.id}';
			`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const soutienMsg = result[0][0].soutienMsg;
				const soutienStr = soutienMsg.toString();
				StateManager.emit('soutienMsgFetched', guildId, soutienStr);

			}).catch(error => console.error(error))

			this.connection.query(`
		SELECT soutienId FROM guildConfig WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const soutienId = result[0][0].soutienId;

				StateManager.emit('soutienIdFetched', guildId, soutienId);

			}).catch(error => console.error(error))


			this.connection.query(`
		SELECT soutienOn FROM guildConfig WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const soutienId = result[0][0].soutienOn;

				StateManager.emit('soutienOnFetched', guildId, soutienId);

			}).catch(error => console.error(error))


			this.connection.query(`
		SELECT inviteOn FROM guildConfig WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const inviteOn = result[0][0].inviteOn;

				StateManager.emit('inviteOnFetched', guildId, inviteOn);

			}).catch(error => console.error(error))
			this.connection.query(`
		SELECT owner FROM guildConfig WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const owner = result[0][0].owner;
				StateManager.emit('ownerFetched', guildId, owner);

			}).catch(error => console.error(error))
			this.connection.query(`
		SELECT whitelisted FROM guildConfig WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const wl = result[0][0].whitelisted;
				StateManager.emit('wlFetched', guildId, wl);

			}).catch(error => console.error(error))
			this.connection.query(`
		SELECT blacklisted FROM blacklist WHERE userId = '${guild.ownerID}';
		`
			).then(result => {
				let bl
				const ownerId = guild.ownerID;
				if (result[0][0] != undefined) {
					bl = result[0][0].blacklisted;

				}
				StateManager.emit('blacklistFetched', ownerId, bl);

			}).catch(error => console.error(error))
			this.connection.query(`
		SELECT * FROM reactRole WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				result[0].forEach(item => {
					StateManager.emit('reactionRoleFetched', item.msgId, JSON.parse(item.emojiRole))
				})


			}).catch(error => console.error(error))
			this.connection.query(`
		SELECT antiDeco FROM antiraid WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const antideco = result[0][0].antiDeco;
				StateManager.emit('antiDecoFetch', guildId, antideco);

			}).catch(error => console.error(error))
			this.connection.query(`
		SELECT lang FROM guildConfig WHERE guildId = '${guild.id}';
		`
			).then(result => {
				const guildId = guild.id;
				if (result[0][0] === undefined) return;

				const lang = result[0][0].lang;
				StateManager.emit('langFetched', guildId, lang);

			}).catch(error => console.error(error))
			this.connection.query(`
			SELECT * FROM antiraidconfig WHERE guildId = '${guild.id}';
		`).then(result => {
				if (result[0][0] === undefined) return;

				const guildAntiraidConfig = new Map();
				// console.log(result[0][0]);
				delete result[0][0].guildId
				StateManager.emit('antiraidConfF', guild.id, result[0][0])
			}).catch(error => console.error(error))
			this.connection.query(`SELECT tempvocInfo, isOn FROM tempvoc WHERE guildId = '${guild.id}'`).then(result => {
				if (result[0][0] == undefined) return;

				let isOn;
				if (result[0][0].isOn == '1') isOn = 'Activé'
				if (result[0][0].isOn == '0') isOn = 'Désactivé'
				StateManager.emit('tempVocOnFetched', guild.id, isOn)
				StateManager.emit('tempVocInfoFetched', guild.id, JSON.parse(result[0][0].tempvocInfo))
			})

			this.connection.query(`SELECT statsOn FROM guildConfig WHERE guildId = '${guild.id}'`).then(result => {
				if (result[0][0] == undefined) return;


				StateManager.emit('statsOnF', guild.id, result[0][0].statsOn)
			})

			this.connection.query(`SELECT warnBan, warnKick, warnMute FROM guildConfig WHERE guildId = '${guild.id}'`).then(result => {
				if (result[0].length === 0) return;

				const warnSanction = { ban: result[0][0].warnBan, kick: result[0][0].warnKick, mute: result[0][0].warnMute }
				StateManager.emit('warnSanction', guild.id, warnSanction)
			})
			this.connection.query(`SELECT coinsOn, coinsLogs, streamBoost, muteDiviseur FROM guildConfig WHERE guildId = '${guild.id}'`).then(result => {
				if(result[0].length === 0) return;
				const enable = result[0][0].coinsOn == "1" ? true : false;

				StateManager.emit('coinSettings', guild.id, {enable, logs : result[0][0].coinsLogs, streamBoost: result[0][0].streamBoost, muteDiviseur: result[0][0].muteDiviseur})
				



						// this.connection.query(`SELECT * FROM coins WHERE guildId = '${guild.id}'`).then(res =>{
						// 	if(res[0].length === 0){
								
						// 	}
						// })
				
				
			})
			this.connection.query(`SELECT * FROM coins WHERE guildId = '${guild.id}'`).then(res =>{
				if(res[0].length === 0) return;
				let userArray = []
				res[0].forEach(res => {
					userArray.push({userId : res.userId, coins: res.coins})
					
				})
				StateManager.emit('guildCoins', guild.id, userArray)
			})

			this.connection.query(`SELECT shop FROM coinShop WHERE guildId = '${guild.id}'`).then(res =>{
				if(res[0].length === 0) return;
				const shopArray =JSON.parse(res[0][0].shop)
				StateManager.emit('shopFetched', guild.id, shopArray)					
			})
			this.connection.query(`SELECT * FROM inventory WHERE guildId = '${guild.id}'`).then(res =>{
				if(res[0].length === 0) return;
				const inventory = new Map();
				res[0].forEach(res => {
					inventory.set(res.userId, JSON.parse(res.inventory))
				})
				StateManager.emit('inventory', guild.id, inventory);
			})

		})

		setInterval(() => {
			handler.client.guilds.cache.filter(guild => counter.has(guild.id)).forEach(async guild => {

				const counterInfo = counter.get(guild.id)
				let memberInfo = counterInfo.filter(info => info.type == "member")
				if (memberInfo.length > 0) {

					const ch = guild.channels.cache.get(memberInfo[0].id);

					if (ch == undefined) {
						try {
							return this.connection.query(`UPDATE guildConfig SET memberCount = '${JSON.stringify({ name: 'Non définie' })}' WHERE guildId = '${guild.id}'`)

						} catch (e) {
							return;
						}
					} else {
						if (!ch.manageable) return
						if (ch.name != `${memberInfo[0].name} ${guild.memberCount.toLocaleString()}`) {
							ch.setName(`${memberInfo[0].name} ${guild.memberCount.toLocaleString()}`, 'Member count')

						}
					}


				}
				let botInfo = counterInfo.filter(info => info.type == "bot")
				if (botInfo.length > 0) {
					const ch = guild.channels.cache.get(botInfo[0].id);
					if (ch == undefined) {
						try {
							return this.connection.query(`UPDATE guildConfig SET botCount = '${JSON.stringify({ name: 'Non définie' })}' WHERE guildId = '${guild.id}'`)

						} catch (e) {
							return;
						}
					} else {
						if (!ch.manageable) return

						if (ch.name != `${botInfo[0].name} ${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}`) {
							ch.setName(`${botInfo[0].name} ${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}`, 'Bot count')

						}
					}

				}
				let voiceInfo = counterInfo.filter(info => info.type == "voice")
				if (voiceInfo.length > 0) {
					let count = 0
					const ch = guild.channels.cache.get(voiceInfo[0].id);
					if (ch == undefined) {
						try {
							return this.connection.query(`UPDATE guildConfig SET voiceCount = '${JSON.stringify({ name: 'Non définie' })}' WHERE guildId = '${guild.id}'`)

						} catch (e) {
							return
						}
					} else {
						if (!ch.manageable) return
						const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
						for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
						if (ch.name != `${voiceInfo[0].name} ${count}`) {
							ch.setName(`${voiceInfo[0].name} ${count}`, 'Voice count')

						}
					}

				}
				let onlineInfo = counterInfo.filter(info => info.type == "online")
				if (onlineInfo.length > 0) {

					const ch = guild.channels.cache.get(onlineInfo[0].id);
					if (ch == undefined) {
						try {
							return this.connection.query(`UPDATE guildConfig SET onlineCount = '${JSON.stringify({ name: 'Non définie' })}' WHERE guildId = '${guild.id}'`)

						} catch (e) {
							return;
						}
					} else {
						if (!ch.manageable) return
						if (ch.name != `${onlineInfo[0].name} ${guild.members.cache.filter(member => member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").size}`) {
							ch.setName(`${onlineInfo[0].name} ${guild.members.cache.filter(member => member.presence.status == "dnd" || member.presence.status == "idle" || member.presence.status == "online").size}`, 'OnlineCount')

						}
					}

				}
				let offlineInfo = counterInfo.filter(info => info.type == "offline")
				if (offlineInfo.length > 0) {

					const ch = guild.channels.cache.get(offlineInfo[0].id);
					if (ch == undefined) {
						try {
							return this.connection.query(`UPDATE guildConfig SET offlineCount = '${JSON.stringify({ name: 'Non définie' })}' WHERE guildId = '${guild.id}'`)

						} catch (e) {
							return;
						}
					} else {
						if (!ch.manageable) return

						if (ch.name != `${offlineInfo[0].name} ${guild.members.cache.filter(member => member.presence.status == "offline").size}`) {
							ch.setName(`${offlineInfo[0].name} ${guild.members.cache.filter(member => member.presence.status == "offline").size}`, 'OfflineCount')

						}
					}

				}
				let channelInfo = counterInfo.filter(info => info.type == "channel")
				if (channelInfo.length > 0) {

					const ch = guild.channels.cache.get(channelInfo[0].id);
					if (ch == undefined) {
						try {
							return this.connection.query(`UPDATE guildConfig SET offlineCount = '${JSON.stringify({ name: 'Non définie' })}' WHERE guildId = '${guild.id}'`)

						} catch (e) {
							return;
						}
					} else {
						if (!ch.manageable) return
						if (ch.name != `${channelInfo[0].name} ${guild.channels.cache.size}`) {
							ch.setName(`${channelInfo[0].name} ${guild.channels.cache.size}`, 'ChannelCount')

						}
					}

				}
				let roleInfo = counterInfo.filter(info => info.type == "role")
				if (roleInfo.length > 0) {

					const ch = guild.channels.cache.get(roleInfo[0].id);
					if (ch == undefined) {
						try {
							return this.connection.query(`UPDATE guildConfig SET roleCount = '${JSON.stringify({ name: 'Non définie' })}' WHERE guildId = '${guild.id}'`)

						} catch (e) {
							return;
						}
					} else {
						if (!ch.manageable) return

						if (ch.name != `${roleInfo[0].name} ${guild.roles.cache.size}`) {
							ch.setName(`${roleInfo[0].name} ${guild.roles.cache.size}`, 'Role Count')

						}
					}

				}
				let boosterInfo = counterInfo.filter(info => info.type == "booster")
				if (boosterInfo.length > 0) {

					const ch = guild.channels.cache.get(boosterInfo[0].id);
					if (ch == undefined) {
						try {
							return this.connection.query(`UPDATE guildConfig SET boosterCount = '${JSON.stringify({ name: 'Non définie' })}' WHERE guildId = '${guild.id}'`)

						} catch (e) {
							return;
						}
					} else {
						if (!ch.manageable) return

						if (ch.name != `${boosterInfo[0].name} ${guild.premiumSubscriptionCount || '0'}`) {
							ch.setName(`${boosterInfo[0].name} ${guild.premiumSubscriptionCount || '0'}`, 'Booster Count')

						}
					}

				}
			})
			// console.log(guild[0].id)

			// if(counter.has(guild.id)){

			// 		console.log(counter.get(guild.id))
			// 		const chInfo = JSON.parse(counter.get(guild.id))

			// 		const channel = guild.channels.cache.get(chInfo.id)
			// 		if(channel){
			// 			console.log(chInfo)
			// 			if(guild.memberCount != chInfo.name.replace(chInfo.name, " "))channel.setName(`${chInfo.name} ${guild.memberCount}`, `Member Count`)


			// 		}
			// }



		}, 600000)


	}
);
fetchCounter(counter)

// fetchCounter(counter, 'voice')
// fetchCounter(counter, 'online')
// fetchCounter(counter, 'offline')
// fetchCounter(counter, 'channel')
// fetchCounter(counter, 'role')
// fetchCounter(counter, 'boost')

