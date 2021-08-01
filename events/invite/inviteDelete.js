module.exports = {
    name: 'inviteDelete',
    run: async (client, invite) => {
        const {guild} = invite;
        const guildData =await client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const guildInv = await guild.invites.fetch()
        for(const [code, invite] of guildInv){
            guildData.cachedInv.set(code, invite)
        }
        if(guild.vanityURLCode) guildData.cachedInv.set(guild.vanityURLCode, await guild.fetchVanityData());

    }
};
