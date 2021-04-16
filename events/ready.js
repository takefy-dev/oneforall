﻿const StateManager = require('../utils/StateManager');
const { Logger } = require('advanced-command-handler');
const { DateTime } = require('luxon');
const BotPerso = require('../utils/BotPerso');
const { Event } = require('advanced-command-handler');
const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function indexOf(map, val) {
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
		// if(handler.client.BotPerso) {
		// 	const fs = require('fs');
		// 	const path = './config.json';
		// 	if (fs.existsSync(path)) {
		// 		await handler.client.users.fetch(require('../../config.json').owner, true);
		// 	} else {
		// 		await handler.client.users.fetch(process.env.OWNER, true)
		// 	}
		// }
		handler.client.guilds.cache.forEach( guild => {
			handler.client.users.fetch(guild.owner.user.id, true)
			Logger.log(`${guild.owner.user.username}`, `Fetching guild owners`, `white`)

		})


		setInterval(() => {
			handler.client.guilds.cache.filter(guild => guild.counter).forEach(async guild => {

					const counterInfo = guild.counter;
					let memberInfo = counterInfo.filter(info => info.type === "member");

					if(memberInfo[0].id){
						const channel = guild.channels.cache.get(memberInfo[0].id);
						if(!channel){
							try{
								Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
								const key = guild.counter.indexOf(memberInfo);
								guild.counter[key] = {name: 'Non définie',type: `${memberInfo[0].type}`}
								console.log(guild.counter)
								return this.connection.query(`UPDATE guildConfig set memberCount = '${JSON.stringify({name: 'Non définie',type: `${memberInfo[0].type}`})}' WHERE guildId = '${guild.id}'`);
							}catch(err){
								Logger.error(`Counter error mysql`, `Member count error`);
								return console.log(err);
							}
						}
						if(!channel.manageable) return Logger.warn(`Try to edit a channel but not manageable`, `Try editing channel`);
						if(channel.name !== `${memberInfo[0].name} ${guild.memberCount.toLocaleString()}`){
							await channel.setName(`${memberInfo[0].name} ${guild.memberCount.toLocaleString()}`, `MemberCount`);
						}
					}

					let botInfo = counterInfo.filter(info => info.type === "bot")
					if (botInfo[0].id) {
						const channel = guild.channels.cache.get(botInfo[0].id);
						if(!channel){
							try{
								Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
								const key = guild.counter.indexOf(botInfo);
								guild.counter[key] = {name: 'Non définie',type: `${botInfo[0].type}`}
								console.log(guild.counter)
								return this.connection.query(`UPDATE guildConfig set botCount = '${JSON.stringify({name: 'Non définie',type: `${botInfo[0].type}`})}' WHERE guildId = '${guild.id}'`);
							}catch(err){
								Logger.error(`Counter error mysql`, `Bot count error`);
								return console.log(err);
							}
						}
						if (!channel.manageable) return

						if (channel.name !== `${botInfo[0].name} ${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}`) {
							await channel.setName(`${botInfo[0].name} ${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}`, 'Bot count')

							}
						}


					let voiceInfo = counterInfo.filter(info => info.type === "voice")
					if (voiceInfo[0].id) {
						let count = 0
						const channel = guild.channels.cache.get(voiceInfo[0].id);
						if (!channel) {
							try{
								Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
								const key = guild.counter.indexOf(voiceInfo);
								guild.counter[key] = {name: 'Non définie',type: `${voiceInfo[0].type}`}
								console.log(guild.counter)
								return this.connection.query(`UPDATE guildConfig set voiceCount = '${JSON.stringify({name: 'Non définie',type: `${voiceInfo[0].type}`})}' WHERE guildId = '${guild.id}'`);
							}catch(err){
								Logger.error(`Counter error mysql`, `Voice count error`);
								return console.log(err);
							}
						}
						if (!channel.manageable) return
						const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
						for (const [, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
						if (channel.name !==`${voiceInfo[0].name} ${count}`) {
							await channel.setName(`${voiceInfo[0].name} ${count}`, 'Voice count')
						}
						

					}
					let onlineInfo = counterInfo.filter(info => info.type === "online")
					if (onlineInfo[0].id) {

						const channel = guild.channels.cache.get(onlineInfo[0].id);
						if (!channel) {
							try{
								Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
								const key = guild.counter.indexOf(voiceInfo);
								guild.counter[key] = {name: 'Non définie',type: `${onlineInfo[0].type}`}
								console.log(guild.counter)
								return this.connection.query(`UPDATE guildConfig set onlineCount = '${JSON.stringify({name: 'Non définie',type: `${onlineInfo[0].type}`})}' WHERE guildId = '${guild.id}'`);
							}catch(err){
								Logger.error(`Counter error mysql`, `Online count error`);
								return console.log(err);
							}
						} 
						if (!channel.manageable) return
						if (channel.name !== `${onlineInfo[0].name} ${guild.members.cache.filter(member => member.presence.status === "dnd" || member.presence.status === "idle" || member.presence.status === "online").size}`) {
								await channel.setName(`${onlineInfo[0].name} ${guild.members.cache.filter(member => member.presence.status === "dnd" || member.presence.status === "idle" || member.presence.status === "online").size}`, 'OnlineCount')
						}
						

					}
					let offlineInfo = counterInfo.filter(info => info.type === "offline")
					if (offlineInfo[0].id) {

						const channel = guild.channels.cache.get(offlineInfo[0].id);
						if (!channel) {
							try{
								Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
								const key = guild.counter.indexOf(voiceInfo);
								guild.counter[key] = {name: 'Non définie',type: `${offlineInfo[0].type}`}
								console.log(guild.counter)
								return this.connection.query(`UPDATE guildConfig set offlineCount = '${JSON.stringify({name: 'Non définie',type: `${offlineInfo[0].type}`})}' WHERE guildId = '${guild.id}'`);
							}catch(err){
								Logger.error(`Counter error mysql`, `Offline count error`);
								return console.log(err);
							}
						}
						if (!channel.manageable) return

						if (channel.name !== `${offlineInfo[0].name} ${guild.members.cache.filter(member => member.presence.status === "offline").size}`) {
							await channel.setName(`${offlineInfo[0].name} ${guild.members.cache.filter(member => member.presence.status === "offline").size}`, 'OfflineCount')

						}


					}
					let channelInfo = counterInfo.filter(info => info.type === "channel")
					if (channelInfo[0].id) {

						const channel = guild.channels.cache.get(channelInfo[0].id);
						if (!channel) {
							try{
								Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
								const key = guild.counter.indexOf(voiceInfo);
								guild.counter[key] = {name: 'Non définie',type: `${channelInfo[0].type}`}
								console.log(guild.counter)
								return this.connection.query(`UPDATE guildConfig set channelCount = '${JSON.stringify({name: 'Non définie',type: `${channelInfo[0].type}`})}' WHERE guildId = '${guild.id}'`);
							}catch(err){
								Logger.error(`Counter error mysql`, `Channel count error`);
								return console.log(err);
							}
						}
						if (!channel.manageable) return
						if (channel.name !== `${channelInfo[0].name} ${guild.channels.cache.size}`) {
							await channel.setName(`${channelInfo[0].name} ${guild.channels.cache.size}`, 'ChannelCount')

						}


					}
					let roleInfo = counterInfo.filter(info => info.type === "role")
					if (roleInfo[0].id) {

						const channel = guild.channels.cache.get(roleInfo[0].id);
						if (!channel) {
							try{
								Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
								const key = guild.counter.indexOf(voiceInfo);
								guild.counter[key] = {name: 'Non définie',type: `${roleInfo[0].type}`}
								console.log(guild.counter)
								return this.connection.query(`UPDATE guildConfig set roleCount = '${JSON.stringify({name: 'Non définie',type: `${roleInfo[0].type}`})}' WHERE guildId = '${guild.id}'`);
							}catch(err){
								Logger.error(`Counter error mysql`, `role count error`);
								return console.log(err);
							}
						}
						if (!channel.manageable) return

						if (channel.name !== `${roleInfo[0].name} ${guild.roles.cache.size}`) {
							await channel.setName(`${roleInfo[0].name} ${guild.roles.cache.size}`, 'Role Count')

						}


					}
					let boosterInfo = counterInfo.filter(info => info.type === "booster")
					if (boosterInfo[0].id) {

						const channel = guild.channels.cache.get(boosterInfo[0].id);
						if (!channel) {
							try{
								Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
								const key = guild.counter.indexOf(voiceInfo);
								guild.counter[key] = {name: 'Non définie',type: `${roleInfo[0].type}`}
								console.log(guild.counter)
								return this.connection.query(`UPDATE guildConfig set boosterCount = '${JSON.stringify({name: 'Non définie',type: `${roleInfo[0].type}`})}' WHERE guildId = '${guild.id}'`);
							}catch(err){
								Logger.error(`Counter error mysql`, `Boost count error`);
								return console.log(err);
							}
						}
						if (!channel.manageable) return

						if (channel.name !== `${boosterInfo[0].name} ${guild.premiumSubscriptionCount || '0'}`) {
								await channel.setName(`${boosterInfo[0].name} ${guild.premiumSubscriptionCount || '0'}`, 'Booster Count')

						}

					}
				})




		}, 1000)


	}
);

// fetchCounter(counter, 'voice')
// fetchCounter(counter, 'online')
// fetchCounter(counter, 'offline')
// fetchCounter(counter, 'channel')
// fetchCounter(counter, 'role')
// fetchCounter(counter, 'boost')

