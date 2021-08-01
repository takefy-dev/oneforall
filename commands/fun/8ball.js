const Discord = require('discord.js')

module.exports = {

    name: '8ball',
    description: 'Answer to your question. | Répond a votre question.',
    usage: '8ball <question>',
    category: 'fun',
    tags: ['guildOnly'],
    aliases: ['8b'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 5,


    run: async (client, message, args) => {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;

        if (!args[0]) return message.channel.send(lang.ball.noQuestion)
        let replies = lang.ball.reponseQuestion
        let result = Math.floor((Math.random() * 8));
        let question = args.slice().join(" ");
        let ballembed = new Discord.MessageEmbed()
            .setAuthor(`🎱 ${message.author.username}`)
            .setColor(`${color}`)
            .addField("Question", question)
            .addField(lang.ball.reponse, replies[result])

        message.channel.send({embeds: [ballembed]})

    }
};

