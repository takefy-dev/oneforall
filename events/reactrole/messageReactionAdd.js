const StateManager = require('../../utils/StateManager');

// let all = new Map();
const Event = require('../../structures/Handler/Event');
module.exports = class messageReactionAdd extends Event {
    constructor() {
        super({
            name: 'messageReactionAdd',
        });
    }

    async run(client, reaction, user) {
        const emojiRoleMapping = reaction.message.guild.reactRoles
        if (user.bot) return;
        if (emojiRoleMapping.size < 1) return

        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        // const guild = client.guilds.cache.get(reaction.message.guild.id)
        if (emojiRoleMapping.has(reaction.message.id)) {
            const emojiRoleArray = emojiRoleMapping.get(reaction.message.id);
            let role;
            if (reaction.emoji.id == null && emojiRoleArray.hasOwnProperty(reaction.emoji.name)) {
                role = reaction.message.guild.roles.cache.get(emojiRoleArray[reaction.emoji.name])
                // console.log(role.name)
            } else if (reaction.emoji.id != null && emojiRoleArray.hasOwnProperty(reaction.emoji.id)) {
                role = reaction.message.guild.roles.cache.get(emojiRoleArray[reaction.emoji.id])
                // console.log(role.name)
            } else {
                return
            }
            let member = reaction.message.guild.members.cache.get(user.id);
            if (role && member) {
                await member.roles.add(role, 'Reaction role add')
                // console.log("dd")

            }

        }


        // }


    }
}

