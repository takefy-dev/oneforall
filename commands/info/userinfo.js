const { version } = require('../../package.json');
const moment = require('moment');
const { utc } = require('moment');
const { MessageEmbed, version: djsversion } = require('discord.js');
const os = require('os')
const ms = require('ms')
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
const {Command} = require('advanced-command-handler');
module.exports = new Command({
    name: 'userinfo',
    description: "Get information about an user | Avoir des informations d'un utilisateur",
    // Optionnals :
    usage: '!userinfo [mention / id ]',
    category: 'info',
    clientPermissions: ['SEND_MESSAGES'],
    aliases: ['infouser'],
    cooldown: 2
}, async(client, message, args) => {
    const filterLevels = {
        DISABLED: 'Off',
        MEMBERS_WITHOUT_ROLES: 'No Role',
        ALL_MEMBERS: 'Everyone'
    };

    const verificationLevels = {
        NONE: 'None',
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: '(╯°□°）╯︵ ┻━┻',
        VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
    };

    const regions = {
        brazil: 'Brazil',
        europe: 'Europe',
        hongkong: 'Hong Kong',
        india: 'India',
        japan: 'Japan',
        russia: 'Russia',
        singapore: 'Singapore',
        southafrica: 'South Africa',
        sydeny: 'Sydeny',
        'us-central': 'US Central',
        'us-east': 'US East',
        'us-west': 'US West',
        'us-south': 'US South'
    };

    const flags = {
        DISCORD_EMPLOYEE: 'Discord Employee',
        DISCORD_PARTNER: 'Discord Partner',
        BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
        BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
        HYPESQUAD_EVENTS: 'HypeSquad Events',
        HOUSE_BRAVERY: 'House of Bravery',
        HOUSE_BRILLIANCE: 'House of Brilliance',
        HOUSE_BALANCE: 'House of Balance',
        EARLY_SUPPORTER: 'Early Supporter',
        TEAM_USER: 'Team User',
        SYSTEM: 'System',
        VERIFIED_BOT: 'Verified Bot',
        VERIFIED_DEVELOPER: 'Verified Bot Developer'
    };
    const rolesGuild = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
    const membersGuild = message.guild.members.cache;
    const channelsGuild = message.guild.channels.cache;
    const emojisGuild = message.guild.emojis.cache;
    const argument = args[0];
    const color = guildEmbedColor.get(message.guild.id)
    
    const member = message.mentions.members.first() || message.guild.members.cache.get(argument) || message.member;
    if(member.user.presence.status == "offline"){
        var online = "online"
    }else{
        online = "offline"
    }
    const roles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, -1);
    const userFlags = member.user.flags.toArray();
    const embedUser = new Discord.MessageEmbed()
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setColor(color)
        .setTitle(`${member.user.username}`)
        .addField('<a:fleche:786340501531262977> **USERINFO:**', [
            `Discriminatoir: **${member.user.discriminator}**`,
            `ID: **${member.id}**`,
            `Badges: **${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}**`,
            `Avatar: [Lien de l'avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
            `Création du compte: **${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}**`,
            `Statut: **${member.user.presence.status}**`,
            `Jeux: **${member.presence.game ? member.presence.game.name : 'None'}**`,

            `\u200b`
        ])
        .addField('<a:fleche:786340501531262977> **MEMBERINFO:**', [
            `Rôle le plus haut: **${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}**`,
            `A rejoins le serveur: **${moment(member.joinedAt).format('LL LTS')}**`,
            `Hoist Role: **${member.roles.hoist ? member.roles.hoist.name : 'None'}**`,
            `Roles [**${roles.length}**]: **${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}**`,
            `\u200b`
        ]);
    return message.channel.send(embedUser);
});

embedsColor(guildEmbedColor);
