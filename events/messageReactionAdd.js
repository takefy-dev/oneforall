const StateManager = require('../utils/StateManager');
const emojiRoleMapping = new Map();

// let all = new Map();
const { Event } = require('advanced-command-handler');
module.exports = new Event(
    {
        name: 'messageReactionAdd',
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
                // console.log(role.name)
            }else if(reaction.emoji.id != null && emojiRoleArray.hasOwnProperty(reaction.emoji.id)){
                role = reaction.message.guild.roles.cache.get(emojiRoleArray[reaction.emoji.id])
                // console.log(role.name)
            }else{
                return;
            }
            let member = reaction.message.guild.members.cache.get(user.id);
            if(role && member){
                member.roles.add(role, 'Reaction role add')
                // console.log("dd")

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
