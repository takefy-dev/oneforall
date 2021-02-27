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
    name: 'botinfo',
    description: 'Get the information about the bot | Avoir les informations concernant le bot',
    category: 'info',
    clientPermissions: ['SEND_MESSAGES'],
    aliases: ['infobot', 'bot'],
    cooldown: 10
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
    let guildArray;
    let guildCount;
    let channelArray;
    let userArray;
    await client.shard.fetchClientValues("guilds.cache.size").then((res) => {
        guildArray = res
    });
    await client.shard.fetchClientValues("channels.cache.size").then((res) => {
        channelArray = res
    });
    await client.shard.broadcastEval('this.guilds.cache.filter(g => g.available).reduce((acc, guild) => acc + guild.memberCount, 0)')
	.then(results => {
		userArray = results.reduce((acc, memberCount) => acc + memberCount, 0)
	})
	.catch(console.error);
    const core = os.cpus()[0];
    const embedBot = new Discord.MessageEmbed()
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`${client.user.tag} <:online_il:786325180070625311>`)
        .setColor(color)
.addField('<a:fleche:786340501531262977> **INFORMATIONS:**', [
            `Date de création: **${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}**`,
            `Developers: **TAKEFY#9831, baby.#0006, qzzzz#0101**`,
            `Node.js: **${process.version}**`,
            `Version: **v${version}**`,
            `Discord.js: **v${djsversion}**`,
            `Bot Uptime: **${ms(client.uptime)}**`,
            '\u200b'
        ])
        .addField('<a:fleche:786340501531262977> **STATISTICS:**', [
            `Serveurs: **${guildArray.reduce((acc, guildCount) => acc + guildCount, 0).toLocaleString()}** `,
            `Users: **${userArray.toLocaleString()}**`,
            `Channels: **${channelArray.reduce((acc, channelCount) => acc + channelCount, 0).toLocaleString()}**`,
            '\u200b'
        ])
        .addField('<a:fleche:786340501531262977> **SYSTEM:**', [
            `Platforme: **${process.platform}**`,
            `Uptime: **${ms(os.uptime() * 1000, { long: true })}**`,
            `CPU:`,
            `\u3000 Coeurs: **${os.cpus().length}**`,
            `\u3000 Modèle: **${core.model}**`,
            `\u3000 Vitesse: **${core.speed}**MHz`,
        ])
        .setFooter(client.user.username)

        .setTimestamp();

    message.channel.send(embedBot);
});

embedsColor(guildEmbedColor);