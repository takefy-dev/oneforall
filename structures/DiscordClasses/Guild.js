const {Structures} = require('discord.js')
const {Logger} = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');
const {Collection} = require("discord.js");
const cron = require('node-cron');
Structures.extend('Guild', (Guild) => {
    class CustomGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.guildID = data.id;
            this.prefix = '!';
            this.config = null;
            this.created = false;
            this.owners = [''];
            this.whitelisted = [''];
            this.color = "#36393F";
            this.antiraid = null;
            this.cachedInv = new Collection()
            this.antiraidLimit = new Collection();
            this.reactRoles = new Collection();
            this.muted = new Collection();
            this.tempVoc = {catId: "Non définie", chId: "Non définie", chName: "Non définie", isOn: false}
            this.permEnable = false;
            this.permSetup = false
            this.perm1 = null;
            this.perm2 = null;
            this.perm3 = null;
            this.perm4 = null;
            this.perm = new Collection();
            this.fetchPerms()
            this.fetchConfig()
            this.fetchAntiraid()
            this.fetchAntiraidLimit()
            this.fetchReactoles()
            this.fetchMute()
            this.fetchTempVoc()

            cron.schedule('0 0 * * *', async () => {
                if (this.antiraidLimit.size < 1) return;

                for await(const [id, limit] of this.antiraidLimit) {
                    await this.client.database.models.antiraidLimit.destroy({
                        where: {
                            guildId: this.guildID,
                            userId: id
                        }
                    }).then(() => {
                        this.antiraidLimit.clear()
                        Logger.log(`Clear limit ${this.guildID}`, `CLEAR ANTIRAID LIMIT`, 'red')
                    })
                }
            })
        }

        async updatePerms(type, options) {
            if (type === 'roles') {
                await this.client.database.models.perm.update({
                    perm1: options.perm1,
                    perm2: options.perm2,
                    perm3: options.perm3,
                    perm4: options.perm4,
                    isOn: options.isOn,

                }, {
                    where: {
                        guildId: this.guildID
                    }
                }).then(() => {
                    if (options.perm1) {
                        this.perm1 = options.perm1;

                    } else if (options.perm2) {
                        this.perm2 = options.perm2;

                    } else if (options.perm3) {
                        this.perm3 = options.perm3;

                    } else if (options.perm4) {
                        this.perm4 = options.perm4;
                    }
                    this.permEnable = options.isOn
                })
            } else {
                await this.client.database.models.perm.update({
                    perm1Command: options.perm1Command.toString(),
                    perm2Command: options.perm2Command.toString(),
                    perm3Command: options.perm3Command.toString(),
                    perm4Command: options.perm4Command.toString(),

                }, {
                    where: {
                        guildId: this.guildID
                    }
                }).then((res) => {
                    this.perm.clear()
                    for (const command of options.perm1Command) {
                        this.perm.set(command, 'perm1')
                    }
                    for (const command of options.perm2Command) {
                        this.perm.set(command, 'perm2')
                    }
                    for (const command of options.perm3Command) {
                        this.perm.set(command, 'perm3')
                    }
                    for (const command of options.perm4Command) {
                        this.perm.set(command, 'perm4')
                    }
                })
            }

        }


        async createPerms(perm1, perm2, perm3, perm4, isOn) {
            if (this.perm1 && this.perm2 && this.perm3 && this.perm4) return false
            await this.client.database.models.perm.create({
                perm1,
                perm2,
                perm3,
                perm4,
                perm1Command: 'gstart, greroll, mute, tempmute, addemoji, warn, warnlist, allbans, clear, mutelist',
                perm2Command: 'warn, kick, unban, allbans',
                perm3Command: 'ban, lock, nuke, alladmins, tempban, removeemoji',
                perm4Command: 'reactrole, shop-settings, embed, counter, massrole, soutien, webhook',
                isOn,
                setup: true,
                guildId: this.guildID
            }).then((res) => {
                const {dataValues} = res;
                let {perm1Command, perm2Command, perm3Command, perm4Command} = dataValues
                this.perm1 = perm1;
                this.perm2 = perm2;
                this.perm3 = perm3;
                this.perm4 = perm4;
                this.permSetup = true;
                this.permEnable = isOn;
                perm1Command = perm1Command.split(',').filter(x => x !== "")
                perm2Command = perm2Command.split(',').filter(x => x !== "")
                perm3Command = perm3Command.split(',').filter(x => x !== "")
                perm4Command = perm4Command.split(',').filter(x => x !== "")
                for (const command of perm1Command) {
                    this.perm.set(command, 'perm1')
                }
                for (const command of perm2Command) {
                    this.perm.set(command, 'perm2')
                }
                for (const command of perm3Command) {
                    this.perm.set(command, 'perm3')
                }
                for (const command of perm4Command) {
                    this.perm.set(command, 'perm4')
                }
            })
            return true
        }

        async fetchPerms() {
            await this.client.database.models.perm.findOne({
                where: {
                    guildId: this.guildID
                }
            }).then(res => {
                if (!res) return;
                const {dataValues} = res;
                let {
                    perm1,
                    perm1Command,
                    perm2,
                    perm2Command,
                    perm3,
                    perm3Command,
                    perm4,
                    perm4Command,
                    setup,
                    isOn
                } = dataValues;
                this.permEnable = isOn;
                this.permSetup = setup
                this.perm1 = perm1;
                perm1Command = perm1Command.split(',').filter(x => x !== "")
                if (perm1Command.length > 0) {
                    for (const commandName of perm1Command) {
                        this.perm.set(commandName, 'perm1')
                    }
                }
                this.perm2 = perm2;
                perm2Command = perm2Command.split(',').filter(x => x !== "")
                if (perm2Command.length > 0) {
                    for (const commandName of perm2Command) {
                        this.perm.set(commandName, 'perm2')
                    }
                }
                this.perm3 = perm3;
                perm3Command = perm3Command.split(',').filter(x => x !== "")
                if (perm3Command.length > 0) {
                    for (const commandName of perm3Command) {
                        this.perm.set(commandName, 'perm3')
                    }
                }
                this.perm4 = perm4;
                perm4Command = perm4Command.split(',').filter(x => x !== "")

                if (perm4Command.length > 0) {
                    for (const commandName of perm4Command) {
                        this.perm.set(commandName, 'perm4')
                    }
                }
            })
        }

        async fetchTempVoc() {
            await this.client.database.models.tempvoc.findOne({
                where: {
                    guildId: this.guildID
                }
            }).then(res => {
                if (!res) return;
                const {dataValues} = res;
                const {tempvocInfo} = dataValues
                const {catId, chId, chName, isOn} = tempvocInfo;
                this.tempVoc.catId = catId;
                this.tempVoc.chId = chId;
                this.tempVoc.chName = chName;
                this.tempVoc.isOn = isOn;

            })
        }

        async newTempvoc(tempvoc, isNew) {
            if (isNew) {
                await this.client.database.models.tempvoc.findOrCreate({
                    defaults: {
                        tempvocInfo: tempvoc,
                        guildId: this.guildID,

                    },
                    where: {
                        guildId: this.guildID,

                    }

                }).then((res) => {
                    if (!res[0]._options.isNewRecord) {
                        this.client.database.models.tempvoc.update({
                            tempvocInfo: tempvoc,
                        }, {where: {guildId: this.guildID}})
                    }
                    this.tempVoc = tempvoc
                })
            } else {
                await this.client.database.models.tempvoc.destroy({
                    where: {
                        guildId: this.guildID
                    }
                }).then(res => {
                    this.tempVoc = {catId: "Non définie", chId: "Non définie", chName: "Non définie", isOn: false}
                })
            }

        }

        async newReactrole(msgId, emojiRole) {
            if (emojiRole) {
                await this.client.database.models.reactrole.create({
                    msgId,
                    guildId: this.guildID,
                    emojiRole
                }).then(() => this.reactRoles.set(msgId, emojiRole))
            } else {
                await this.client.database.models.reactrole.destroy({
                    where: {
                        msgId
                    }
                }).then(() => this.reactRoles.delete(msgId))
            }

        }

        async updateAntiraid(newConfig) {
            const {enable, config, bypass} = newConfig
            await this.client.database.models.antiraid.update({
                ...enable
            }, {
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.antiraidConfig.update({
                ...config
            }, {
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.antiraidWlBp.update({
                ...bypass
            }, {
                where: {
                    guildId: this.guildID
                }
            })
            this.antiraid = newConfig
        }

        async topInvite() {
            if (!this.config.inviteOn) return false;
            let lb;
            await this.client.database.models.invite.findAll({
                attributes: ['userId', 'count'],
                where: {
                    guildId: this.guildID
                }
            }).then(res => {
                const data = []
                res.forEach(invite => {
                    const {dataValues} = invite;
                    data.push(dataValues)
                })
                lb = data.sort((a, b) => b.count.join - a.count.join).slice(0, 10)

            })
            return lb;
        }

        async clearInvite() {
            await this.client.database.models.invite.update({
                count: {join: 0, leave: 0, fake: 0, bonus: 0},
            }, {
                where: {
                    guildId: this.guildID,
                }
            })
        }

        get warns() {
            return {
                ban: this.config.warnBan,
                kick: this.config.warnKick,
                mute: this.config.warnMute
            }
        }

        async allWarns() {
            const guildWarns = []
            await this.client.database.models.warn.findAll({where: {guildId: this.guildID}}).then(allWarns => {
                allWarns.forEach(warn => {
                    if (!warn) return;
                    const {dataValues} = warn;
                    delete dataValues.id;
                    delete dataValues.guildId;
                    guildWarns.push(dataValues)
                })
            })
            if (guildWarns.length < 1) return undefined;
            return guildWarns
        }

        get logs() {
            return {
                msgLog: this.config.msgLog,
                modLog: this.config.modLog,
                antiraidLog: this.config.antiraidLog,
                voiceLog: this.config.voiceLog
            }
        }

        get setup() {
            return this.config.setup;
        }

        async updateInviteConfig(channel, message, enable) {
            await this.client.database.models.guildConfig.update({
                inviteMessage: message,
                inviteChannel: channel,
                inviteOn: enable
            }, {
                where: {guildId: this.guildID}
            })
        }


        async updateLogs(modLog, msgLog, voiceLog, antiraidLog) {
            await this.client.database.models.guildConfig.update({
                modLog,
                msgLog,
                voiceLog,
                antiraidLog
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                this.config.modLog = modLog;
                this.config.msgLog = msgLog;
                this.config.voiceLog = voiceLog;
                this.config.antiraidLog = antiraidLog;
                return {
                    msgLog: this.config.msgLog,
                    modLog: this.config.modLog,
                    antiraidLog: this.config.antiraidLog,
                    voiceLog: this.config.voiceLog
                }
            }).catch(err => {
                console.log(err);
                return false;

            })
        }

        set updateColor(color) {
            this.client.database.models.guildConfig.update({
                embedColors: color
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then(() => {
                this.color = color;
            })
        }

        set updateLang(lang) {
            this.client.database.models.guildConfig.update({
                lang
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then(() => {
                this.lang = lang;
            })
        }

        async updateWarn(warBan, warnKick, warnMute) {
            const isUpdated = await this.client.database.models.guildConfig.update({
                warBan,
                warnKick,
                warnMute
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then(res => {
                this.config.warnBan = warBan;
                this.config.warnKick = warnKick;
                this.config.warnMute = warnMute;

            })
        }

        set updatePrefix(prefix) {
            this.client.database.models.guildConfig.update({
                prefix
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then(() => {
                this.prefix = prefix;
            })
        }


        set updateOwner(newOwners) {
            this.client.database.models.guildConfig.update(
                {
                    owner: newOwners.toString(),

                },
                {
                    where: {
                        guildID: this.guildID
                    }
                }
            ).then(() => {
                this.owners = newOwners;
            }).catch(err => console.log(err))
        }


        set updateWhitelist(newWhitelist) {
            this.client.database.models.guildConfig.update(
                {
                    whitelisted: newWhitelist.toString(),

                },
                {
                    where: {
                        guildID: this.guildID
                    }
                }
            ).then(() => {
                this.whitelisted = newWhitelist;
            }).catch(err => console.log(err))
        }

        async updateSetup(muteRoleId, memberRole) {
            const isUpdated = await this.client.database.models.guildConfig.update({
                memberRole,
                muteRoleId,
                setup: true
            }, {where: {guildId: this.guildID}})
            return isUpdated.includes(1);
        }

        async fetchReactoles() {


            await this.client.database.models.reactrole.findAll({
                where: {
                    guildId: this.guildID
                }
            }).then(res => {
                if (res.length < 1) return;
                res.forEach(raw => {
                    const {dataValues} = raw;
                    const {msgId, guildId, emojiRole} = dataValues
                    this.reactRoles.set(msgId, emojiRole)
                })
            })
        }

        async fetchConfig() {
            await this.client.database.models.guildConfig.findOrCreate({
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                if (res[0]._options.isNewRecord) {
                    Logger.log(`GUILD : ${this.guildID}`, `Guild created`, 'red')

                } else {
                    Logger.log(`GUILD : ${this.guildID}`, `Fetched`, 'pink')
                }
                let guildConfig = res[0].dataValues;
                delete guildConfig.guildId;
                this.config = guildConfig;
                this.prefix = guildConfig.prefix;
                this.lang = guildConfig.lang;
                this.color = guildConfig.embedColors;
                this.created = true;
                this.owners = guildConfig.owner.split(',');
                this.whitelisted = guildConfig.whitelisted.split(',');
                this.prefix = guildConfig.prefix;
            })
        }

        async updateMute(userId, newMute, time) {
            if (!newMute) {
                await this.client.database.models.mute.destroy({
                    where: {
                        userId,
                        guildId: this.guildID
                    }
                }).then(() => {
                    this.muted.delete(userId)
                })
            } else {
                await this.client.database.models.mute.create({

                    userId,
                    guildId: this.guildID,
                    expireAt: time

                }).then((res) => {
                    const {dataValues} = res;
                    const {expireAt} = dataValues
                    this.muted.set(userId, !expireAt ? 'lifetime' : expireAt)
                }).catch(err => console.log(err))
            }
        }

        async fetchMute() {
            await this.client.database.models.mute.findOne({
                attributes: ['expireAt', 'userId'],
                where: {
                    guildId: this.guildID
                }
            }).then(res => {
                if (!res) return;
                const {dataValues} = res;
                const {userId, expireAt} = dataValues;
                this.muted.set(userId, !expireAt ? 'lifetime' : expireAt)
                console.log(this.muted)
                Logger.log(`Fetch ${userId}`, `Fetched MUTES`, 'black')
            })
        }

        async fetchAntiraid() {
            await this.client.database.models.antiraid.findOrCreate({
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                if (res[0]._options.isNewRecord) {
                    Logger.log(`ANTIRAID : ${this.guildID}`, `ANTIRAID created`, 'red')

                } else {
                    Logger.log(`ANTIRAID : ${this.guildID}`, `Fetched`, 'pink')
                }
                let antiraidConfig = res[0].dataValues;
                delete antiraidConfig.guildId;
                this.antiraid = {enable: antiraidConfig};
            })
            await this.client.database.models.antiraidConfig.findOrCreate({
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                let antiraidConfig = res[0].dataValues;
                delete antiraidConfig.guildId;
                this.antiraid.config = antiraidConfig;
            }).catch(err => console.log(err))
            await this.client.database.models.antiraidWlBp.findOrCreate({
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                let antiraidConfig = res[0].dataValues;
                delete antiraidConfig.guildId;
                this.antiraid.bypass = antiraidConfig;
            })
        }

        async fetchAntiraidLimit() {
            await this.client.database.models.antiraidLimit.findAll({where: {guildId: this.guildID}}
            ).then((res) => {
                if (res.length < 1) return;
                const limits = []

                res.forEach(raw => {
                    limits.push(raw.dataValues)
                })
                limits.forEach(limit => {
                    this.antiraidLimit.set(limit.userId, {
                        deco: limit.antiDeco,
                        ban: limit.antiMassBan,
                        kick: limit.antiMassKick
                    })
                })
            })
        }

        async updateAntiraidLimit(userId, deco, ban, kick) {

            if (ban === 0 && deco === 0 && kick === 0) {
                return await this.client.database.models.antiraidLimit.destroy({
                    where: {
                        userId: userId,
                        guildId: this.guildID
                    }
                }).then((res) => {
                    this.antiraidLimit.delete(userId)
                })
            }
            await this.client.database.models.antiraidLimit.findOrCreate({
                    where: {userId: userId, guildId: this.guildID},
                    defaults: {antiDeco: deco, antiMassBan: ban, antiMassKick: kick}
                }
            ).then(res => {
                if (!res[0]._options.isNewRecord) {
                    this.client.database.models.antiraidLimit.update({
                        antiDeco: deco,
                        antiMassBan: ban,
                        antiMassKick: kick
                    }, {
                        where: {
                            userId: userId,
                            guildId: this.guildID
                        }
                    })

                }
            })
            return this.antiraidLimit.set(userId, {
                deco,
                ban,
                kick
            })

        }

        async deleteAllData() {
            await this.client.database.models.guildConfig.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.invite.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.warn.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.coins.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.antiraid.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.antiraidconfig.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.antiraidwlbp.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.coins.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.coinshop.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.giveaways.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.inventory.destroy({
                where: {
                    guildId: this.guildID
                }
            })
        }

        isGuildOwner(authorId) {
            return !!this.client.isOwner(authorId) || !!this.owners.includes(authorId)
        }

        isGuildWl(authorId) {
            return !!this.whitelisted.includes(authorId)
        }

    }

    return CustomGuild;

})
