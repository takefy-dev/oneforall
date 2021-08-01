
const Discord = require('discord.js')

module.exports =  {

            name: 'coins',
            description: 'Show how many coins you have | Affiche le nombre de coins que vous avez',
            // Optionnals :
            usage: 'coins [mention/id]',
            category: 'coins',
            tags: ['guildOnly'],
            aliases: ['balance', 'argent', 'money'],
            clientPermissions: ['EMBED_LINKS'],
            coinsOnly : true,
            cooldown: 4,


    run: async (client, message, args) => {
        let member = message.mentions.members.first()  || await message.guild.members.fetch(args[0])
        if(!args[0]) member = message.member;

        const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${member.id}`)
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const lang = guildData.lang
        let coins = !userData.get('coins')? 'Aucun' : userData.get('coins');
        const embed = new Discord.MessageEmbed()
            .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic: true}))
            .setColor(guildData.get('color'))
            .setFooter(client.user.username)
            .setTimestamp()
            .setDescription(lang.coins.description(coins));

        await message.channel.send({embeds: [embed]})

    }
}
