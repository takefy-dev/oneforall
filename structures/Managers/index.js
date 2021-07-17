const
    {Guild} = require('./guild'),
    {User} = require('./user'),
    {Blacklist} = require('./blacklist'),
    {Backup} = require('./backup')

class Managers {
    constructor(oneforall) {
        this.guildManager = new Guild(oneforall).initTable();
        this.userManager = new User(oneforall).initTable();
        this.blackListManager = new Blacklist(oneforall).initTable()
        this.backupManager = new Backup(oneforall).initTable()

    }
}

exports.Managers = Managers;