
const cron = require('node-cron')
module.exports = {
    name: 'ready',
    run: async (client)=> {
        client.finishLoad = true
        await client.functions.sleep(1000)
        await client.managers.voiceManager.load();
        if(!client.botperso){
            client.guilds.cache.forEach(guild => {
                client.managers.blackListManager.getAndCreateIfNotExists(guild.ownerId
)
            })
        }else{
            client.managers.blackListManager.getAndCreateIfNotExists(client.owners[client.owners.length - 1])
        }
        // client.oneforallSocket.emit('send-commands', client.commands.filter(cm => cm.category !== "botOwner" && cm.category !== "test" && cm.category !== "botperso"))

        client.Logger.info(`${client.user.tag} logged in`, `CLIENT LOGIN`);
        // launc check mute
        const checkMute = require('../../utils/Mute')
        await checkMute.startChecking(client)
        //
        // // Launch event of music
        // const musicEventsLauncher = require("../../function/music/event");
        // await musicEventsLauncher.musicEvent(client.music, client);


        // setInterval(async function () {
        //     let guildArray;
        //     let guildCount;
        //     let channelArray;
        //     let userArray;
        //     await client.shard.fetchClientValues("guilds.cache.size").then((res) => {
        //         guildArray = res
        //     });
        //     await client.shard.fetchClientValues("channels.cache.size").then((res) => {
        //         channelArray = res
        //     });
        //     await client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)')
        //         .then(results => {
        //             userArray = results.reduce((acc, memberCount) => acc + memberCount, 0).toLocaleString()
        //         })
        //     // await this.botperso.query(`UPDATE stats SET guildCount = '${guildArray.reduce((acc, guildCount) => acc + guildCount, 0).toLocaleString()}'`)
        //     // await this.botperso.query(`UPDATE stats SET channelCount = '${channelArray.reduce((acc, channelCount) => acc + channelCount, 0).toLocaleString()}'`)
        //     // await this.botperso.query(`UPDATE stats SET userCount = '${userArray}'`)
        //     // await this.botperso.query(`UPDATE stats SET guildCount = '${client.guilds.cache.size.toLocaleString()}'`)
        //     // await this.botperso.query(`UPDATE stats SET channelCount = '${client.channels.cache.size.toLocaleString()}'`)
        //     // await this.botperso.query(`UPDATE stats SET userCount = '${client.guilds.cache.filter(g => g.available).reduce((a, b) => a + b.memberCount, 0).toLocaleString()}'`)
        // }, 20000)

        /**
         * Log information of the bot in the console.
         * @returns {void}
         */


        client.Logger.event(
            client.Logger.setColor('#c0433f', `Client online ! Client ${client.Logger.setColor('orange', client.user.username, '#c0433f')} has ${client.guilds.cache.size + client.Logger.setColor('#c0433f')
            } guilds, it sees ${client.users.cache.size + client.Logger.setColor('#c0433f')
            } users.`)
        );
        if(!client.botperso && !client.config.dev){
            setInterval(async () => {
                let guildArray;

                await client.cluster.fetchClientValues("guilds.cache.size").then((res) => {
                    guildArray = res
                });

                client.user.setActivity(`${guildArray.reduce((prev, guildCount) => prev + guildCount, 0)} Servers | !help`, {type: 'WATCHING'})
            }, 60000); // Runs this every 60 seconds.
        }



        client.guilds.cache.forEach(guild => {
            if (guild.deleted) return guild.leave();
            if (!guild.available) return guild.leave();
        })


        cron.schedule('*/10 * * * *', () => {
            client.Logger.log('Counter starting', 'EDITING CHANNEL', 'red')
            client.guilds.cache.forEach(async guild => {
                const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
                const {member, voice, online, offline, bot, channel, role, booster} = guildData.get('counter')


                if (member.id) {
                    const channel = guild.channels.cache.get(member.id);
                    if (!channel) {
                        try {
                            client.Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guildData.values.counter.member = {name: 'Non définie'}
                                
                            return guildData.save()

                        } catch (err) {
                            client.Logger.error(`Counter error mysql`, `Member count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return client.Logger.warn(`Try to edit a channel but not manageable`, `Try editing channel`);
                    if (channel.name !== `${member.name} ${guild.memberCount.toLocaleString()}`) {
                        await channel.setName(`${member.name} ${guild.memberCount.toLocaleString()}`, `MemberCount`);
                    }
                }

              
                if (bot.id) {
                    const channel = guild.channels.cache.get(bot.id);
                    if (!channel) {
                        try {
                            client.Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guildData.values.bot = {name: 'Non définie'}
                            return guildData.save()

                        } catch (err) {
                            client.Logger.error(`Counter error mysql`, `Bot count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return

                    if (channel.name !== `${bot.name} ${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}`) {
                        await channel.setName(`${bot.name} ${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}`, 'Bot count')

                    }
                }


                if (voice.id) {
                    let count = 0
                    const channel = guild.channels.cache.get(voice.id);
                    if (!channel) {
                        try {
                            client.Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guildData.values.voice = {name: 'Non définie'}
                            return guildData.save()


                        } catch (err) {
                            client.Logger.error(`Counter error mysql`, `Voice count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return
                    const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice');
                    for (const [, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
                    if (channel.name !== `${voice.name} ${count}`) {
                        await channel.setName(`${voice.name} ${count}`, 'Voice count')
                        count = 0
                    }


                }
                if (online.id) {

                    const channel = guild.channels.cache.get(online.id);
                    if (!channel) {
                        try {
                            client.Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guildData.values.online = {name: 'Non définie'}
                            return guildData.save()

                        } catch (err) {
                            client.Logger.error(`Counter error mysql`, `Online count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return
                    if (channel.name !== `${online.name} ${guild.members.cache.filter(member => member.presence.status === "dnd" || member.presence.status === "idle" || member.presence.status === "online").size}`) {
                        await channel.setName(`${online.name} ${guild.members.cache.filter(member => member.presence.status === "dnd" || member.presence.status === "idle" || member.presence.status === "online").size}`, 'OnlineCount')
                    }


                }
                if (offline.id) {

                    const channel = guild.channels.cache.get(offline.id);
                    if (!channel) {
                        try {
                            client.Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guildData.values.offline = {name: 'Non définie'}
                            return guildData.save()
                        } catch (err) {
                            client.Logger.error(`Counter error mysql`, `Offline count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return

                    if (channel.name !== `${offline.name} ${guild.members.cache.filter(member => member.presence.status === "offline").size}`) {
                        await channel.setName(`${offline.name} ${guild.members.cache.filter(member => member.presence.status === "offline").size}`, 'OfflineCount')

                    }


                }
                if (channel.id) {

                    const channel = guild.channels.cache.get(channel.id);
                    if (!channel) {
                        try {
                            client.Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guildData.values.channel = {name: 'Non définie'}
                            return guildData.save()
                        } catch (err) {
                            client.Logger.error(`Counter error mysql`, `Channel count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return
                    if (channel.name !== `${channel.name} ${guild.channels.cache.size}`) {
                        await channel.setName(`${channel.name} ${guild.channels.cache.size}`, 'ChannelCount')

                    }


                }
                if (role.id) {

                    const channel = guild.channels.cache.get(role.id);
                    if (!channel) {
                        try {
                            client.Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guildData.values.role = {name: 'Non définie'}
                            return guildData.save()
                        } catch (err) {
                            client.Logger.error(`Counter error mysql`, `role count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return

                    if (channel.name !== `${role.name} ${guild.roles.cache.size}`) {
                        await channel.setName(`${role.name} ${guild.roles.cache.size}`, 'Role Count')
                    }
                }
                if (booster.id) {
                    const channel = guild.channels.cache.get(booster.id);
                    if (!channel) {
                        try {
                            client.Logger.log(`Channel invalid deleting in db`, `INVALIDE COUNTER CHANNEL`, `red`)
                            guildData.values.booster = {name: 'Non définie'}
                            return guildData.save()
                        } catch (err) {
                            client.Logger.error(`Counter error mysql`, `Boost count error`);
                            return console.log(err);
                        }
                    }
                    if (!channel.manageable) return

                    if (channel.name !== `${booster.name} ${guild.premiumSubscriptionCount || '0'}`) {
                        await channel.setName(`${booster.name} ${guild.premiumSubscriptionCount || '0'}`, 'Booster Count')

                    }

                }
            })


        })
        // setTimeout(async () => {
        //     await new Coins(client).init()
        //
        // }, 5000)

    }
}


