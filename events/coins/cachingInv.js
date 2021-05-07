const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'inventoryFetched',
        });
    }

    async run(client, guildID, userId, inventory) {
        console.log("Starting caching  inventory")

        const guild = client.guilds.cache.get(guildID);
        if(!guild) return;
        const member = guild.members.cache.get(userId) || await guild.members.fetch(userId);
        if(!member) return;
        member.updateInventory = inventory;
        Logger.log(`GUILD : ${guild.name} ${member.user.username}`, `Fetched inventory`, 'yellow')

    }
}