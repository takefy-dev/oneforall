
const logsChannelId = new Map();
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'derank',
            description: "Remove all roles of a member | Enlever tout les rôles d'un membre",
            usage: 'derank <mention / id>',
            category: 'moderation',
            aliases: ['unrank'],
            userPermissions: ['ADMINISTRATOR'],
            clientPermissions: ['MANAGE_ROLES'],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const lang = client.lang(message.guild.lang)
    const color =message.guild.color
    let memberss = await message.mentions.members.first()
    let member;
    await message.guild.members.fetch().then((members) =>{
        member = members.get(args[0]) || members.get(memberss.id)
    });
    if (!member) return message.channel.send(lang.derank.errorNoMember)
    if(member.user.id === client.user.id) return message.channel.send(lang.derank.errorUnrankMe)
    // console.log(message.member.roles.highest)
    // const role = message.guild.roles.cache.get(message.member.roles.highest.id)
    if(member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0 && message.guild.ownerID != message.author.id)  return message.channel.send(lang.derank.errorRl(member))
    if (member.user.id === message.author.id) return message.channel.send(lang.derank.errorUnrankself);
    let roles = []
    let role = await member.roles.cache
        .map(role => roles.push(role.id))
    role
    if(roles.length === 1) return message.channel.send(lang.derank.errorNoRl(member));
    member.roles.remove(roles, lang.derank.reason(message.member)).then(() =>{
        let logChannelId = logsChannelId.get(message.guild.id);
        if (logChannelId != undefined) {
            let logChannel = message.guild.channels.cache.get(logChannelId)
            const logsEmbed = new Discord.MessageEmbed()
				.setTitle("\`❌\` Derank d'un membre")
				.setDescription(`
					\`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a derank :\n
                    \`\`\`${member.user.tag} (${member.user.id})\`\`\`

					`)
				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)

				.setTimestamp()
				.setFooter("🕙")
				.setColor(`${color}`)
			logChannel.send(logsEmbed)
        }
        return message.channel.send(lang.derank.success(member))
    })
}}
