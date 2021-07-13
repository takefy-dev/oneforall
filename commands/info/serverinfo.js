
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'serverinfo',
            description: 'Get information about the server | Avoir des information concernant le serveur',
            category: 'info',
            clientPermissions: ['SEND_MESSAGES'],
            aliases: ['infoserver', 'si'],
            cooldown: 5

        });
    }

    async run(client, message, args) {
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
        const rolesGuild = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const membersGuild = message.guild.members.cache;
        const channelsGuild = message.guild.channels.cache;
        const emojisGuild = message.guild.emojis.cache;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const color = guildData.get('color')

        let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .slice(0, 10)
            .join(",");
        if (rolemap.length > 1024) rolemap = "To many roles to display";
        if (!rolemap) rolemap = "No roles";

        let online = message.guild.members.cache.filter(member => member.presence.status !== "online").size;
        let offline = message.guild.members.cache.filter(member => member.presence.status == "offline").size;
        let idle = message.guild.members.cache.filter(member => member.presence.status == "idle").size;
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
            .addField(`SHARD`, `${message.guild.shardID + 1}`)
            .setThumbnail(message.guild.iconURL())
            .setFooter(client.user.username)
            .setImage(message.guild.bannerURL({size: 1024}))
            .setTimestamp();

        message.channel.send(embed);

    }
};

