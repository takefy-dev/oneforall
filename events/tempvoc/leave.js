

module.exports = {
    name: 'voiceChannelLeave',
    run: async (client, member, channel) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(member.guild.id);
        const tempVoc = guildData.get('tempvoc');
        const { channelId, categoryId, enable } = tempVoc;
        if(!enable) return;
        if(channel.parentId
 !== categoryId) return
        if(channel.id === channelId) return
        if(!channel.members.size){
            channel.delete({reason: `Personne dans le salon`})
        }
    }
}