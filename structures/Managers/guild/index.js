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
            antiraid: values.antiraid ? Object.assign(this.guildManager.OneForAll.config.defaultAntiraidConfig,values.antiraid) : this.guildManager.OneForAll.config.defaultAntiraidConfig,
            antiraidLimits: values.antiraidLimits ? values.antiraidLimits : {
                antiToken: {recentJoined : [], counter: 0}
            },
            color: values.color ? values.color : "#36393F",
            setup: values.setup ? values.setup : false,
            muteRoleId: values.muteRoleId ? values.muteRoleId : null,
            memberRole: values.memberRole ? values.memberRole : null,
            invite: values.invite ? Object.assign( {id: 'Non définie', message: 'Non définie', enable: false, inviteRole: [], cumulRoles: true},{...values.invite, maxRoleInvite: values.invite.inviteRole.sort((a, b) => b.invite - a.invite)[0]}) : {id: 'Non définie', message: 'Non définie', enable: false, inviteRole: [], cumulRoles: true},
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
            tempvoc: values.tempvoc ? values.tempvoc : {
                categoryId: 'Non définie',
                channelId: 'Non définie',
                channelName: 'Non définie',
                name: 'Non définie',
                enable: false,
            },
            perms: values.perms ? Object.assign(this.guildManager.OneForAll.config.defaultPermSetup,values.perms) : this.guildManager.OneForAll.config.defaultPermSetup,
            reactroles: values.reactroles ? values.reactroles : [],
            piconly: values.piconly ? values.piconly : [],
            coinsSettings: values.coinsSettings ? values.coinsSettings : {
                enable: false,
                streamBoost: 1.5,
                muteDiviseur: 0.5,
                logs: 'Non définie'
            },
            coinsShop: values.coinsShop ? values.coinsShop : [{
                id: 0,
                item: this.lang.addShop.nothingInShop,
                price: undefined,
                role: undefined
            }],
            reactionsToMessages: values.reactionsToMessages ? values.reactionsToMessages : [],
            level : values.level ? {...values.level, maxRoleLvl: values.level.roleLevel.sort((a, b) => b.level - a.level)[0]} : { roleLevel: [], lvlMessage: {message : 'Non définie', channel: 'Non définie'}, cumulRoles: false, maxRoleLvl: undefined},
            xp : values.xp ? values.xp : {xpPerMsg:'1-30', xpPerSVoc: "1-20", enable: false, allowChannels: ['all'], forbidChannels: [], multiplerChannels: []},
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
