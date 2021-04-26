const StateManager = require('../../utils/StateManager');
const Discord = require('discord.js')
const Event = require('../../structures/Handler/Event');

module.exports = class guildCreate extends Event {
    constructor() {
        super({
            name: 'guildCreate',
        });
    }

    async run(client, guild) {
        if (guild.deleted) return;
       await guild.deleteAllData();

        const hook = new Discord.WebhookClient('803540682912038952', '7KhZEwqtJ3hZVWF1bGhuAuoSAzqju8e6V3Yv51wfvahtfChaUYhCtEn-Tbe5f7ErJNE6');
        const embed = new Discord.MessageEmbed()
            .setTitle(`J'ai été enlevé d'un nouveau serveur`)
            .setDescription(
                `<:778353230484471819:780727288903237663> Nom : **${guild.name}**\n
     <:778353230589460530:780725963465687060> GuildId : **${guild.id}**\n
     <:778353230383546419:781153631881265173> GuildCount : **${guild.memberCount}**\n
     <:778353230383546419:781153631881265173> OnwerName : **<@${guild.ownerID}>**\n
  `)

        await hook.send(embed);
    }
}

