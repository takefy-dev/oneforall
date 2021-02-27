const StateManager = require('../utils/StateManager');
const emojiRoleMapping = new Map();

// let all = new Map();
const { Event } = require('advanced-command-handler');
module.exports = new Event(
    {
        name: 'messageReactionRemove',
    },
    module.exports = async (handler, reaction, user) => {
        this.connection = StateManager.connection;
        if (user.bot) return;
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        // const guild = handler.client.guilds.cache.get(reaction.message.guild.id)
        if(emojiRoleMapping.has(reaction.message.id)){
            const emojiRoleArray = emojiRoleMapping.get(reaction.message.id);
            let role;
            if(reaction.emoji.id == null && emojiRoleArray.hasOwnProperty(reaction.emoji.name)){
                role = reaction.message.guild.roles.cache.get(emojiRoleArray[reaction.emoji.name])
            }else if(reaction.emoji.id != null && emojiRoleArray.hasOwnProperty(reaction.emoji.id)){
                role = reaction.message.guild.roles.cache.get(emojiRoleArray[reaction.emoji.id])
            }else{
                return;
            }
            let member = reaction.message.guild.members.cache.get(user.id);
            if(role && member){
                member.roles.remove(role, 'Reaction role remove')

            }

        }
        


        // }



    }
)


StateManager.on('reactionRoleUp', (msgID, emojiRole) => {
    emojiRoleMapping.set(msgID, emojiRole)
})
StateManager.on('reactionRoleFetched', (msgID, emojiRole) => {
    emojiRoleMapping.set(msgID, emojiRole)
})
