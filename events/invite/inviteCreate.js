
const Event = require('../../structures/Handler/Event');

module.exports = class inviteCreate extends Event {
    constructor() {
        super({
            name: 'inviteCreate',
        });
    }

    async run(client, invite) {
        const guild = invite.guild;
        const guildInv = await guild.fetchInvites()
        for(const [code, invite] of guildInv){
            guild.cachedInv.set(code, invite)
        }
        if(guild.vanityURLCode) guild.cachedInv.set(guild.vanityURLCode, await guild.fetchVanityData());
    }
};
