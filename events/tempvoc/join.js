module.exports = {
    name: 'voiceChannelJoin',

    run: async (client, member, channel) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(member.guild.id);
        const tempVoc = guildData.get('tempvoc');
        const {channelName, channelId, categoryId, enable} = tempVoc;
        if (!enable) return;
        if (channel.parentId
            !== categoryId) return
        const chName = `${channelName.replace(/{username}/g, member.user.username)}`
        if (channel.id === channelId) {
            member.guild.channels.create(chName, {
                type: 'voice',
                parent: categoryId,
                reason: `Vocal temporaire`
            }).then(c => {
                c.createOverwrite(member, {
                    MANAGE_CHANNELS: true,
                    MANAGE_ROLES: true,
                });
                // Move user to ch
                member.voice.setChannel(c)
            })
        }
    }
}