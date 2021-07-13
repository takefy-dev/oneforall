
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setup',
            description: 'Setup the role for the bot to work perfectly | Configurer les rôles indispensable pour la fonctionnalitée du bot',
            usage: 'setup',
            category: 'owners',
            guildOwnerOnly: true,
            cooldown: 5
        });
    }

    async run(client, message, args) {


          const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
  const lang = guildData.lang;


        message.channel.send(lang.setup.muteQ)
        const responseMuteRole = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            timeout: 30000,
            errors: ['time']
        }).catch(() => {
            message.channel.send("Opération annulée pas de réponse après 30s")
        })
        const CollectedMuteRole = responseMuteRole.first()
        if (CollectedMuteRole.content.toLowerCase() === "cancel") return message.channel.send(lang.cancel)


        message.channel.send(lang.setup.memberRoleQ)
        const responseMembreRole = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            timeout: 30000,
            errors: ['time']
        }).catch(() => {
            message.channel.send("Opération annulée pas de réponse après 30s")
        })
        const CollectedMembreRole = responseMembreRole.first()
        if (CollectedMembreRole.content.toLowerCase() === "cancel") return message.channel.send(lang.cancel)


        let muteRole = CollectedMuteRole.mentions.roles.first() || message.guild.roles.cache.get(CollectedMuteRole.content);
        let muteRoleId = muteRole.id;
        if(!muteRole) return  message.channel.send(lang.setup.dontFindMute)

        let memberRole = CollectedMembreRole.mentions.roles.first() || message.guild.roles.cache.get(CollectedMembreRole.content);
        let memberRoleId = memberRole.id
        if(!memberRole) return message.channel.send(lang.setup.dontFindMember)

        try {

            await message.guild.updateSetup(muteRoleId, memberRoleId)
            message.channel.send(lang.setup.success(muteRoleId, memberRoleId))
            message.guild.channels.cache.forEach(channel => {
                if (channel.type === 'text') {
                    channel.updateOverwrite(muteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    }, `Setup par ${message.author.tag}`)
                }
                if (channel.type === 'voice') {
                    channel.updateOverwrite(muteRole, {
                        SPEAK: false
                    }, `Setup par ${message.author.tag}`)
                }
            })
        } catch (err) {
            console.log(err)
            message.channel.send(lang.setup.error(muteRoleId, memberRole))
        }
    }
}
