const
    {Guild} = require('./guild'),
    {User} = require('./user'),
    {Blacklist} = require('./blacklist')

class Managers {
    constructor(oneforall) {
        this.guildManager = new Guild(oneforall).initTable();
        this.userManager = new User(oneforall).initTable();
        this.blackListManager = new Blacklist(oneforall).initTable()

    }
}

exports.Managers = Managers;