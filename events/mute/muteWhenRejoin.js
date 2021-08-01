module.exports = {
    name: 'guildMemberAdd',
    run: async (client, member) => {
        const {userManager, guildManager} = client.managers;
        const guild = member.guild;
        const userData = userManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`);
        const guildData = guildManager.getAndCreateIfNotExists(guild.id);
        const mute = userData.get('mute')
        const muteRoleId = guildData.get('muteRoleId')
        if (mute.muted) {
            const role = guild.roles.cache.get(muteRoleId);
            if (role && !role.deleted) {
                await member.roles.add(role, `Mute when leave guild`)
            }
        }

    }
}