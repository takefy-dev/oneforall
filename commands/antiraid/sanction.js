const {Collection} = require("discord.js");

module.exports = {
    name: 'sanction',
    description: "Set the sanction of a antiraid event | Définir la sanction d'un evenement sur l'antiraid",
    category: 'antiraid',
    usage: 'sanction <antiraidEvent> <sanction>',
    aliases: ['punish'],
    clientPermissions: ['SEND_MESSAGES'],
    userPermissions: ['ADMINISTRATOR'],
    guildOwnerOnly: true,
    onlyTopGg: true,
    cooldown: 2,
    run: async (client, message, args) => {
        const eventToEdit = args[0].toLowerCase();
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang
        const sanction = args[1].toLowerCase()
        if (sanction !== 'ban' && sanction !== 'kick' && sanction !== 'unrank') return message.channel.send(lang.sanction.notCorrectSanction)
        const antiraidConfig = guildData.get('antiraid');
        const events = new Collection()
        for (const evName of Object.keys(antiraidConfig.enable)) events.set(evName.toLowerCase(), evName);
        if (!events.has(eventToEdit)) {
            const replyMsg = await message.channel.send(lang.enable.eventNotFound(args[0]));
            return setTimeout(() => {
                replyMsg.delete()
            }, 4000)
        }
        antiraidConfig.sanction[events.get(eventToEdit)] = sanction;
        guildData.set('antiraid', antiraidConfig).save().then(() => {
            message.channel.send(lang.enable.success(args[0], sanction))
        })

    }
}