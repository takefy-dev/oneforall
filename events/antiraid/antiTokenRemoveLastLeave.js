module.exports =  {
    name: 'guildMemberRemove',
    run: async (client, member) => {
        const guild = member.guild;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const antiraidConfig = guildData.get('antiraid');
        const isOn = antiraidConfig.enable["antiToken"];
        if (!isOn) return;
        let isGuildOwner = guildData.isGuildOwner(member.id);
        let isBotOwner = client.isOwner(member.id);
        let isWlBypass = antiraidConfig.bypass["antiToken"];
        if (isWlBypass) var isWl = guildData.isGuildWl(member.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return client.client.Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `ANTI TOKEN`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const limites = guildData.get('antiraidLimits');
            if(limites.antiToken.recentJoined.includes(member.id)){
                limites.antiToken.recentJoined = limites.antiToken.recentJoined.filter(id => id !== member.id);
                guildData.set('antiraidLimits', limites).save()
            }
        }


    }
}