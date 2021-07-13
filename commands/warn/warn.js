const warnSanction = new Map();
const muteRoleId = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'warn',
            description: 'Warn a member | Warn un membre',
            usage: 'warn <member/id> <reason>',
            category: 'warn',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const color = message.guild.color;
          const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;;
        const warnedMember = await message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
        if (!warnedMember) return message.channel.send(lang.warn.noMember);
        let reason = args.slice(1).join(' ');
        if (!reason) reason = lang.warn.noReason;
        let memberWarns = warnedMember.warns;
        memberWarns.push(reason);
        warnedMember.updateWarn = memberWarns
        await warnedMember.createDM().then((dm) => {
            dm.send(lang.warn.warnDm(message.author.tag, reason, memberWarns.length)).then(() => {
                warnedMember.deleteDM()
            })
        })
        message.channel.send(lang.warn.warnSuccess(warnedMember.user.tag || warnedMember.username, reason, memberWarns.length))

        const {ban, kick, mute} = message.guild.warns;
        if (memberWarns.length >= ban && warnedMember.bannable && ban !== 0) {
            await warnedMember.createDM().then((dm) => {
                dm.send(lang.warn.banDm(memberWarns.length, message.guild.name)).then(() => {
                    warnedMember.deleteDM()
                    message.guild.members.ban(warnedMember, {reason: `Limite de warn ban atteinte (${ban}) ${warnedMember.user.tag} a donc été ban`}).then(async () => {
                        warnedMember.deleteWarn()
                    })
                })
            })
        }else if(memberWarns.length >= kick && warnedMember.kickable && kick !== 0){
            await warnedMember.createDM().then((dm) => {
                dm.send(lang.warn.kickDm(memberWarns.length, message.guild.name)).then(() => {
                    warnedMember.deleteDM()
                    message.guild.member(warnedMember.user.id).kick({reason: `Limite de warn kick atteinte (${kick}) ${warnedMember.user.tag} a donc été kick`})

                })
            })
        }else if (memberWarns.length >= mute && mute !== 0) {
            let isSetup = message.guild.setup;
            if (!isSetup) return message.channel.send(lang.error.noSetup);
            await warnedMember.createDM().then((dm) => {
                dm.send(lang.warn.muteDm(memberWarns.length, message.guild.name)).then(() => {
                    warnedMember.deleteDM()
                })
            })
            if (!warnedMember.roles.cache.has(message.guild.config.muteRoleId)) {
                warnedMember.roles.add(message.guild.config.muteRoleId, {reason: `Limite de warn mute atteinte (${mute}) ${warnedMember.user.tag} a donc été mute`})

            }
        }
    }
}