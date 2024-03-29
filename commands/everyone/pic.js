const Discord = require('discord.js')

module.exports = {

    name: 'pic',
    description: "Get the picture profile of an user | Avoir l'avatar d'un utilisateur",
    usage: 'pic [user]',
    aliases: ['pp', 'avatar'],
    cooldown: 5,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        let user = message.mentions.users.first();
        if (!isNaN(args[0])) user = await client.users.fetch(args[0]).catch(() => {
        })
        if (!user) user = message.author;
        const avatarURL = user.displayAvatarURL({size: 512, dynamic: true}).replace(".webp", ".png");
        if (message.content.includes("-v")) message.channel.send("<" + avatarURL + ">");
        const embed = new Discord.MessageEmbed()
            .setTitle(user.tag)
            .setImage(avatarURL)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter(client.user.username)
        message.channel.send({embeds: [embed]});
    }
};

