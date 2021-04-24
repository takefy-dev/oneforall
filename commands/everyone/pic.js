
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'pic',
            description: "Get the picture profile of an user | Avoir l'avatar d'un utilisateur",
            usage: '!pic [user]',
            aliases: ['pp', 'avatar'],
        });
    }
    async run(client, message, args) {
        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        let user = message.mentions.users.first();
        if (!isNaN(args[0])) user = await client.users.fetch(args[0]).catch()
        if (!user) user = message.author;
        const avatarURL = user.displayAvatarURL({size: 512, dynamic: true}).replace(".webp", ".png");
        if (message.content.includes("-v")) message.channel.send("<" + avatarURL + ">");
        const embed = new Discord.MessageEmbed()
            .setTitle(user.tag)
            .setImage(avatarURL)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter(client.user.username)
        message.channel.send(embed);
    }
};

