const Command = require('../../structures/Handler/Command');
const Discord = require('discord.js')
const canvacord = require("canvacord");
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'xp',
            description: "Show your xp or a xp member | Affiche votre xp ou celui d'un membre",
            category: 'xp',
            usage: 'xp [mention/id]',
            aliases: ['lvl'],
            clientPermissions : ['ATTACH_FILES'],
            cooldown: 4
        });
    }
    async run(client, message,args){
        if (args[0])
            args[0] = args[0].startsWith("<@") && args[0].endsWith(">") ? args[0].replace(/!/, '').slice(2, -1) : args[0];
        else args[0] = message.author.id
        let targetUser = await client.users.fetch(args[0]).catch();
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const userXp = await client.levels.fetch(targetUser.id, message.guild.id, true)
        const color = guildData.get('color') === "#36393F" ? "#2EAD4B" : guildData.get('color')
        const rank = new canvacord.Rank()
            .setAvatar(targetUser.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(userXp.cleanXp)
            .setRequiredXP(userXp.cleanNextLevelXp)
            .setStatus("dnd")
            .setProgressBar(color, "COLOR")
            .setUsername(targetUser.username)
            .setDiscriminator(targetUser.discriminator, color)
            .setLevel(userXp.level)
            .setRank(userXp.position)
            .setCustomStatusColor(color)
            .setLevelColor(color)
            .setRankColor(color)

        rank.build()
            .then(data => {
                const attachment = new Discord.MessageAttachment(data, "xp.png");
                message.channel.send(attachment);
            });
    }
}