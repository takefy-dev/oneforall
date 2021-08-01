const {Collection} = require("discord.js");

module.exports = {

    name: 'bypass',
    description: "Whitelist bypass a event of the antiraid | Whitelist bypass un evenemenent de l'antiraid",
    category: 'antiraid',
    usage: 'bypass <antiraidEvent> (webhookUpdate ect)',
    clientPermissions: ['SEND_MESSAGES'],
    userPermissions: ['ADMINISTRATOR'],
    guildOwnerOnly: true,
    onlyTopGg: true,
    cooldown: 2,

    run: async (client, message, args) => {
        const eventToBypass = args[0].toLowerCase();
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang
        const antiraidConfig = guildData.get('antiraid');
        const events = new Collection()
        for (const evName of Object.keys(antiraidConfig.enable)) events.set(evName.toLowerCase(), evName);
        if (!events.has(eventToBypass)) {
            const replyMsg = await message.channel.send(lang.enable.eventNotFound(args[0]));
            return setTimeout(() => {
                replyMsg.delete()
            }, 4000)
        }
        antiraidConfig.bypass[events.get(eventToBypass)] = !antiraidConfig.bypass[events.get(eventToBypass)];
        guildData.set('antiraid', antiraidConfig).save().then(() => {
            message.channel.send(lang.bypass.success(args[0], antiraidConfig.bypass[events.get(eventToBypass)]))
        })

    }
}