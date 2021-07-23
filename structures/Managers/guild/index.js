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
            whitelisted: values.whitelisted ? values.whitelisted : [],
            owners: values.owners ? values.owners : this.guildManager.OneForAll.botperso ? [] : [this.guildManager.OneForAll.guilds.cache.get(values.guildId).ownerID],
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
                        antiToken : false,
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
                        antiDc: 'kick',
                        antiDcLimit: '1d',
                        regionUpdate: 'unrank',
                        nameUpdate: 'unrank',
                        vanityUpdate: 'unrank',
                        antiToken : 'kick',
                        antiTokenLimit: '10/10s',
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
                        antiToken: false,
                    }
                },
            color: values.color ? values.color : "#36393F",
            setup: values.setup ? values.setup : false,
            muteRoleId: values.muteRoleId ? values.muteRoleId : null,
            memberRole: values.memberRole ? values.memberRole : null,
            invite: values.invite ? values.invite : {id: 'Non définie', message: 'Non définie', enable: false},
            soutien: values.soutien ? values.soutien : {
                roleId: 'Non définie',
                message: 'Non définie',
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
                    perm1: ['clear', 'warn', 'unwarn', 'warnlist', 'warnsettings', 'mute', 'mutelist', 'tempmute', 'unmute', 'addemoji', 'rmemoji'],
                    perm2: ['ban', 'kick', 'lockchannel', 'unban', 'clear', 'alladmin', 'allbot', 'banlist'],
                    perm3: ['derank', 'nuke', 'say', 'soutien', 'gcreate', 'greroll', 'voicekick', 'glist', 'gend'],
                    perm4: ['cleanup', 'piconly', 'reaction', 'addinvite', 'clearinvite', 'removeinvite', 'compteur', 'embedBuilder', 'massiverole', 'reactionRoleMenu', 'role', 'tempvoc', 'setcolor', 'webhook']
                },
                enable: false
            },
            reactroles: values.reactroles ? values.reactroles : [],
            piconly : values.piconly ? values.piconly : [],
            coinsSettings : values.coinsSettings ? values.coinsSettings :  {
                enable: false,
                streamBoost: 1.5,
                muteDiviseur: 0.5,
                logs: 'Non définie'
            },
            coinsShop : values.coinsShop ? values.coinsShop : [{id: 0, item: this.lang.addShop.nothingInShop, price: undefined, role: undefined}],
            reactionsToMessages : values.reactionsToMessages ? values.reactionsToMessages : [],
        }
        this.cachedInv = new Collection()
        this.snipes = new Collection()

    }

    get(key) {
        return this.values[key]
    }

    set(key, value) {
        this.values[key] = value;
        return this
    }

    get lang() {
        return require(`../../../lang/${this.values ? this.values.lang : 'fr'}`)
    }

    deleteGuild() {
        this.guildManager.OneForAll.database.models[this.guildManager.modelName].destroy({where: this.where}).then(() => {
            this.guildManager.deleteGuild(this.where.guildId)
        }).catch(console.log);
    }

    isGuildOwner(id) {
        return !!this.values.owners.includes(id) || !!this.guildManager.OneForAll.isOwner(id);
    }

    isGuildWl(id) {
        return !!this.values.whitelisted.includes(id) || !!this.guildManager.OneForAll.isOwner(id);
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
