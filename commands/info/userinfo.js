const moment = require('moment');
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'userinfo',
            description: "Get information about an user | Avoir des informations d'un utilisateur",
            usage: 'userinfo [mention / id ]',
            category: 'info',
            clientPermissions: ['SEND_MESSAGES'],
            aliases: ['infouser'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

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

        const argument = args[0];
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)

        const color = guildData.get('color')
        if(!argument) return
        const member = message.mentions.members.first() || await message.guild.members.fetch(argument) || message.member;
        let Statusfilter = {
            online: `<:online2:801064570277724170>`,
            idle: `<:charliewave_idle:786331151144714291>`,
            dnd: `<:charliewave_dnd:786331160744689704>`,
            offline: `<:charliewave_offline:786331156010106890>`
        };
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const userFlags = member.user.flags.toArray();
        let checkbot = " ";

        if (member.bot) checkbot = "Robot";
        else checkbot = "Human";
        const embedUser = new Discord.MessageEmbed()
            .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 512}))
            .setColor(color)
            .setTitle(`${member.user.username}#${member.user.discriminator}`)
            .setDescription(`UID: ${member.id}`)
            .addField(`**TAG:**`, `#${member.user.discriminator}`, true)
            .addField(`**NICKNAME:**`, `${member.nickname ? member.nickname : "N/A"}`, true)
            .addField(`**STATUS:**`, Statusfilter[member.presence.status], true)
            .addField(`**HIGHEST ROLE:**`, `${member.roles.hoist ? member.roles.hoist.name : 'None'}`, true)
            .addField(`**BADGES:**`, `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`, true)
            .addField(`**TYPE:**`, `${checkbot}`, true)
            .addField(`**CREATED:**`, `${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`, true)
            .addField(`**JOINED:**`, `${moment(member.joinedAt).format('LL LTS')}`, true)

        return message.channel.send({embeds :[embedUser]});
    }
};

