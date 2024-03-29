module.exports = {
    name: 'dero',
    description: "Fix back the derogation of channels when someone raid | Remet les dérogations des salons quand quelqu'un raid",
    usage: 'dero',
    category: 'moderation',
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['MANAGE_CHANNELS'],
    guildOwnerOnly: true,
    cooldown: 5,
    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        let success;


        if (!args[0]) {
            const channels = message.guild.channels.cache
            channels.forEach(channel => {
                channel.edit({
                    permissionOverwrites: [{
                        id: message.guild.id,
                        deny: 805379089
                    }]
                })

            })
            success = await message.channel.send(lang.dero.success);
            setTimeout(() => {
                success.delete();
            }, 5000)
        } else if (args[0] && args[0].toLowerCase() === "off") {
            const channels = message.guild.channels.cache
            channels.forEach(channel => {
                channel.edit({
                    permissionOverwrites: [{
                        id: message.guild.id,
                        allow: 'VIEW_CHANNEL'
                    }]
                })

            })
            success = await message.channel.send(lang.dero.success);
            setTimeout(() => {
                success.delete();
            }, 5000)
        }

    }
}
