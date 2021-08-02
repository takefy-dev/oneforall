module.exports = {

    name: 'presenceUpdate',

    run: async (client, oldMember, newMember) => {
        if (!client.botperso) return;
        client.guilds.cache.filter(g => client.managers.guildManager.getAndCreateIfNotExists(g.id).get('soutien').enable).forEach(guild => {
            if (!oldMember || !newMember) return;
            if(oldMember.status !== newMember.status) return
            const {message, roleId} = client.managers.guildManager.getAndCreateIfNotExists(guild.id).get('soutien');
            const role = guild.roles.cache.get(roleId)
            if (!role || role.deleted) return;
            let status = newMember.activities.map(a => a.state)
            const member = guild.members.cache.get(newMember.user.id);
            if (!member) return;
            if (status[0] && status[0].includes(message)) {
                member.roles.add(roleId, 'Soutien')
            } else {
                if (member.roles.cache.some((r) => r.id === roleId)) {
                    member.roles.remove(roleId, 'Soutien')
                }
            }

        });
    }
}






