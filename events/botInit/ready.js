const {DateTime} = require('luxon');
const Event = require('../../structures/Handler/Event');
const Discord = require('discord.js')
const {Logger} = require("advanced-command-handler");
const {GiveawaysManager} = require('discord-giveaways')
const cron = require('node-cron')
const Coins = require('../../utils/StartCoins')
module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'ready',
        });
    }

    async run(client) {
        Logger.info(`${client.user.tag} logged in`, `CLIENT LOGIN`);
        const Giveaway = class extends GiveawaysManager {
            async refreshStorage() {
                // This should make all shard refreshing their cache with the updated database
                return client.shard.broadcastEval(() => this.giveaways.getAllGiveaways());
            }

            // This function is called when the manager needs to get all the giveaway stored in the database.
            async getAllGiveaways() {

                return new Promise(function (resolve, reject) {
                    client.database.models.giveaways.findAll({
                        attributes: ['data']
                    }).then(res => {
                        const giveaways = res.map((row) => {
                            return row.dataValues.data
                        });
                        resolve(giveaways);
                    }).catch(err => console.log(err))


                });
            }

            // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
            async saveGiveaway(messageID, giveawayData) {
                return new Promise(function (resolve, reject) {
                    client.database.models.giveaways.create({
                        message_id: messageID,
                        data: giveawayData
                    }).then(() => {
                        resolve(true)
                    }).catch(err => console.log(err))

                });
            }

            async editGiveaway(messageID, giveawayData) {
                return new Promise(function (resolve, reject) {
                    client.database.models.giveaways.update({
                        data: giveawayData
                    }, {
                        where: {
                            message_id: messageID
                        }
                    }).then(() => {
                        resolve(true)
                    }).catch(err => console.log(err))

                });
            }

            // This function is called when a giveaway needs to be deleted from the database.
            async deleteGiveaway(messageID) {
                return new Promise(function (resolve, reject) {
                    client.database.models.giveaways.destroy({
                        where: {
                            message_id: messageID
                        }
                    }).then(() => {
                        resolve(true)
                    }).catch(err => console.log(err))

                });
            }
        };
        client.giveaway = new Giveaway(client, {
            storage: false, // Important - use false instead of a storage path
            updateCountdownEvery: 10000,
            default: {
                botsCanWin: false,
                embedColor: '#7289da',
                reaction: '🎉'
            }
        });


        //launc check mute
        const checkMute = require('../../utils/Mute')
        await checkMute.startChecking(client)

        // Launch event of music
        const musicEventsLauncher = require("../../function/music/event");
        await musicEventsLauncher.musicEvent(client.music, client);


        setInterval(async function () {
            let guildArray;
            let guildCount;
            let channelArray;
            let userArray;
            await client.shard.fetchClientValues("guilds.cache.size").then((res) => {
                guildArray = res
            });
            await client.shard.fetchClientValues("channels.cache.size").then((res) => {
                channelArray = res
            });
            await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')
                .then(results => {
                    userArray = results.reduce((acc, memberCount) => acc + memberCount, 0).toLocaleString()
                })
            // await this.botperso.query(`UPDATE stats SET guildCount = '${guildArray.reduce((acc, guildCount) => acc + guildCount, 0).toLocaleString()}'`)
            // await this.botperso.query(`UPDATE stats SET channelCount = '${channelArray.reduce((acc, channelCount) => acc + channelCount, 0).toLocaleString()}'`)
            // await this.botperso.query(`UPDATE stats SET userCount = '${userArray}'`)
            // await this.botperso.query(`UPDATE stats SET guildCount = '${client.guilds.cache.size.toLocaleString()}'`)
            // await this.botperso.query(`UPDATE stats SET channelCount = '${client.channels.cache.size.toLocaleString()}'`)
            // await this.botperso.query(`UPDATE stats SET userCount = '${client.guilds.cache.filter(g => g.available).reduce((a, b) => a + b.memberCount, 0).toLocaleString()}'`)
        }, 20000)

        /**
         * Log information of the bot in the console.
         * @returns {void}
         */


        Logger.event(
            Logger.setColor('#c0433f', `Client online ! Client ${Logger.setColor('orange', client.user.username, '#c0433f')} has ${client.guilds.cache.size + Logger.setColor('#c0433f')
            } guilds, it sees ${client.users.cache.size + Logger.setColor('#c0433f')
            } users.`)
        );
        setInterval(async () => {
            let guildArray;

            await client.shard.fetchClientValues("guilds.cache.size").then((res) => {
                guildArray = res
            });

            client.user.setActivity(`${guildArray.reduce((prev, guildCount) => prev + guildCount, 0)} Servers | !help`, {type: 'WATCHING'})
        }, 60000); // Runs this every 60 seconds.
        if (client.botperso) {
            const fs = require('fs');
            const path = './config.json';
            if (fs.existsSync(path)) {
                await client.users.fetch(require('../../config.json').owner, true);
            } else {
                await client.users.fetch(process.env.OWNER, true)
            }
        }

        client.guilds.cache.forEach( guild => {
            const user = client.users.cache.get(guild.ownerID)
            if (user) {
                user.fetchBlacklistedUsers();
            }
            // Logger.log(`${guild.owner.user.username}`, `Fetching guild owners`, `white`)

        })


        client.guilds.cache.forEach(guild => {
            if (guild.deleted) return guild.leave();
            if (!guild.available) return guild.leave();
        })


        cron.schedule('*/10 * * * *', () => {
            Logger.log('Counter starting', 'EDITING CHANNEL', 'red')
            client.guilds.cache.forEach(async guild => {
                const counterInfo = guild.counter;

                let memberInfo = counterInfo.filter(info => info.type === "member");

                if (memberInfo[0].id) {
                    const channel = guild.channels.cache.get(memberInfo[0].id);
                    if (!channel) {
                        try {
                            Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guild.config.memberCount = {name: 'Non définie', type: `${memberInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                memberCount: {
                                    name: 'Non définie',
                                    type: `${memberInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})

                        } catch (err) {
                            Logger.error(`Counter error mysql`, `Member count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return Logger.warn(`Try to edit a channel but not manageable`, `Try editing channel`);
                    if (channel.name !== `${memberInfo[0].name} ${guild.memberCount.toLocaleString()}`) {
                        await channel.setName(`${memberInfo[0].name} ${guild.memberCount.toLocaleString()}`, `MemberCount`);
                    }
                }

                let botInfo = counterInfo.filter(info => info.type === "bot")
                if (botInfo[0].id) {
                    const channel = guild.channels.cache.get(botInfo[0].id);
                    if (!channel) {
                        try {
                            Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guild.config.botCount = {name: 'Non définie', type: `${botInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                botCount: {
                                    name: 'Non définie',
                                    type: `${botInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})

                        } catch (err) {
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
                        try {
                            Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guild.config.voiceCount = {name: 'Non définie', type: `${voiceInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                voiceCount: {
                                    name: 'Non définie',
                                    type: `${voiceInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})

                        } catch (err) {
                            Logger.error(`Counter error mysql`, `Voice count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return
                    const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
                    for (const [, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
                    if (channel.name !== `${voiceInfo[0].name} ${count}`) {
                        await channel.setName(`${voiceInfo[0].name} ${count}`, 'Voice count')
                    }


                }
                let onlineInfo = counterInfo.filter(info => info.type === "online")
                if (onlineInfo[0].id) {

                    const channel = guild.channels.cache.get(onlineInfo[0].id);
                    if (!channel) {
                        try {
                            Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guild.config.onlineCount = {name: 'Non définie', type: `${onlineInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                onlineCount: {
                                    name: 'Non définie',
                                    type: `${onlineInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})

                        } catch (err) {
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
                        try {
                            Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guild.config.offlineCount = {name: 'Non définie', type: `${offlineInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                offlineCount: {
                                    name: 'Non définie',
                                    type: `${offlineInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})
                        } catch (err) {
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
                        try {
                            Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guild.config.channelCount = {name: 'Non définie', type: `${channelInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                channelCount: {
                                    name: 'Non définie',
                                    type: `${channelInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})
                        } catch (err) {
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
                        try {
                            Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guild.config.roleCount = {name: 'Non définie', type: `${roleInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                roleCount: {
                                    name: 'Non définie',
                                    type: `${roleInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})
                        } catch (err) {
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
                        try {
                            Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guild.config.boosterCount = {name: 'Non définie', type: `${boosterInfo[0].type}`}

                            return client.database.models.guildConfig.update({
                                boosterCount: {
                                    name: 'Non définie',
                                    type: `${boosterInfo[0].type}`
                                }
                            },{ where: {guildId: guild.id}})
                        } catch (err) {
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


        })
        setTimeout(async () => {
            await new Coins(client).init()

        }, 5000)

    }
}


