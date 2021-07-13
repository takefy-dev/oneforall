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
            usage: 'permconfig <numberOfPerm> <roleId/mention> || permconfig <on/off>',
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
  const lang = guildData.lang;;
        const options = {}

        if(!permToPutCommand){
            const { perm1, perm2, perm3, perm4, perm, permEnable, color } = message.guild;
            const embed = new Discord.MessageEmbed()
                .setTitle(`Perm configuration`)
                .addField(`Perm1:`, `${!perm1 ? lang.perm.noRole : `<@&${perm1}>`}`)
                .addField(`Perm2:`, `${!perm2 ? lang.perm.noRole : `<@&${perm2}>`}`)
                .addField(`Perm3:`, `${!perm3 ? lang.perm.noRole : `<@&${perm3}>`}`)
                .addField(`Perm4:`, `${!perm4 ? lang.perm.noRole : `<@&${perm4}>`}`)
                .addField(`Enable:`, `${emojiEnable[permEnable]}`)
                .setColor(color)
                .setFooter(client.user.username)
                .setTimestamp()
                .setURL('https://www.discord.gg/oneforall')

            return await message.channel.send(embed)
        }

        if(permToPutCommand !== "on" && permToPutCommand !== "off"){
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (permToPutCommand !== '1' && permToPutCommand !== '2' && permToPutCommand !== "3" && permToPutCommand !== '4') return message.channel.send(lang.perm.permNotFound);
            if (!role) return message.channel.send(lang.perm.noRoleConfig)
            if (permToPutCommand === "1") {
                options.perm1 = role.id;
            } else if (permToPutCommand === "2") {
                options.perm2 = role.id;
            } else if (permToPutCommand === "3") {
                options.perm3 = role.id;
            } else if (permToPutCommand === "4") {
                options.perm4 = role.id;
            }
            options.isOn = message.guild.permEnable;
            message.channel.send(lang.perm.setupPerm(role.name, permToPutCommand))

        }else{
            options.isOn = permToPutCommand === "on";
            message.channel.send(lang.perm.enable(permToPutCommand))

        }


        if (!message.guild.permSetup) {
            await message.guild.createPerms(options.perm1, options.perm2, options.perm3, options.perm4, permToPutCommand === "on")
        } else {
            await message.guild.updatePerms('roles', options)
        }


    }
}