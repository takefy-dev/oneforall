const {MessageEmbed, WebhookClient} = require('discord.js')

module.exports =  {

    name: 'guildDelete',

    run: async (client, guild) => {
        client.managers.guildManager.getAndCreateIfNotExists(guild.id).deleteGuild();
        client.Logger.info(`${guild.name} ${guild.id}`, `Guild delete`)
        const hook = new WebhookClient({
            id:'803540682912038952',
            token:'7KhZEwqtJ3hZVWF1bGhuAuoSAzqju8e6V3Yv51wfvahtfChaUYhCtEn-Tbe5f7ErJNE6'
        });
        const embed = new MessageEmbed()
            .setTitle(`J'ai été enlevé d'un nouveau serveur`)
            .setDescription(
                `<:778353230484471819:780727288903237663> Nom : **${guild.name}**\n
     <:778353230589460530:780725963465687060> GuildId : **${guild.id}**\n
     <:778353230383546419:781153631881265173> GuildCount : **${guild.memberCount}**\n
     <:778353230383546419:781153631881265173> OnwerName : **<@${guild.ownerId
}>**\n
  `)

        await hook.send({embeds: [embed]});
    }
}

