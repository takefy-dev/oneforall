const Event = require('../structures/Handler/Event');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildMemberRemove',
        });
    }
    async run(client, member){
        const { guild } = member
        const newInv = await guild.fetchInvites()
        for(const [code, invite] of newInv){
            guild.cachedInv.set(code, invite)
        }
        if(!member.inviter || member.user.bot) return;
        const invitedBy = member.guild.members.cache.get(member.inviter)
        let count = invitedBy.invite;
        count.leave += 1
        invitedBy.updateInvite = count;



    }
}