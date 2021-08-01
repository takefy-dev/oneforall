const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
const emojiEnable = {
    true: "<:778348494712340561:781153837850820619>",
    false: "<:778348495157329930:781189773645578311>"
}
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'permconfig',
            description: 'Manage perm role on the serv | Gerer les perms role sur le serveur',
            category: 'perm',
            usage: 'permconfig <numberOfPerm> [remove] <roleId/mention> || permconfig <on/off>',
            aliases: ['permconfig', 'perm-config', 'setup-perm'],
            clientPermissions: ['EMBED_LINKS'],
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly: true,
            cooldown: 2
        });
    }

    async run(client, message, args) {
        const permToPutCommand = args[0];
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const guildPerm = guildData.get('perms');
        const color = guildData.get('color')

        if (!permToPutCommand) {
            const {perm1, perm2, perm3, perm4} = guildPerm.role;
            const embed = new Discord.MessageEmbed()
                .setTitle(`Perm configuration`)
                .addField(`Perm1:`, `${perm1.length < 1 ? lang.perm.noRole : `${perm1.map((role) => `<@&${role}>`).join(',')}`}`)
                .addField(`Perm2:`, `${perm2.length < 1 ? lang.perm.noRole : `${perm2.map((role) => `<@&${role}>`).join(',')}`}`)
                .addField(`Perm3:`, `${perm3.length < 1 ? lang.perm.noRole : `${perm3.map((role) => `<@&${role}>`).join(',')}`}`)
                .addField(`Perm4:`, `${perm4.length < 1 ? lang.perm.noRole : `${perm4.map((role) => `<@&${role}>`).join(',')}`}`)
                .addField(`Enable:`, `${emojiEnable[guildPerm.enable]}`)
                .setColor(color)
                .setFooter(client.user.username)
                .setTimestamp()
                .setURL('https://www.discord.gg/oneforall')

            return await message.channel.send({embeds: [embed]})
        }

        if (permToPutCommand !== "on" && permToPutCommand !== "off" && args[1] !== "remove") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (permToPutCommand !== '1' && permToPutCommand !== '2' && permToPutCommand !== "3" && permToPutCommand !== '4') return message.channel.send(lang.perm.permNotFound);
            if (!role) return message.channel.send(lang.perm.noRoleConfig)

            if (guildPerm.role[`perm${permToPutCommand}`].includes(role.id)) return message.channel.send(lang.perm.alreadyExist)
            guildPerm.role[`perm${permToPutCommand}`].push(role.id)

            message.channel.send(lang.perm.setupPerm(role.name, permToPutCommand))

        } else if (permToPutCommand === "on" || permToPutCommand === "off") {
            guildPerm.enable = permToPutCommand === "on";
            message.channel.send(lang.perm.enable(permToPutCommand))

        } else if (args[1] === 'remove') {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
            let perm = guildPerm.role[`perm${permToPutCommand}`];
            if (perm.includes(role.id)) {
                guildPerm.role[`perm${permToPutCommand}`] = perm.filter(roleId => roleId !== role.id);
            }
            message.channel.send(lang.perm.removePerm(permToPutCommand, role.name))

        }
        guildData.set('perms', guildPerm).save()


    }
}