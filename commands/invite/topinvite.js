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
        const lb = await message.guild.topInvite()
        if(!lb) return message.channel.send(`Can't find top 10 invites`)
        const color = message.guild.color;
        const embed = new Discord.MessageEmbed()
            .setTitle(`Top 10 invites ${message.guild.name}`)
            .setDescription(lb.map((invite, i) => `${i+1} - <@${invite.userId}> : **${invite.count.join}** join,**${invite.count.leave}** leave, **${invite.count.fake}** fake, **${invite.count.bonus}** bonus\n`))
            .setTimestamp()
            .setFooter(message.guild.name)
            .setColor(color)
        await message.channel.send(embed)
    }
}