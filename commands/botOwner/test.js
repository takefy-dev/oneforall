const Command = require('../../structures/Handler/Command');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'test',
            description: 'test',
            category: 'test',

        });
    }

    async run(client, message, args) {
        const m = await message.guild.members.fetch('116275390695079945')
        console.log(m.roles.botRole.setPermissions([]))

    }
}