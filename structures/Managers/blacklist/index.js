const {Collection} = require('discord.js');

class Blacklist extends Collection {

    constructor(OneForAll) {
        super();
        this.OneForAll = OneForAll;
        this.modelName = "blacklist";
    }

    addBlacklist(key, values = {}) {

        return this.set(key, new BlacklistManager(this, {userId: key,...values})).get(key);
    }

    getAndCreateIfNotExists(key, values = {}) {
        return this.has(key) ? this.get(key) : this.addBlacklist(key, values);
    }


    getBlacklist(key) {
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
            key: ["{userId}"],
            add: 'addBlacklist'
        });
    }
}

class BlacklistManager {
    constructor(blacklistManager, values = {}) {
        this.blacklistManager = blacklistManager;
        this.where = {
            userId: values.userId
        }
        this.values = {
            ...this.where,
            enable: values.enable ? values.enable : false,
            blacklisted : values.blacklisted ? values.blacklisted : []
        }

    }

    get(key) {
        return this.values[key]
    }

    set(key, value) {
        this.values[key] = value;
        return this
    }

    async save() {
        this.blacklistManager.OneForAll.functions.updateOrCreate(this.blacklistManager.OneForAll.database.models[this.blacklistManager.modelName], this.where, this.values).then(() => {
        }).catch((e) => {
            console.log(e)
        });
        return this;
    }
}

exports.Blacklist = Blacklist;