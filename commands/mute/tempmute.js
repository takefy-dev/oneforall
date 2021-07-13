const StateManager = require('../../utils/StateManager');
const ms = require('ms');
const muteRoleId = new Map();
const logsChannelId = new Map();
const moment = require('moment')
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'tempmute',
            description: 'Tempmute a members | Tempmute un membre',
            usage: 'tempmute <mention/id> <time>',
            category: 'moderation',
            userPermissions: ['MUTE_MEMBERS'],
            clientPermissions: ['MUTE_MEMBERS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        let isSetup = guildData.get('setup');
        if (!isSetup) return message.channel.send(lang.error.noSetup);

        const member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
        if (!member) return message.channel.send(lang.tempmute.errorNoMember);

        const muteRole = message.guild.roles.cache.get(guildData.get('muteRoleId'));
        if (!muteRole) return message.channel.send(lang.tempmute.errorCantFindRole);

        const time = args[1];
        if (!time || isNaN(ms(time))) return message.channel.send(lang.tempmute.errorTime);

        if (member.roles.cache.has(muteRole.id)) return message.channel.send(lang.tempmute.errorAlreadyMute(member));
        member.roles.add(muteRole, `Mute by ${message.author.tag}`).then(async () => {
            const color = guildData.get('color')

            message.channel.send(lang.tempmute.success(member, time));

            const timeLenght = time.split('').length
            const numberT = parseInt(time.slice(0, timeLenght - 1))
            const dateF = time.split('')[timeLenght - 1].toString()
            const now = moment().utc()
            const muteEnd = now.add(numberT, dateF)

            try {
                const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${member.id}`)
                const mute = userData.get('mute');
                mute.expireAt = muteEnd;
                mute.createdAt = new Date()
                mute.muted = true;
                userData.set('mute', mute).save()
            } catch (err) {
                console.log(err)
            }
            const {logs} = lang
            const {modLog} = guildData.get('logs').mod;
            const channel = message.guild.channels.cache.get(modLog);
            if (channel && !channel.deleted) {
                channel.send(logs.mute(message.member, member.user, time, color, "tempmute"))
            }

        })


    }
};

