const StateManager = require('../../utils/StateManager');
const Discord = require('discord.js');
// const { client } = require('advanced-command-handler/classes/CommandHandler');
const Event = require('../../structures/Handler/Event');

module.exports = class guildCreate extends Event {
    constructor() {
        super({
            name: 'guildCreate',
        });
    }

    async run(client, guild) {


        const guildData = await client.managers.guildManager.getAndCreateIfNotExists(guild.id, {
            owners: client.botperso ? [] : [guild.ownerId
]
        }).save()

        const newInv = await guild.invites.fetch()
        for (const [code, invite] of newInv) {
            guildData.cachedInv.set(code, invite)
        }

        const hook = new Discord.WebhookClient('803543245287456789', 'tLiyC7T52buVE2o84kXuk5fDNZTPmVY4xBNkicSmUglGfntnR654ab0CgEuCBokUbY8p');
        const embed = new Discord.MessageEmbed()
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

