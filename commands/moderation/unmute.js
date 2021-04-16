const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var checkSetup = require('../../function/check/checkSetup');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const muteRoleId = new Map();
const guildLang = new Map();
var logsChannelF = require('../../function/fetchLogs');
const logsChannelId = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'unmute',
    description: 'Unmute a member | Unmute un membre',
    // Optionnals :
    usage: '!unmute <mention/id>',
    category: 'moderation',
    clientPermissions: ['MUTE_MEMBERS'],
    userPermissions: ['MUTE_MEMBERS'],
    cooldown: 2
}, async(client, message, args) => {
    const lang = require(`../../lang/${message.guild.lang}`)
    const color = message.guild.color
    let isSetup = checkSetup(message.guild.id);
    if(!isSetup) return message.channel.send(lang.error.noSetup);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(lang.unmute.noMember)
    const muteRole = message.guild.roles.cache.get(muteRoleId.get(message.guild.id));
    if(!muteRole) return message.channel.send(lang.unmute.errorCantFindRole);
    if(!member.roles.cache.has(muteRole.id)) return message.channel.send(lang.unmute.errorAlreadyUnMute(member));
    member.roles.remove(muteRole).then(() =>{
        message.channel.send(lang.unmute.success(member));
        let logChannelId = logsChannelId.get(message.guild.id);
        if (logChannelId != undefined) {
            let logChannel = message.guild.channels.cache.get(logChannelId)
            const logsEmbed = new Discord.MessageEmbed()
				.setTitle("\`❌\` Unmute d'un membre")
				.setDescription(`
					\`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a unmute :\n
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
logsChannelF(logsChannelId, 'mod');

StateManager.on('addMuteRole', (guildId, muteRole) =>{
    muteRoleId.set(guildId, muteRole);
})

StateManager.on('muteIdFetched', (guildId, muteRole) =>{
    muteRoleId.set(guildId, muteRole);
})
langF(guildLang);
