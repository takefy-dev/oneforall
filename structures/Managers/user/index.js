const {Collection} = require('discord.js');

class User extends Collection {

    constructor(OneForAll) {
        super();
        this.OneForAll = OneForAll;
        this.modelName = "users";
    }

    addUser(key, values = {}) {
        const guildId = key.split('-')[0].toString()
        const userId = key.split('-')[1].toString()
        return this.set(key, new UserManager(this, {guildId, userId,...values})).get(key);
    }

    getAndCreateIfNotExists(key, values = {}) {
        return this.has(key) ? this.get(key) : this.addUser(key, values);
    }


    getUser(key) {
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
            key: ["{guildId}", "-", "{userId}"],
            add: 'addUser'
        });
    }
}

class UserManager {
    constructor(userManager, values = {}) {
        this.userManager = userManager;
        this.where = {
            guildId: values.guildId,
            userId: values.userId
        }
        this.values = {
            ...this.where,
            invite : values.invite ? values.invite : {join:0, leave:0, fake:0, bonus:0, invitedBy: null},
            antiraidLimit: values.antiraidLimit ? values.antiraidLimit : {ban:0, kick:0, deco:0},
            mute: values.mute ? values.mute : {muted: false, createdAt: null, expireAt: null},
            warns : values.warns ? values.warns : []
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
        this.userManager.OneForAll.functions.updateOrCreate(this.userManager.OneForAll.database.models[this.userManager.modelName], this.where, this.values).then(() => {
        }).catch((e) => {
            console.log(e)
        });
        return this;
    }
}

exports.User = User;