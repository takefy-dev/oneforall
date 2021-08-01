
const Event = require('../../structures/Handler/Event');

module.exports = class inviteCreate extends Event {
    constructor() {
        super({
            name: 'inviteCreate',
        });
    }

    async run(client, invite) {
        const guild = invite.guild;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const guildInv = await guild.invites.fetch()
        for(const [code, invite] of guildInv){
            guildData.cachedInv.set(code, invite)
        }
        if(guild.vanityURLCode) guildData.cachedInv.set(guild.vanityURLCode, await guild.fetchVanityData());
    }
};
