const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var checkSetup = require('../../function/check/checkSetup');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const muteRoleId = new Map();
const guildLang = new Map();
var logsChannelF = require('../../function/fetchLogs');
const logsChannelId = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'mute',
    description: 'Mute a member | Mute un member',
    // Optionnals :
    usage: '!mute <mention/id>',
    category: 'moderation',
    userPermissions: ["MUTE_MEMBERS"],
    clientPermissions: ['MUTE_MEMBERS'],
    cooldown: 2
}, async (client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)

    const color = guildEmbedColor.get(message.guild.id);
    let isSetup = checkSetup(message.guild.id);
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
});

embedsColor(guildEmbedColor);
langF(guildLang);
logsChannelF(logsChannelId, 'mod');


StateManager.on('addMuteRole', (guildId, muteRole) => {
    muteRoleId.set(guildId, muteRole);
})

StateManager.on('muteIdFetched', (guildId, muteRole) => {
    muteRoleId.set(guildId, muteRole);
})
