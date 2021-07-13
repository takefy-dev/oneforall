const Event = require('../../structures/Handler/Event');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'guildMemberRemove',
        });
    }
    async run(client, member){
        const {guild} = member;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const guildInv = await guild.fetchInvites()
        for(const [code, invite] of guildInv){
            guildData.cachedInv.set(code, invite)
        }
        if(guild.vanityURLCode) guildData.cachedInv.set(guild.vanityURLCode, await guild.fetchVanityData());
        const userData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`)
        const invite = userData.get('invite');
        if(!invite.invitedBy || member.user.bot) return;
        const invitedByData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`);
        let count = invitedByData.get('invite');
        count.leave += 1
        invitedByData.set('invite', count)

    }
}