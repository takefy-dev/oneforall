const { version } = require('../../package.json');
const moment = require('moment');
const { utc } = require('moment');
const { MessageEmbed, version: djsversion } = require('discord.js');
const os = require('os')
const ms = require('ms')
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
module.exports = new Command({
    name: 'serverinfo',
    description: 'Get information about the server | Avoir des information concernant le serveur',
    category: 'info',
    clientPermissions: ['SEND_MESSAGES'],
    aliases: ['infoserver','si'],
    cooldown: 4
}, async(client, message, args) => {
    const filterLevels = {
        DISABLED: 'Off',
        MEMBERS_WITHOUT_ROLES: 'No Role',
        ALL_MEMBERS: 'Everyone'
    };

    const verificationLevels = {
        NONE: 'NONE',
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH',
        VERY_HIGH: 'VERY HIGH'
    };

    const regions = {
        brazil: 'Brazil :flag_br:',
        europe: 'Europe :flag_eu:',
        hongkong: 'Hong Kong :flag_hk:',
        india: 'India :flag_in:',
        japan: 'Japan :flag_jp:',
        russia: 'Russia :flag_ru:',
        singapore: 'Singapore :flag_sg:',
        southafrica: 'South Africa :flag_za:',
        sydeny: 'Sydeny :flag_au:',
        'us-central': 'US Central :flag_us:',
        'us-east': 'US East :flag_us:',
        'us-west': 'US West :flag_us:',
        'us-south': 'US South :flag_us:'
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
    let sicon = message.guild.iconURL;
    const shardId = message.guild.shard.id
  let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .slice(0, 10)
            .join(",");
            if (rolemap.length > 1024) rolemap = "To many roles to display";
            if (!rolemap) rolemap = "No roles";
      
    let online = message.guild.members.cache.filter(member => member.presence.status !== "online").size;
    let offline = message.guild.members.cache.filter(member => member.presence.status == "offline").size;
    let idle =message.guild.members.cache.filter(member => member.presence.status == "idle").size;
    let dnd = message.guild.members.cache.filter(member => member.presence.status == "dnd").size;
    const embed = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name}`)
        .setDescription(`ID: ${message.guild.id}`)
        .setColor(color)
        .addField(`**OWNERSHIP**:`, `<:771637500967124994:781883946614784011> ${message.guild.owner.user.tag}\n<@${message.guild.ownerID}>`, true)
        .addField(`**CHANNELS**:`, `<:channel:817722375562985472> Text: ${channelsGuild.filter(channel => channel.type === 'text').size}\n<:voc:801123036576612353> Voice: ${channelsGuild.filter(channel => channel.type === 'voice').size}`, true)
        .addField(`**REGION:**`, `${regions[message.guild.region]}`, true)
        .addField(`**VERIFICATION LEVE:**`, `${verificationLevels[message.guild.verificationLevel]}`, true)
        .addField(`**BOOSTS:**`, `${message.guild.premiumSubscriptionCount || '0'} (${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'})`, true)
        .addField(`**AFK CHANNEL:**`, `${message.guild.afkChannelID === null ? 'N/A' : message.guild.channels.cache.get(message.guild.afkChannelID).name}`, true)
        .addField(`**CREATED:**`, `${moment(message.guild.createdTimestamp).format('LL')}\n${moment(message.guild.createdTimestamp).fromNow()}`, false)
        .addField(`**MEMBERS (${message.guild.memberCount}):**`, `<:online_il:786325180070625311> ${online} : <:charliewave_dnd:786331160744689704> ${dnd} : <:charliewave_idle:786331151144714291> ${idle} : <:charliewave_offline:786331156010106890> ${offline} : <:775305392787685378:780731436771573770> ${membersGuild.filter(member => member.user.bot).size}`, false)
        .addField(`**EMOJIS (${emojisGuild.size}):**`, `Normal Emojis: ${emojisGuild.filter(emoji => !emoji.animated).size}\nAnimated Emojis: ${emojisGuild.filter(emoji => emoji.animated).size}`, true)
        .addField(`**ROLES (${rolesGuild.length}):**`, `${rolemap}`, false)
        .setThumbnail(message.guild.iconURL())
        /*.addField('<a:fleche:786340501531262977> **GENERAL:**', [
            `Nom: **${message.guild.name}**`,
            `ID: **${message.guild.id}**`,
            `CURRENT SHARD: **${shardId + 1}** / ${client.shard.count}`,
            `Owner: **<@${message.guild.ownerID}>**`,
            `Région: **${regions[message.guild.region]}**`,
            `Niveau de boost: **${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}**`,
            `Filtre explicite: **${filterLevels[message.guild.explicitContentFilter]}**`,
            `Niveau de vérification: **${verificationLevels[message.guild.verificationLevel]}**`,
            `Time Created: **${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}**`,
            '\u200b'
        ])
        .addField('<a:fleche:786340501531262977> **STATISTIQUES:**', [
            `Nombre de role(s): **${rolesGuild.length}**`,
            `Nombre d'Emoji(s):  **${emojisGuild.size}**`,
            `Nombre d'Emoji(s) normaux: **${emojisGuild.filter(emoji => !emoji.animated).size}**`,
            `Nombre d'Emoji(s) animé(s): **${emojisGuild.filter(emoji => emoji.animated).size}**`,
            `Text Channels: **${channelsGuild.filter(channel => channel.type === 'text').size}**`,
            `Voice Channels: **${channelsGuild.filter(channel => channel.type === 'voice').size}**`,
            `Nombre de boost: **${message.guild.premiumSubscriptionCount || '0'}**`,
            '\u200b'
        ])
        .addField('<a:fleche:786340501531262977> **MEMBRES:**', [
            `Member Count: **${message.guild.memberCount}**`,
            `Humain: **${membersGuild.filter(member => !member.user.bot).size}**`,
            `Bots: **${membersGuild.filter(member => member.user.bot).size}**`,
            `<:online_il:786325180070625311> En ligne: **${online}**`,
            `<:charliewave_idle:786331151144714291> Inactif: **${idle}**`,
            `<:charliewave_dnd:786331160744689704> Ne pas déranger: **${dnd}**`,
            `<:charliewave_offline:786331156010106890> Hors ligne: **${offline}**`,
            '\u200b'
        ]) */
        .setFooter(client.user.username)
        .setImage(message.guild.bannerURL({size: 1024}))
        .setTimestamp();

    message.channel.send(embed);

});

embedsColor(guildEmbedColor);
