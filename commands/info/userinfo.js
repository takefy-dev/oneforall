const moment = require('moment');
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'userinfo',
            description: "Get information about an user | Avoir des informations d'un utilisateur",
            usage: '!userinfo [mention / id ]',
            category: 'info',
            clientPermissions: ['SEND_MESSAGES'],
            aliases: ['infouser'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const flags = {
            DISCORD_EMPLOYEE: 'Discord Employee',
            DISCORD_PARTNER: '<:Z_Partenaire2:816749957771427861>',
            BUGHUNTER_LEVEL_1: '<:XDM_BugHunter:816750123996282882>',
            BUGHUNTER_LEVEL_2: '<:level2bug:817023897378488350>',
            HYPESQUAD_EVENTS: '<:YLM_Hypesquad:816750048838418462>',
            HOUSE_BRAVERY: '<:bravery:817024570166214748>',
            HOUSE_BRILLIANCE: '<:briliance:817024700273786900>',
            HOUSE_BALANCE: '<:balance:817024823330996225>',
            EARLY_SUPPORTER: '<:earlysupporter:783422670107836446>',
            TEAM_USER: '<:XDM_Staff:816750074750828545>',
            SYSTEM: '<:YLM_Shield:816750007776575499>',
            VERIFIED_BOT: '<:verifiedbot:783422173003776030>',
            VERIFIED_DEVELOPER: '<:dev:783422756854300713>'
        };

        const argument = args[0];
        const color = message.guild.color

        const member = message.mentions.members.first() || message.guild.members.cache.get(argument) || message.member;
        let Statusfilter = {
            online: `<:online2:801064570277724170>`,
            idle: `<:charliewave_idle:786331151144714291>`,
            dnd: `<:charliewave_dnd:786331160744689704>`,
            offline: `<:charliewave_offline:786331156010106890>`
        };
        if (member.user.presence.status === "offline") {
            let online = "online"
        } else {
            online = "offline"
        }
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

        return message.channel.send(embedUser);
    }
};

