const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'snipe',
            description: 'Show the last deleted message in a channel',
            usage: 'snipe',
            category: 'everyone',
            userPermissions: ['MANAGE_MESSAGES'],
            cooldown: 5

        });
    }

    async run(client, message, args) {


        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;

        function hasDiscordInvite(string) {
            let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

            return discordInvite.test(string);

        }

        const color = guildData.get('color')
        let msg;

        try {
            const {snipes} = guildData;
            msg = snipes.get(message.channel.id)

        } catch (err) {
            console.error(err)
            return message.channel.send(lang.snipe.error)
        }
        let msgContent = msg.content
        if (hasDiscordInvite(msg.content)) msgContent = msgContent.replace(msgContent, lang.snipe.link)
        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true, size: 256}))
            .setDescription(msgContent)
            .setFooter(`${client.user.username} | Date: ${msg.date}`)
            .setColor(`${color}`)
        if (msg.image) embed.setImage(msg.image)
        message.channel.send(embed)
    }
};


