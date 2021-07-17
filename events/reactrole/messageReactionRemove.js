const StateManager = require('../../utils/StateManager');
const emojiRoleMapping = new Map();

// let all = new Map();
const Event = require('../../structures/Handler/Event');

module.exports = class messageReactionRemove extends Event {
    constructor() {
        super({
            name: 'messageReactionRemove',
        });
    }

    async run(client, reaction, user) {
        if (user.bot) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(reaction.message.guild.id);
        const reactRoles =  guildData.get('reactroles');
        if (reactRoles.length < 1) return
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        const reactRole = reactRoles.find(reactRole => reactRole.message === reaction.message.id);
        if (reactRole) {
            const {emojiRoleMapping} = reactRole;
            let role;
            if (reaction.emoji.name && emojiRoleMapping.hasOwnProperty(reaction.emoji.name)) {
                role = reaction.message.guild.roles.cache.get(emojiRoleMapping[reaction.emoji.name])
            } else if (reaction.emoji.id && emojiRoleMapping.hasOwnProperty(reaction.emoji.id)) {
                role = reaction.message.guild.roles.cache.get(emojiRoleMapping[reaction.emoji.id])
            } else {
                return
            }
            let member = reaction.message.guild.members.cache.get(user.id);
            if (role && member) {
                await member.roles.remove(role, 'Reaction role remove')

            }

        }



        // }


    }
}


StateManager.on('reactionRoleUp', (msgID, emojiRole) => {
    emojiRoleMapping.set(msgID, emojiRole)
})
StateManager.on('reactionRoleFetched', (msgID, emojiRole) => {
    emojiRoleMapping.set(msgID, emojiRole)
})
