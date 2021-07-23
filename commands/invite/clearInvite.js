const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'clearinvite',
            description: "Clear all invite server or a member  | Supprimé toutes les invites du server ou d'un membre",
            category: 'invite',
            usage: 'clearinvite [mention/id]',
            aliases: ['clearinv', 'resetinv', 'clearinvites'],
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly : true,
            cooldown: 7
        });
    }
    async run(client, message,args){
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        if(!message.mentions.members.first() || message.guild.members.cache.get(args[0])){
            for await(const [key, values] of client.managers.userManager){
                const userData = client.managers.userManager.getAndCreateIfNotExists(key);
                userData.set('invite',  { join: 0, leave: 0, fake: 0, bonus: 0 }).save()
                await client.functions.sleep(500)
            }
            return message.channel.send(lang.clearInv.success(message.guild.name))
        }else{
            const member = message.mentions.members.first() || message.guild.members.resolve(args[0]);
            const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${member.id}`)
            userData.set('invite', { join: 0, leave: 0, fake: 0, bonus: 0 }).save().then(() => {
                return message.channel.send(lang.clearInv.success(member.user.tag || member.user.username))

            })
        }

    }
}
