module.exports = {
    name: 'messageCreate',
    run: async (client, message) => {
        if (!message.guild || message.author.bot) return
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        let {xpPerMsg, allowChannels, forbidChannels, multiplerChannels, enable} = guildData.get('xp');
        if (!enable) return;
        const boost = multiplerChannels ? multiplerChannels.find(boost => boost.channel === message.channel.id) : undefined
        if (!allowChannels.includes('all') && !allowChannels.includes(message.channel.id) || forbidChannels.includes(message.channel.id)) return
        if (typeof xpPerMsg === 'string') xpPerMsg = client.functions.getRandomInt(parseInt(xpPerMsg.split('-')[0]), parseInt(xpPerMsg.split('-')[1]))
        let xpGain = xpPerMsg
        if (boost)
            xpGain += boost.boost
        const hasLeveledUp = await client.levels.appendXp(message.author.id, message.guild.id, xpGain)
        if (!hasLeveledUp) return
        const {roleLevel, lvlMessage, cumulRoles, maxRoleLvl} = guildData.get('level')
        const channel = message.guild.channels.cache.get(lvlMessage.channel);
        if (!channel && channel.deleted) return
        const userLevel = await client.levels.fetch(message.author.id, message.guild.id, true);
        const finalMessage = lvlMessage.message.replace(/{memberMention}/g, message.member.toString()).replace(/{memberLevel}/g, userLevel.level).replace(/{memberXp}/g, userLevel.xp).replace(/{memberLbPosition}/g, userLevel.position).replace(/{memberTag}/g, message.author.tag || message.author.username)
        channel.send(finalMessage)
        if (!roleLevel.length) return
        const roleToAdd = []
        roleLevel.filter(roleLvl => roleLvl.level <= userLevel.level).forEach(role => roleToAdd.push(role.role))
        if (!roleToAdd.length) return
        await message.member.roles.add(roleToAdd, `Lvl up ${userLevel.level}`)
        if (!cumulRoles) {
            const toRemove = []
            roleLevel.filter(roleLvl => roleLvl.role !== maxRoleLvl.role).forEach(role => {
                toRemove.push(role.role)
            })
            await message.member.roles.remove(toRemove, `Cumul roles off`)
        }
    }
}