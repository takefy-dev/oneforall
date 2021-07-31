const Event = require('../../structures/Handler/Event');


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'voiceChannelSwitch',
        });
    }
    async run(client, member, oldChannel, newChannel){
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(member.guild.id);
        const tempVoc = guildData.get('tempvoc');
        const { channelName, channelId, categoryId, enable } = tempVoc;
        if(!enable) return;
        if(newChannel.parentID !== categoryId && oldChannel.parentID !== categoryId) return
        const chName = `${channelName.replace(/{username}/g, member.user.username)}`
        if(newChannel.id === channelId){
            member.guild.channels.create(chName, {
                type: 'voice',
                parent: categoryId,
                reason: `Vocal temporaire`
            }).then(c => {
                c.createOverwrite(member, {
                    MANAGE_CHANNELS: true,
                    MANAGE_ROLES: true,
                });
                member.voice.setChannel(c)
            })
        }
        if(!oldChannel.members.size && oldChannel.id !== channelId){
            oldChannel.delete({reason: `Personne dans le salon`})
        }
    }
}