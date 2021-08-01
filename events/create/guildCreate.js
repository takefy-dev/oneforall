const {WebhookClient, MessageEmbed} = require("discord.js");
module.exports = {
    name: 'guildCreate',
    run: async (client, guild) => {
        const guildData = await client.managers.guildManager.getAndCreateIfNotExists(guild.id, {
            owners: client.botperso ? [] : [guild.ownerId
            ]
        }).save()

        const newInv = await guild.invites.fetch()
        for (const [code, invite] of newInv) {
            guildData.cachedInv.set(code, invite)
        }

        const hook = new WebhookClient({
            id:'803543245287456789',
            token:'tLiyC7T52buVE2o84kXuk5fDNZTPmVY4xBNkicSmUglGfntnR654ab0CgEuCBokUbY8p'
        });
        const embed = new MessageEmbed()
            .setTitle(`J'ai été ajouté a un nouveau serveur`)
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

