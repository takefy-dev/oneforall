const
    {Guild} = require('./guild'),
    {User} = require('./user'),
    {Blacklist} = require('./blacklist'),
    {Backup} = require('./backup'),
    {Voice} = require('./voices')

class Managers {
    constructor(oneforall) {
        this.guildManager = new Guild(oneforall).initTable();
        this.userManager = new User(oneforall).initTable();
        this.blackListManager = new Blacklist(oneforall).initTable();
        this.backupManager = new Backup(oneforall).initTable();

        this.voiceManager = new Voice(oneforall);
    }
}

exports.Managers = Managers;