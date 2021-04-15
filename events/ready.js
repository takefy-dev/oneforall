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


		// Launch event of music
		const musicEventsLauncher = require("../function/music/event");
		musicEventsLauncher.musicEvent(handler.client.music);


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
		console.log(handler.client.users.cache.get("188356697482330122").playlist)


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

