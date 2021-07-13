const {Collection} = require('discord.js');

class Guild extends Collection {

    constructor(OneForAll) {
        super();
        this.OneForAll = OneForAll;
        this.modelName = "guilds";
    }

    addGuild(key, values = {}) {
        return this.set(key, new GuildManager(this, {guildId: key, ...values})).get(key)
    }

    getAndCreateIfNotExists(key, values = {}) {
        return this.has(key) ? this.get(key) : this.addGuild(key, values);
    }

    deleteGuild(key) {
        return this.delete(key);
    }

    getGuild(key) {
        return this.get(key);
    }

    initTable() {
        require(`./model`)(this.OneForAll.database, this.OneForAll.DataTypes, this.modelName, this.OneForAll.config);
        this.loadTable();
        return this;
    }

    loadTable() {
        return this.OneForAll.functions.loadTable(this, {
            model: this.modelName,
            key: ["{guildId}"],
            add: 'addGuild'
        })


    }
}

class GuildManager {
    constructor(guildManager, values = {}) {
        this.guildManager = guildManager;
        this.where = {
            guildId: values.guildId
        }
        this.values = {
            ...this.where,
            prefix: values.prefix ? values.prefix : '!',
            lang: values.lang ? values.lang : 'fr',
            whitelist: values.whitelisted ? values.whitelisted : [],
            owners: values.owners ? values.owners : [],
            antiraid: values.antiraid ? values.antiraid :
                {
                    enable: {
                        webhookUpdate: false,
                        roleCreate: false,
                        roleUpdate: false,
                        roleDelete: false,
                        channelCreate: false,
                        channelUpdate: false,
                        channelDelete: false,
                        antiSpam: false,
                        antiMassBan: false,
                        antiBot: false,
                        roleAdd: false,
                        antiLink: false,
                        antiDeco: false,
                        antiKick: false,
                        antiDc: false,
                        regionUpdate: false,
                        nameUpdate: false,
                        vanityUpdate: false,
                    },
                    config: {
                        webhookUpdate: 'unrank',
                        roleCreate: 'unrank',
                        roleUpdate: 'unrank',
                        roleDelete: 'unrank',
                        channelCreate: 'unrank',
                        channelUpdate: 'unrank',
                        channelDelete: 'unrank',
                        antiSpam: 'unrank',
                        antiMassBan: 'unrank',
                        antiMassBanLimit: 3,
                        antiBot: 'unrank',
                        roleAdd: 'unrank',
                        antiLink: 'unrank',
                        antiDeco: 'unrank',
                        antiDecoLimit: 5,
                        antiKick: 'unrank',
                        antiKickLimit: 5,
                        antiDc: 'unrank',
                        antiDcLimit: '1d',
                        regionUpdate: 'unrank',
                        nameUpdate: 'unrank',
                        vanityUpdate: 'unrank',
                    },
                    bypass: {
                        webhookUpdate: false,
                        roleCreate: false,
                        roleUpdate: false,
                        roleDelete: false,
                        channelCreate: false,
                        channelUpdate: false,
                        channelDelete: false,
                        antiSpam: false,
                        antiMassBan: false,
                        antiBot: false,
                        roleAdd: false,
                        antiLink: false,
                        antiDeco: false,
                        antiKick: false,
                        antiDc: false,
                        regionUpdate: false,
                        nameUpdate: false,
                        vanityUpdate: false,
                    }
                },
            color: values.embedColors ? values.embedColors : "#36393F",
            setup: values.setup ? values.setup : false,
            muteRoleId: values.muteRoleId ? values.muteRoleId : null,
            memberRole: values.memberRole ? values.memberRole : null,
            invite: values.invite ? values.invite : {id: null, message: null, enable: false},
            soutien: values.soutien ? values.soutien : {
                roleId: null,
                message: null,
                enable: false
            },
            logs: values.logs ? values.logs : {
                mod: 'Non définie',
                voice: 'Non définie',
                message: 'Non définie',
                antiraid: 'Non définie'
            },
            counter: values.counter ? values.counter : {
                member: {name: 'Non définie'},
                voice: {name: 'Non définie'},
                online: {name: 'Non définie'},
                offline: {name: 'Non définie'},
                bot: {name: 'Non définie'},
                channel: {name: 'Non définie'},
                role: {name: 'Non définie'},
                booster: {name: 'Non définie'},
            },
            warns: values.warns ? values.warns : {
                settings: {
                    ban: 4,
                    kick: 3,
                    mute: 2,
                },
                data: []
            },
            tempvoc: values.tempvoc ? values.tempvoc : [{
                category: 'Non définie',
                channel: 'Non définie',
                name: 'Non définie'
            }],
            perms: values.perms ? values.perms : {
                role: {
                    perm1: [],
                    perm2: [],
                    perm3: [],
                    perm4: []
                },
                commands: {
                    perm1: [],
                    perm2: [],
                    perm3: [],
                    perm4: []
                },
                enable: false
            },
            reactroles: values.reactroles ? values.reactroles : [
                {
                    message: null,
                    emojiRole: []
                }
            ]
        }


    }

    get(key) {
        return this.values[key]
    }

    set(key, value) {
        this.values[key] = value;
        return this
    }

    get lang() {
        return require(`../../../lang/${this.values.lang}`)
    }

    deleteGuild() {
        this.guildManager.OneForAll.database.models[this.guildManager.modelName].destroy({where: this.where}).then(() => {
            this.guildManager.deleteGuild(this.where.guildId)
        }).catch(console.log);
    }

    isGuildOwner(id) {
        return !!this.values.owners.includes(id);
    }

    isWhitelisted(id) {
        return !!this.values.whitelist.includes(id);
    }

    async save() {

        this.guildManager.OneForAll.functions.updateOrCreate(this.guildManager.OneForAll.database.models[this.guildManager.modelName], this.where, this.values).then(() => {
        }).catch((e) => {
            console.log(e)
        });
        return this;
    }
}

exports
    .Guild = Guild;