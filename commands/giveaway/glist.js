const Command = require('../../structures/Handler/Command');
const {MessageEmbed} = require("discord.js");

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'glist',
            description: 'List giveaways',
            usage: 'glist',
            category: 'giveaway',
            aliases: ['list-giveaways'],
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['ADMINISTRATOR'],
            cooldown: 5

        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const lang = guildData.lang;
        const color = guildData.get('color');
        const onServer = client.giveawaysManager.giveaways.filter(g => g.guildID === message.guild.id && !g.ended);
        let i = 0;
        const embed = new MessageEmbed()
            .setTitle(`List of giveaways (${onServer.size})`)
            .setDescription(onServer.size > 0 ? onServer.map((g) => {

                return `**Giveaway#${i++ + 1}** - [${g.prize}](https://discord.com/channels/${g.guildID}/${g.channelID}/${g.messageID})`
            }) : `No giveaways`)
            .setTimestamp()
            .setColor(color)
        await message.channel.send(embed)

    }
};
