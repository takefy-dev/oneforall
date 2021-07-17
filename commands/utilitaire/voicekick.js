const Command = require('../../structures/Handler/Command');

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'voicekick',
            description: "Kick a user from a voicechannel | Exclure un membre d'un channel vocal",
            category: 'utils',
            usage: 'voicekick <member>',
            userPermissions: ['MOVE_MEMBERS'],
            cooldown: 15
        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang
        if (!args[0]) return message.channel.send(lang.voicekick.noMember).then((mp) => {
            setTimeout(() => {
                mp.delete()
            }, 2000)
        })
        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {
        });
        if (!member) return message.channel.send(lang.voicekick.noMember).then((mp) => {
            setTimeout(() => {
                mp.delete()
            }, 2000)
        })
        if (!member.voice.channelID) return message.channel.send(lang.voicekick.notInVoice).then((mp) => {
            setTimeout(() => {
                mp.delete()
            }, 2000)
        })
        await member.voice.kick(`Voice kick par ${message.author.tag || message.author.username}`).then(() => {
            return message.channel.send(lang.voicekick.success(member))
        })

    }
}