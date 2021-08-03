

module.exports = {

    name: 'guildMemberRemove',
    run: async (client, member) =>{
        const {guild} = member;
        const guildData =await client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const guildInv = await guild.invites.fetch()
        for(const [code, invite] of guildInv){
            guildData.cachedInv.set(code, invite.uses)
        }
        if(guild.vanityURLCode) guildData.cachedInv.set(guild.vanityURLCode, await guild.fetchVanityData());
        const userData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`)
        const invite = userData.get('invite');
        if(!invite.invitedBy || member.user.bot) return;
        const invitedByData = client.managers.userManager.getAndCreateIfNotExists(`${guild.id}-${invite.invitedBy}`);
        let count = invitedByData.get('invite');
        count.leave += 1
        invitedByData.set('invite', count)

    }
}