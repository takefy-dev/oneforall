module.exports = {
    name: 'vocal',
    description: 'Show how many members are in voice chat | Permet de montrer combien de membres sont en vocal',
    usage: 'vocal',
    category: 'everyone',
    aliases: ['voc', 'vc'],
    clientPermissions: ['SEND_MESSAGES'],
    cooldown: 5,
    run: async (client, message, args) => {

        const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE');
        const members = message.guild.members.cache.filter(m => !m.bot && m.voice.channelId
            != null);
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;

        let count = 0;
        let muteCount = 0;
        let streamingCount = 0;
        let muteHeadSetCount = 0;
        let openMicCount = 0;
        for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.filter(m => !m.bot).size;
        for (const [id, member] of members) {
            if (member.voice.mute === true && member.voice.deaf === false) {
                muteCount += 1
            }
            if (member.voice.streaming === true) {
                streamingCount += 1
            }
            if (member.voice.deaf === true) {
                muteHeadSetCount += 1
            }
            if (member.voice.mute === false && member.voice.deaf === false) {
                openMicCount += 1
            }

        }
        message.channel.send(lang.vocal.msg(count, muteCount, streamingCount, muteHeadSetCount, openMicCount))
    }
};


