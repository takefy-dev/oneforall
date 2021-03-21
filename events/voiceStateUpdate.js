const StateManager = require('../utils/StateManager');
const BaseEvent = require('../utils/structures/BaseEvent');
var checkBotOwner = require('../function/check/botOwner');
const guildEmbedColor = new Map();
var checkWl = require('../function/check/checkWl');
var logsChannelF = require('../function/fetchLogs');
var embedsColor = require('../function/embedsColor');
const Discord = require('discord.js');
const logsChannelId = new Map();
const logsVoiceId = new Map();
const antiDecoOn = new Map();
var checkBotOwner = require('../function/check/botOwner');
const guildAntiraidConfig = new Map();
const { Event } = require('advanced-command-handler');
const tempVocOn = new Map();
const tempVocInfo = new Map();
const statsOn = new Map();
const activeMemberInVoice = new Map();
const activeMemberInVoiceCoins = new Map();
const coinSettings = new Map();
const userCoins = new Map();
module.exports = new Event(
    {
        name: 'voiceStateUpdate',
    },
    module.exports = async (handler, oldState, newState) => {
        this.connection = StateManager.connection;
        if(newState.id === handler.client.user.id) return await newState.guild.me.voice.setSelfDeaf(true);

        const color = guildEmbedColor.get(oldState.guild.id);
        //#region voiceState
        if (statsOn.get(oldState.guild.id) == '1') {
            if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
            if (!oldState.channelID && newState.channelID) { // This user has join the channel.
                activeMemberInVoice.set(oldState.id, Date.now());
            }
            let data;
            if (!activeMemberInVoice.has(oldState.id)) {
                data = Date.now();
                activeMemberInVoice.set(oldState.id, data); // check current data for the existence of
            }
            else {
                data = activeMemberInVoice.get(oldState.id);

            }
            let duration = Date.now() - data;
            if (oldState.channelID && !newState.channelID) { // This user has left the channel.
                activeMemberInVoice.delete(oldState.id);
                await this.connection.query(`SELECT duration FROM statsVoc WHERE channelId = '${oldState.channelID}' AND userId = '${oldState.id}'`).then(async (res) => {
                    if (res[0].length != 0) {
                        duration = parseInt(duration) + res[0][0].duration;
                        await this.connection.query(`UPDATE statsVoc SET duration = '${duration}', disconnectDate=NOW()  WHERE channelId = '${oldState.channelID}' AND userId = '${oldState.id}'`)
                    } else {
                        await this.connection.query(`INSERT INTO statsVoc (userId, guildId, channelId, duration, disconnectDate) VALUES ('${oldState.id}', '${oldState.guild.id}', '${oldState.channelID}' ,'${duration}', NOW()) `)

                    }

                })
            }
            else if (oldState.channelID && newState.channelID) { // This user has changes the channel.
                activeMemberInVoice.set(oldState.id, Date.now());
                await this.connection.query(`SELECT duration FROM statsVoc WHERE channelId = '${oldState.channelID}' AND userId = '${oldState.id}'`).then(async (res) => {
                    if (res[0].length != 0) {
                        duration = parseInt(duration) + res[0][0].duration;
                        await this.connection.query(`UPDATE statsVoc SET duration = '${duration}', disconnectDate=NOW()  WHERE channelId = '${oldState.channelID}' AND userId = '${oldState.id}'`)
                    } else {
                        await this.connection.query(`INSERT INTO statsVoc (userId, guildId, channelId, duration, disconnectDate) VALUES ('${oldState.id}', '${oldState.guild.id}', '${oldState.channelID}' ,'${duration}', NOW()) `)

                    }

                })

            }
        }
        //#endregion voiceState
        //#region coins
        const guildCoinsSettings = coinSettings.get(oldState.guild.id);
        if (guildCoinsSettings.enable) {
            let guildUserCoins = userCoins.get(oldState.guild.id);
            const streamBoost = parseInt(guildCoinsSettings.streamBoost);
            const muteDiviseur = parseInt(guildCoinsSettings.muteDiviseur);
            if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
            if (!oldState.channelID && newState.channelID) { // This user has join the channel.
                activeMemberInVoiceCoins.set(oldState.id, Date.now());
            }
            let data;
            if (!activeMemberInVoiceCoins.has(oldState.id)) {
                data = Date.now();
                activeMemberInVoiceCoins.set(oldState.id, data); // check current data for the existence of
            }
            else {
                data = activeMemberInVoiceCoins.get(oldState.id);

            }
            let duration = Date.now() - data;
            if (oldState.channelID && !newState.channelID) { // This user has left the channel.
                activeMemberInVoiceCoins.delete(oldState.id);
                let durationMin = duration * 1.66667e-5;
                if (durationMin >= 1) {
                    if (oldState.serverDeaf || oldState.serverMute || oldState.selfDeaf || oldState.selfMute) {
                        durationMin = (duration * 1.66667e-5) / muteDiviseur;
                    } else if (oldState.selfVideo || oldState.streaming) {
                        durationMin = (duration * 1.66667e-5) * streamBoost
                    }
                    if (guildUserCoins) {
                        const userCoinsInfo = guildUserCoins.filter(coins => coins.userId === oldState.id);
                        if (userCoinsInfo.length !== 0) {
                            const coins = parseInt(userCoinsInfo[0].coins + durationMin) ;
                            console.log(coins)
                            const index = guildUserCoins.indexOf(userCoinsInfo[0])
                            guildUserCoins[index].coins = coins;
                            StateManager.emit('guildCoins', oldState.guild.id, guildUserCoins)
                            await this.connection.query(`UPDATE coins SET coins = '${coins}' WHERE guildId = '${oldState.guild.id}' AND userId = '${oldState.id}'`);
                        } else {
                            const coins = parseInt(durationMin);
                            const newUserCoins = { userId: oldState.id, coins };
                            guildUserCoins.push(newUserCoins);
                            await this.connection.query(`INSERT INTO coins (userId, guildId,  coins)VALUES ('${oldState.id}', '${oldState.guild.id}', '${coins}') `)

                        }
                    } else {

                        const coins = parseInt(durationMin);
        
                        await this.connection.query(`INSERT INTO coins (userId, guildId, coins) VALUES ('${oldState.id}', '${oldState.guild.id}', '${coins}') `).then(() =>{
                            const newGuildUserCoins = []
                            newGuildUserCoins.push({userId: oldState.id, coins})
                            userCoins.set(oldState.guild.id, newGuildUserCoins)
                            guildUserCoins = userCoins.get(oldState.guild.id)
                            StateManager.emit('guildCoins', oldState.guild.id, guildUserCoins)
                        })

                    }




                }

            }
            else if (oldState.channelID && newState.channelID) { // This user has changes the channel.
                activeMemberInVoiceCoins.set(oldState.id, Date.now());
                let durationMin = duration * 1.66667e-5;

                if (durationMin >= 1) {
                    if (oldState.serverDeaf || oldState.serverMute || oldState.selfDeaf || oldState.selfMute) {
                        durationMin = (duration * 1.66667e-5) / muteDiviseur;
                    } else if (oldState.selfVideo || oldState.streaming) {
                        durationMin = (duration * 1.66667e-5) * streamBoost;
                    }
                    if (guildUserCoins) {
                        const userCoinsInfo = guildUserCoins.filter(coins => coins.userId === oldState.id);

                        if (userCoinsInfo.length !== 0) {
                            const coins = parseInt(userCoinsInfo[0].coins + durationMin) ;
                            const index = guildUserCoins.indexOf(userCoinsInfo[0])
                            guildUserCoins[index].coins = coins;
                            StateManager.emit('guildCoins', oldState.guild.id, guildUserCoins)
                            await this.connection.query(`UPDATE coins SET coins = '${coins}' WHERE guildId = '${oldState.guild.id}' AND userId = '${oldState.id}'`);
                        } else {
                            const coins = parseInt(durationMin);
                            const newUserCoins = { userId: oldState.id, coins };
                            guildUserCoins.push(newUserCoins);
                            await this.connection.query(`INSERT INTO coins (userId, guildId,  coins)VALUES ('${oldState.id}', '${oldState.guild.id}', '${coins}') `)

                        }
                    } else {

                        const coins = parseInt(durationMin);

                     
                        await this.connection.query(`INSERT INTO coins VALUES (userId, guildId, coins) ('${oldState.id}', '${oldState.guild.id}', '${coins}') `).then(() =>{
                            const newGuildUserCoins = []
                            newGuildUserCoins.push({userId: oldState.id, coins})
                            userCoins.set(oldState.guild.id, newGuildUserCoins)
                            guildUserCoins = userCoins.get(oldState.guild.id)
                            StateManager.emit('guildCoins', oldState.guild.id, guildUserCoins)
    
                        })

                    }

                }

            }

        }


        //#endregion coins


        //#region tempvoc
        if (tempVocOn.has(oldState.guild.id)) {
            let isOnTempVoc;
            if (tempVocOn.get(oldState.guild.id) == '1') isOnTempVoc = true;
            if (tempVocOn.get(oldState.guild.id) == '0') isOnTempVoc = false;
            const tempVocINFO = tempVocInfo.get(oldState.guild.id);
            if (isOnTempVoc == true) {
                if (oldState.channelID == null) {
                    if (newState.channelID == tempVocINFO.chId) {
                        const category = oldState.guild.channels.cache.get(tempVocINFO.catId)
                        if (!category) return;
                        console.log(tempVocInfo)
                        // create salon with user name
                        const chName = `${tempVocINFO.chName.replace('{username}', newState.member.user.username)}`
                        oldState.guild.channels.create(chName, {
                            type: 'voice',
                            parent: category,
                            reason: `Vocal temporaire`
                        }).then(c => {
                            c.createOverwrite(newState.member, {
                                MANAGE_CHANNELS: true,
                                MANAGE_ROLES: true,
                            });
                            // Move user to ch
                            newState.member.voice.setChannel(c)
                        })
                    }
                } else if (newState.channelID === null) {
                    if (oldState.channel.parentID === tempVocINFO.catId) {
                        // -- Vérifie aussi que personne est dans le salon
                        if (oldState.channelID === tempVocINFO.chId) return;
                        if (oldState.channel.members.size === 0) {
                            // -- Supprime le salon si personne est dedans
                            oldState.channel.delete({ reason: `Personne dans le salon` })
                        }
                    }
                } else if (oldState.channelID !== null && newState.channelID !== null) {
                    // -- Vérifie si l'ancien salon appartient a la catégorie et que le nouveau salon n'est pas le salon de création
                    if (oldState.channel.parentID === tempVocINFO.catId && newState.channel.id !== tempVocINFO.chId) {

                        // -- Vérifie si l'ancien salon est le salon de création (pour éviter de le supprimer)
                        if (oldState.channelID === tempVocINFO.chId) {
                            null;
                            // -- Ou alors si le salon n'est pas le salon de création:
                        } else {
                            // -- Vérifie que le salon est vide
                            if (oldState.channel.members.size === 0) {
                                // -- Supprime le salon
                                if (oldState.channelID === tempVocINFO.chId) return;
                                oldState.channel.delete({ reason: `Salon temporaire - Plus personne dans le salon` })
                            }
                        }

                        // -- Ou alors vérifie que l'ancien salon appartient a la catégorie, que l'ancien salon n'est pas celui de la création de salon et que le nouveau salon est le salon de création
                    } else if (oldState.channel.parentID === tempVocINFO.catId && oldState.channelID !== tempVocINFO.chId && newState.channelID === tempVocINFO.chId) {
                        // -- Vérifie que l'ancien salon est vide
                        if (oldState.channel.members.size === 0) {
                            // -- Supprime le salon
                            oldState.channel.delete({ reason: `Salon temporaire - Plus personne dans le salon` })
                        }
                        // -- 
                        // -- Obtiens la catégorie 
                        const category = oldState.guild.channels.cache.get(tempVocINFO.catId);
                        const chName = `${tempVocINFO.chName.replace('{username}', newState.member.user.username)}`
                        // -- Crée un salon de type vocal avec comme nom le pseudo de la personne et le définis dans la catégorie
                        oldState.guild.channels.create(chName, {
                            type: 'voice',
                            parent: category,
                            reason: `Vocal temporaire`
                            // -- Après
                        }).then(c => {
                            // -- Ajoute des permissions au salon pour le membre en lui attribuant toutes les permissions sur le salon
                            c.createOverwrite(newState.member, {
                                MANAGE_CHANNELS: true,
                                MANAGE_ROLES: true
                            });
                            // -- Déplace l'utilisateur dans le salon
                            newState.member.voice.setChannel(c)
                        })

                    } else if (newState.channel.parentID === tempVocINFO.catId && oldState.channelID !== tempVocINFO.chId && newState.channelID === tempVocINFO.chId) {

                        // -- Obtiens la catégorie 
                        const category = oldState.guild.channels.cache.get(tempVocINFO.catId);
                        const chName = `${tempVocINFO.chName.replace('{username}', newState.member.user.username)}`
                        // -- Crée un salon de type vocal avec comme nom le pseudo de la personne et le définis dans la catégorie
                        oldState.guild.channels.create(chName, {
                            type: 'voice',
                            parent: category,
                            reason: `Vocal temporaire`
                            // -- Après
                        }).then(c => {
                            // -- Ajoute des permissions au salon pour le membre en lui attribuant toutes les permissions sur le salon
                            c.createOverwrite(newState.member, {
                                MANAGE_CHANNELS: true,
                                MANAGE_ROLES: true
                            });
                            // -- Déplace l'utilisateur dans le salon
                            newState.member.voice.setChannel(c)
                        })

                    }
                }
            }

        }
        //#endregion tempvoc
        //#region  log
        let logVoiceId = logsVoiceId.get(oldState.guild.id);
        let logVoice

        if (logVoiceId != undefined) {
            logVoice = oldState.guild.channels.cache.get(logVoiceId)


        }
        if (logVoice != undefined && !oldState.bot) {
            let logEmbed;
            let member;
            let channel;

            if (oldState.channelID == null && newState != undefined && newState.channelID != null) {
                member = await oldState.guild.members.fetch(oldState.id);
                channel = await newState.guild.channels.cache.get(newState.channelID)
                logEmbed = new Discord.MessageEmbed()
                    .setTitle('\`🔊\` Connexion à un salon')
                    .setDescription(`
                      \`👨‍💻\` Auteur : **${member.user.tag}** \`(${member.user.id})\` s'est connecté\n
                        \`\`\`${channel.name}\`\`\`
                      \`🧾\` SALON ID : ${newState.channelID}
            
                    `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                logVoice.send(logEmbed)
            }
            if (oldState.channelID != null && newState != undefined && newState.channelID == null) {
                member = await oldState.guild.members.fetch(oldState.id);
                channel = await newState.guild.channels.cache.get(oldState.channelID)
                logEmbed = new Discord.MessageEmbed()
                    .setTitle('\`🔊\` Deconnexion à un salon')
                    .setDescription(`
                      \`👨‍💻\` Auteur : **${member.user.tag}** \`(${member.user.id})\` s'est deconnecté\n
                        \`\`\`${channel.name}\`\`\`
                      \`🧾\` SALON ID : ${oldState.channelID}
            
                    `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                logVoice.send(logEmbed)
            }
            if (oldState.channelID != null && newState != undefined && newState.channelID != null && oldState.channelID != newState.channelID) {
                let action = await oldState.guild.fetchAuditLogs({ type: "MEMBER_MOVE", limit: 1 }).then(async (audit) => audit.entries.first());
                const { executor, target } = action
                member = await oldState.guild.members.fetch(oldState.id);
                channel = await newState.guild.channels.cache.get(oldState.channelID)
                logEmbed = new Discord.MessageEmbed()
                    .setTitle('\`🔊\` Changement de salon')
                    .setDescription(`
                      \`👨‍💻\` Auteur : **${member.user.tag}** \`(${member.user.id})\` s'est déplacé\n
                        \`\`\`${channel.name}\`\`\`
                      \`🧾\` SALON ID : ${oldState.channelID}
            
                    `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                if (!action) {
                    logVoice.send(logEmbed)
                }
                if (executor.id == oldState.id) {
                    logVoice.send(logEmbed)
                }
                else if (action.extra.channel.id != oldState.id && executor.id != oldState.id) {
                    logEmbed = new Discord.MessageEmbed()
                        .setTitle('\`🔊\` Changement de salon')
                        .setDescription(`
                        \`👨‍💻\` Auteur : **${executor.tag}** \`(${executor.id})\` a déplacé **${member.user.tag}** \`${member.user.id}\`\n
                            \`\`\`${channel.name}\`\`\`
                        \`🧾\` SALON ID : ${oldState.channelID}
                
                        `)
                        .setTimestamp()
                        .setFooter("🕙")
                        .setColor(`${color}`)
                    logVoice.send(logEmbed)

                }



            }
            if (!oldState.selfMute && newState.selfMute && oldState.channelID != null) {
                member = await oldState.guild.members.fetch(oldState.id);
                channel = await newState.guild.channels.cache.get(oldState.channelID)
                logEmbed = new Discord.MessageEmbed()
                    .setTitle('\`🔊\` Mute')
                    .setDescription(`
                    \`👨‍💻\` Auteur : **${member.user.tag}** \`(${member.user.id})\` s'est mute\n
                        \`\`\`${channel.name}\`\`\`
                    \`🧾\` SALON ID : ${newState.channelID}
            
                    `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                logVoice.send(logEmbed)
            }
            if (oldState.selfMute && !newState.selfMute && newState.channelID != null) {
                member = await oldState.guild.members.fetch(oldState.id);
                channel = await newState.guild.channels.cache.get(oldState.channelID)
                logEmbed = new Discord.MessageEmbed()
                    .setTitle('\`🔊\` unmute')
                    .setDescription(`
                    \`👨‍💻\` Auteur : **${member.user.tag}** \`(${member.user.id})\` s'est unmute\n
                        \`\`\`${channel.name}\`\`\`
                    \`🧾\` SALON ID : ${newState.channelID}
            
                    `)
                    .setTimestamp()
                    .setFooter("🕙")
                    .setColor(`${color}`)
                logVoice.send(logEmbed)
            }
        };
        if (oldState.channel != null && newState.channel != null) {
            if (oldState.member.id === handler.client.user.id) {
                newState.channel.leave()
                oldState.channel.members.forEach(m => {
                    m.voice.setChannel(newState.channel.id)
                })
            }

        }
        //#endregion log



        //#region  anti deco
        // const isOn = antiDecoOn.get(oldState.guild.id)
        // if (isOn == '1') {
        //     // if(newState) return;

        //     let logChannelId = logsChannelId.get(oldState.guild.id);
        //     let logChannel = handler.client.guilds.cache.get(oldState.guild.id).channels.cache.get(logChannelId)

        //     let action = await oldState.guild.fetchAuditLogs({ type: "MEMBER_DISCONNECT" }).then(async (audit) => audit.entries.first());
        //     if(action == undefined) return;
        //     if (action.executor == undefined) return;
        //     if (action.executor.id === handler.client.user.id) return;
        //     const actionTime = new Date(action.createdTimestamp);
        //     const actualDate = new Date(Date.now());
        //     const formatedActionTime = parseInt(actionTime.getHours()) + parseInt(actionTime.getMinutes()) + parseInt(actionTime.getSeconds())
        //     const formatedActualtime = parseInt(actualDate.getHours()) + parseInt(actualDate.getMinutes()) + parseInt(actualDate.getSeconds())
        //     if (formatedActualtime === formatedActionTime) {
        //         console.log(action)

        //         var isOwner = checkBotOwner(oldState.guild.id, action.executor.id);

        //         const isWlOnFetched = await this.connection.query(`SELECT antiDeco FROM antiraidWlBp WHERE guildId = '${oldState.guild.id}'`);
        //         const isWlOnfetched = isWlOnFetched[0][0].antiDeco;
        //         let isOnWl;
        //         if (isWlOnfetched == "1") { isOnWl = true };
        //         if (isWlOnfetched == "0") { isOnWl = false };

        //         let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${oldState.guild.id}'`);
        //         let isWlfetched = isWlFetched[0][0].whitelisted.toString();
        //         let isWl1 = isWlfetched.split(",");
        //         let isWl;
        //         if (isWl1.includes(action.executor.id)) { isWl = true };
        //         if (!isWl1.includes(action.executor.id)) { isWl = false };


        //         if (isOwner == true || oldState.guild.ownerID == action.executor.id || isOn == false) {
        //             return;
        //         } else if (isOwner == true || oldState.guild.ownerID == action.executor.id || isOn == false || isOnWl == true && isWl == true) {

        //             return;
        //         } else if (isOn == true && isOwner == false || oldState.guild.owner.id !== action.executor.id || isOnWl == true && isWl == false || isOnWl == false) {
        //             let guild = handler.client.guilds.cache.find(guild => guild.id === oldState.guild.id);

        //             let after = await this.connection.query(`SELECT antideco FROM antiraidconfig WHERE guildId = '${oldState.guild.id}'`)

        //             let targetMember = guild.members.cache.get(action.executor.id);
        //             if (targetMember == undefined) {
        //                 await oldState.guild.members.fetch().then((members) => {
        //                     targetMember = members.get(action.executor.id)
        //                 })
        //             }
        //             if (targetMember.roles.highest.comparePositionTo(guild.me.roles.highest) <= 0) {
        //                 if (after[0][0].antideco === 'ban') {
        //                     guild.members.ban(action.executor.id)
        //                 } else if (after[0][0].antideco === 'kick') {
        //                     guild.member(action.executor.id).kick(
        //                         `OneForAll - Type: antideco `
        //                     )
        //                 } else if (after[0][0].antideco === 'unrank') {
        //                     let roles = []
        //                     let role = await guild.member(action.executor.id).roles.cache
        //                         .map(role => roles.push(role.id))
        //                     role
        //                     guild.members.cache.get(action.executor.id).roles.remove(roles, `OneForAll - Type: antideco`)
        //                     if (action.executor.bot) {
        //                         let botRole = targetMember.roles.cache.filter(r => r.managed)
        // 				// let r = guild.roles.cache.get(botRole.id)

        //                         for(const[id] of botRole){
        //                             botRole = guild.roles.cache.get(id)
        //                         }
        //                         botRole.setPermissions(0, `OneForAll - Type: antideco`)
        //                             }
        //                 }


        //                 const logsEmbed = new Discord.MessageEmbed()
        //                     .setTitle(`\`🔈\`Déconnection d'un membre `)
        //                     .setDescription(`
        //                     \`👨‍💻\`Auteur : **${guild.members.cache.get(action.executor.id).user.tag}** \`(${action.executor.id})\` a déconnecté :\n
        //                     \`\`\`un membre\`\`\`
        //                     \`🧾\`Sanction : ${after[0][0].antideco}`)
        //                     .setTimestamp()
        //                     .setFooter('🕙')
        //                     .setColor(`${color}`);
        //                     if (logChannel != undefined){
        //                         logChannel.send(logsEmbed);

        //                     }
        //             } else {


        //                 const logsEmbed = new Discord.MessageEmbed()
        //                     .setTitle(`\`🔈\`Déconnection d'un membre `)
        //                     .setDescription(`
        //                     \`👨‍💻\`Auteur : **${guild.members.cache.get(action.executor.id).user.tag}** \`(${action.executor.id})\` a déconnecté :\n
        //                     \`\`\`un membre\`\`\`
        //                     \`🧾\`Sanction : Aucune car il possède  plus de permissions que moi`)
        //                     .setTimestamp()
        //                     .setFooter('🕙')
        //                     .setColor(`${color}`);
        //                     if (logChannel != undefined){
        //                         logChannel.send(logsEmbed);

        //                     }
        //             }
        //         }
        //     }


        // }
        //#endregion anti deco



    }
)
logsChannelF(logsChannelId, 'raid');
logsChannelF(logsVoiceId, 'voice');

embedsColor(guildEmbedColor);
StateManager.on('antiDecoFetch', (guildId, on) => {
    antiDecoOn.set(guildId, on)
})
StateManager.on('antiDecoUpdate', (guildId, on) => {
    antiDecoOn.set(guildId, on)
})
StateManager.on('antiraidConfF', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('tempvocDel', guildId => {
    tempVocOn.delete(guildId)
    tempVocInfo.delete(guildId)
})
StateManager.on('tempVocOnUp', (guildId, isOn) => {
    tempVocOn.set(guildId, isOn)
})
StateManager.on('tempVocOnFetched', (guildId, isOn) => {
    if (isOn == 'Activé') tempVocOn.set(guildId, "1")
    if (isOn == 'Désactivé') tempVocOn.set(guildId, "0")

})

StateManager.on('tempVocInfoUp', (guildId, info) => {
    tempVocInfo.set(guildId, info)
})
StateManager.on('tempVocInfoFetched', (guildId, info) => {
    tempVocInfo.set(guildId, info)


})
StateManager.on('statsOnU', (guildId, on) => {
    statsOn.set(guildId, on)
})
StateManager.on('statsOnF', (guildId, on) => {
    statsOn.set(guildId, on)
})

StateManager.on('coinSettings', (guildId, settings) => {
    coinSettings.set(guildId, settings)
})
StateManager.on('guildCoins', (guildId, coins) => {
    userCoins.set(guildId, coins)
})
