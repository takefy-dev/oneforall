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
        const emojiRoleMapping = reaction.message.guild.reactRoles
        return
        if (user.bot) return;
        if(emojiRoleMapping.size < 1) return

        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        // const guild = client.guilds.cache.get(reaction.message.guild.id)

        if (emojiRoleMapping.has(reaction.message.id)) {
            const emojiRoleArray = emojiRoleMapping.get(reaction.message.id);
            let role;
            if (reaction.emoji.id == null && emojiRoleArray.hasOwnProperty(reaction.emoji.name)) {
                role = reaction.message.guild.roles.cache.get(emojiRoleArray[reaction.emoji.name])
            } else if (reaction.emoji.id != null && emojiRoleArray.hasOwnProperty(reaction.emoji.id)) {
                role = reaction.message.guild.roles.cache.get(emojiRoleArray[reaction.emoji.id])
            } else {
                return;
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
