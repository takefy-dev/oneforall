const
    {Guild} = require('./guild'),
    {User} = require('./user')

class Managers {
    constructor(oneforall) {
        this.guildManager = new Guild(oneforall).initTable();
        this.userManager = new User(oneforall).initTable();

    }
}

exports.Managers = Managers;