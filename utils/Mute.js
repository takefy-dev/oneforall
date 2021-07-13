const moment = require('moment')

module.exports = {
    async startChecking(client) {
        setInterval(async () => {
            const muted = client.managers.userManager.filter(m => m.values.mute.muted);
            if (muted < 1) return
            for await(const [key, mute] of muted) {
                const now = moment().utc().format()
                if (mute.values.mute.expireAt === "lifetime") return;
                let expireAt = moment.utc(mute.values.mute.expireAt).format()
                if (now > expireAt) {
                    const mutes = mute.values.mute
                    mutes.muted = false;
                    mutes.expireAt = null;
                    mutes.createdAt = null;
                    const userData = client.managers.userManager.getAndCreateIfNotExists(key);
                    userData.set('mute', mutes).save().then(() => {
                        const guild = client.guilds.cache.get(mute.values.guildId)
                        const guildData = client.managers.guildManager.getAndCreateIfNotExists(mute.values.guildId)
                        const member = guild.members.cache.get(mute.values.userId);
                        if (!member) return;
                        const muteRole = guild.roles.cache.get(guildData.get('muteRoleId'))
                        if (!muteRole) return;
                        if (member.roles.cache.has(muteRole.id)) member.roles.remove(muteRole, `Auto unmute `)
                        const {logs} = guildData.lang
                        const {modLog} = guildData.get('logs').mod;
                        const channel = guild.channels.cache.get(modLog);
                        if (channel && !channel.deleted) {
                            channel.send(logs.unmute(member.user, moment(expireAt).tz("Paris").format("DD/MM/YYYY HH:mm:ss"), guildData.get('color')))
                        }
                    })

                }

            }
        }, 1000)
    }
}