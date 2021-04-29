const moment = require('moment')

module.exports = {
    async startChecking(client) {
        setInterval(async () => {
            const allMutedGuild = client.guilds.cache.filter(guild => guild.muted.size !== 0);
            for await(const [id, guild] of allMutedGuild){
                const { muted } = guild;
                const now = moment().utc().format()
                for await(let [id, expireAt] of muted){
                    if(expireAt === "lifetime") return;
                    expireAt = moment.utc(expireAt).format()
                    if(now > expireAt){
                        await guild.updateMute(id).then(() => {
                            const member = guild.members.cache.get(id);
                            if(!member) return;
                            const muteRole = guild.roles.cache.get(guild.config.muteRoleId)
                            if(!muteRole) return;
                            if(member.roles.cache.has(muteRole.id)) member.roles.remove(muteRole, `Auto unmute `)
                            const channel = guild.channels.cache.get(guild.logs.modLog);
                            if(channel && !channel.deleted) return channel.send(`${member} a été unmute`)
                        })
                    }
                }

            }
        }, 5000)
    }
}