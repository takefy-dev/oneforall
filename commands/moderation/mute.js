
const muteRoleId = new Map();
const logsChannelId = new Map();
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'mute',
            description: 'Mute a member | Mute un member',
            usage: '!mute <mention/id>',
            category: 'moderation',
            userPermissions: ["MUTE_MEMBERS"],
            clientPermissions: ['MUTE_MEMBERS'],
            cooldown: 5

        });
    }
    async run(client, message,args){

    const lang = client.lang(message.guild.lang)

    const color = message.guild.color
    let isSetup = message.guild.setup;
    if (!isSetup) return message.channel.send(lang.error.noSetup);
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Informations Invitations`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setColor(`${color}`)
            .setTimestamp()
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter("Massrole", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .addField('<:invite_oeople:785494680904138763> MassRole:', `[\`massrole add\`](https://discord.gg/h69YZHB7Nh) ・ Setup du système d'invitations\n[\`massrole remove\`](https://discord.gg/h69YZHB7Nh) ・ Suppression de rôle en masse`)
        message.channel.send(embed)
    }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send(lang.mute.errorNoMember)
    const muteRole = message.guild.roles.cache.get(muteRoleId.get(message.guild.id));
    if (!muteRole) return message.channel.send(lang.mute.errorCantFindRole);
    if (member.roles.cache.has(muteRole.id)) return message.channel.send(lang.mute.errorAlreadyMute(member));
    member.roles.add(muteRole).then(() => {
        message.channel.send(lang.mute.success(member));
       
        let logChannelId = logsChannelId.get(message.guild.id);
        if (logChannelId != undefined) {
            let logChannel = message.guild.channels.cache.get(logChannelId)
            const logsEmbed = new Discord.MessageEmbed()
				.setTitle("\`❌\` Mute d'un membre")
				.setDescription(`
					\`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a mute :\n
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
    })
}}