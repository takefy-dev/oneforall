const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'topinvite',
            description: 'Display the 10 member invites || Affiche le top 10 des invits',
            category: 'invite',
            usage: 'topinvite',
            aliases: ['invlb', 'topinv'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 3
        });
    }

    async run(client, message, args) {

        let data = await client.database.models.users.findAll({
            attributes: ['userId', 'invite'],
            where: {
                guildId: message.guild.id
            }
        })
        const tempData = []
        data.forEach(data => {
            tempData.push(data.get())
        })
        const lb = tempData.sort((a, b) => b.invite.join - a.invite.join).slice(0, 10)
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        if(!lb) return message.channel.send(`Can't find top 10 invites`)
        const color = guildData.get('color');
        const embed = new Discord.MessageEmbed()
            .setTitle(`Top 10 invites ${message.guild.name}`)
            .setDescription(lb.map((invite, i) => `${i+1} - <@${invite.userId}> : **${invite.invite.join}** join,**${invite.invite.leave}** leave, **${invite.invite.fake}** fake, **${invite.invite.bonus}** bonus\n`))
            .setTimestamp()
            .setFooter(message.guild.name)
            .setColor(color)
        await message.channel.send(embed)
    }
}