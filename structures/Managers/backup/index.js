const {Collection} = require('discord.js');

class Backup extends Collection {

    constructor(OneForAll) {
        super();
        this.OneForAll = OneForAll;
        this.modelName = "backup";
    }

    addBackup(key, values = {}) {
        return this.set(key, new BackupManager(this, {userId: key,...values})).get(key);
    }

    getAndCreateIfNotExists(key, values = {}) {
        return this.has(key) ? this.get(key) : this.addBackup(key, values);
    }


    getBackup(key) {
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
            add: 'addBackup'
        });
    }
}

class BackupManager {
    constructor(backupManager, values = {}) {
        this.backupManager = backupManager;
        this.where = {
            userId: values.userId
        }
        this.values = {
            ...this.where,
            backup : values.backup ? values.backup : [],
            backupEmbed : values.backupEmbed ? values.backupEmbed : [],
            backupRoles : values.backupRoles ? values.backupRoles : []
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
        this.backupManager.OneForAll.functions.updateOrCreate(this.backupManager.OneForAll.database.models[this.backupManager.modelName], this.where, this.values).then(() => {
        }).catch((e) => {
            console.log(e)
        });
        return this;
    }
}

exports.Backup = Backup;