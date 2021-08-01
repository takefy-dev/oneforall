const {Collection} = require("discord.js");

module.exports = {

    name: 'disable',
    description: "Disable a event of the antiraid | Désactive un evenemenent de l'antiraid",
    category: 'antiraid',
    usage: 'disable <antiraidEvent> (webhookUpdate ect)',
    aliases: ['off', 'desactive'],
    clientPermissions: ['SEND_MESSAGES'],
    userPermissions: ['ADMINISTRATOR'],
    guildOwnerOnly: true,
    onlyTopGg: true,
    cooldown: 2,

    run: async (client, message, args) => {
        const eventToDisable = args[0].toLowerCase();
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang
        const antiraidConfig = guildData.get('antiraid');
        const events = new Collection()
        for (const evName of Object.keys(antiraidConfig.enable)) events.set(evName.toLowerCase(), evName);
        if (!events.has(eventToDisable)) {
            const replyMsg = await message.channel.send(lang.enable.eventNotFound(args[0]));
            return setTimeout(() => {
                replyMsg.delete()
            }, 4000)
        }
        antiraidConfig.enable[events.get(eventToDisable)] = false;
        guildData.set('antiraid', antiraidConfig).save().then(() => {
            message.channel.send(lang.disable.success(args[0]))
        })

    }
}