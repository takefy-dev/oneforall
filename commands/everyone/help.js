const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
const guildPrefix = new Map();
var embedsColor = require('../../function/embedsColor')
const Discord = require('discord.js');
const guildLang = new Map();
var langF = require('../../function/lang')
const { Command, getThing } = require('advanced-command-handler');
module.exports = new Command({
    name: 'help',
    description: 'help command',
    usage: '!help',
    clientPermissions: ['SEND_MESSAGES'],
    category: 'everyone',
    cooldown: 2
}, async (client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)

    const prefix = guildPrefix.get(message.guild.id);
    const color = guildEmbedColor.get(message.guild.id)
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .setTitle(lang.help.titleNoArgs)
            .setColor(`${color}`)
            .setTimestamp()
            .setDescription(`<:778353230484471819:780727288903237663> Le préfixe de ce serveur est **${prefix}**.\nPour obtenir plus d'informations sur une commande, tapez simplement **${prefix}help** \`command\`.\n<:folder:783422648196923452> Vous pouvez également taper **${prefix}help commands** pour obtenir toutes mes commandes.\n<:oneforall:801047039751880755> Et si vous voulez voir mes commandes plus simplement, appuyez sur la réaction`)
            .setFooter(client.user.username, message.author.displayAvatarURL({ dynamic: true }))
            .addField(`**Links:**`, `<:verified:815181742885044224> [Top.gg](https://top.gg/bot/780019344511336518)\n<:store_tag:815181746306809877> [Support Server](https://discord.gg/n2EvRECf88)\n<:role:815181750367682580> [Website](https://one4all.fr)\n<:771462923855069204:784471984087236658> [Invite me](https://discord.com/api/oauth2/authorize?client_id=780019344511336518&permissions=8&scope=bot)`)
        message.channel.send(embed)
    }
    if (args[0] === 'commands') {
        const embed = new Discord.MessageEmbed()

            .setAuthor(lang.help.information, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setColor(`${color}`)
            .setTimestamp()
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter(lang.help.information, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            // .addField(`<:775305392787685378:780731436771573770> Développeur:`, `[\`setavatar\`](https://discord.gg/WHPSxcQkVk), [\`setactivity\`](https://discord.gg/WHPSxcQkVk), [\`setname\`](https://discord.gg/WHPSxcQkVk), [\`shutdown\`](https://discord.gg/WHPSxcQkVk), [\`eval\`](https://discord.gg/WHPSxcQkVk), [\`reboot\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:roles:783422388490469398> guildOwner:`, `[\`setlang\`](https://discord.gg/WHPSxcQkVk), [\`owner add\`](https://discord.gg/WHPSxcQkVk), [\`owner remove\`](https://discord.gg/WHPSxcQkVk), [\`owner clear\`](https://discord.gg/WHPSxcQkVk), [\`owner list\`](https://discord.gg/WHPSxcQkVk), [\`blacklist on\`](https://discord.gg/WHPSxcQkVk), [\`blacklist off\`](https://discord.gg/WHPSxcQkVk), [\`blacklist add\`](https://discord.gg/WHPSxcQkVk), [\`blacklist remove\`](https://discord.gg/WHPSxcQkVk), [\`blacklist list\`](https://discord.gg/WHPSxcQkVk), [\`blacklist clear\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:778353230559969320:780778719824183316> Anti Raid:`, `[\`antiraid\`](https://discord.gg/WHPSxcQkVk), [\`antiraid on\`](https://discord.gg/WHPSxcQkVk), [\`antiraid off\`](https://discord.gg/WHPSxcQkVk), [\`antiraid config\`](https://discord.gg/WHPSxcQkVk), [\`antiraid opti\`](https://discord.gg/WHPSxcQkVk), [\`antiraid antispam on\`](https://discord.gg/WHPSxcQkVk), [\`antiraid antispam off\`](https://discord.gg/WHPSxcQkVk), [\`antiraid antilink on\`](https://discord.gg/WHPSxcQkVk), [\`antiraid antilink off\`](https://discord.gg/WHPSxcQkVk), [\`setlogs\`](https://discord.gg/WHPSxcQkVk), [\`wl add\`](https://discord.gg/WHPSxcQkVk), [\`wl remove\`](https://discord.gg/WHPSxcQkVk), [\`wl clear\`](https://discord.gg/WHPSxcQkVk), [\`wl list\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:778353230589460530:780725963465687060> Modération:`, `[\`soutien config\`](https://discord.gg/WHPSxcQkVk), [\`soutien count\`](https://discord.gg/WHPSxcQkVk), [\`invite config\`](https://discord.gg/WHPSxcQkVk), [\`allbans\`](https://discord.gg/WHPSxcQkVk), [\`alladmins\`](https://discord.gg/WHPSxcQkVk), [\`lock all off\`](https://discord.gg/WHPSxcQkVk), [\`lock all on\`](https://discord.gg/WHPSxcQkVk), [\`lock off\`](https://discord.gg/WHPSxcQkVk), [\`lock on\`](https://discord.gg/WHPSxcQkVk), [\`clear\`](https://discord.gg/WHPSxcQkVk), [\`kick\`](https://discord.gg/WHPSxcQkVk), [\`ban\`](https://discord.gg/WHPSxcQkVk), [\`unban\`](https://discord.gg/WHPSxcQkVk), [\`unban all\`](https://discord.gg/WHPSxcQkVk), [\`say\`](https://discord.gg/WHPSxcQkVk), [\`mutelist\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:778353230589460530:780725963465687060> Modération 2:`, `[\`massrole add\`](https://discord.gg/WHPSxcQkVk), [\`massrole remove\`](https://discord.gg/WHPSxcQkVk) [\`role add\`](https://discord.gg/WHPSxcQkVk), [\`role remove\`](https://discord.gg/WHPSxcQkVk), [\`webhook size\`](https://discord.gg/WHPSxcQkVk), [\`webhook delete\`](https://discord.gg/WHPSxcQkVk), [\`nuke\`](https://discord.gg/WHPSxcQkVk), [\`setcolor\`](https://discord.gg/WHPSxcQkVk), [\`setprefix\`](https://discord.gg/WHPSxcQkVk), [\`setup\`](https://discord.gg/WHPSxcQkVk), [\`mute\`](https://discord.gg/WHPSxcQkVk), [\`tempmute\`](https://discord.gg/WHPSxcQkVk), [\`tempban\`](https://discord.gg/WHPSxcQkVk), [\`dero\`](https://discord.gg/WHPSxcQkVk), [\`addemoji\`](https://discord.gg/WHPSxcQkVk), [\`removemoji\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:server:783422366230380565> Backup:`, `[\`backup create\`](https://discord.gg/WHPSxcQkVk), [\`backup delete\`](https://discord.gg/WHPSxcQkVk), [\`backup list\`](https://discord.gg/WHPSxcQkVk), [\`backup info\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:desc2:783422775821729792> Autres:`, `[\`embed\`](https://discord.gg/WHPSxcQkVk), [\`reactrole\`](https://discord.gg/WHPSxcQkVk), [\`tempvoc\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<a:give:789822270641274890> Concours:`, `[\`gstart\`](https://discord.gg/WHPSxcQkVk), [\`greroll\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:778353230484471819:780727288903237663> Général:`, `[\`helpall\`](https://discord.gg/WHPSxcQkVk), [\`support\`](https://discord.gg/WHPSxcQkVk), [\`addbot\`](https://discord.gg/WHPSxcQkVk), [\`snipe\`](https://discord.gg/WHPSxcQkVk),  [\`pic\`](https://discord.gg/WHPSxcQkVk), [\`vocal\`](https://discord.gg/WHPSxcQkVk), [\`authorinfo\`](https://discord.gg/WHPSxcQkVk), [\`ping\`](https://discord.gg/WHPSxcQkVk), [\`botinfo\`](https://discord.gg/WHPSxcQkVk), [\`serverinfo\`](https://discord.gg/WHPSxcQkVk), [\`userinfo\`](https://discord.gg/WHPSxcQkVk), [\`invite count\`](https://discord.gg/WHPSxcQkVk)`)
        // .setDescription('**A quoi je sers  ?** \n \n Je suis un atiraid ! je fais des antirole,weebhook,channel etc... (Je suis juste un complément je je vous déconseille de mettre que moi comme bot antiraid , car je suis juste la pour __ANTIRAID__ , je ne fais pas de modération etc... ');
        message.channel.send(embed)
    }
    if (args[0] != 'commands' && args[0]) {
        const cmd = await getThing('command', args[0].toLowerCase().normalize());
        if (cmd === null) return message.channel.send(`Je ne trouve pas la commande **__${args[0]}__** dans mes commandes`).then((mp) => mp.delete({ timeout: 4000 }))

        const embed = new Discord.MessageEmbed()
            .setTitle(`${lang.help.cmdTitle}: ${cmd.name}`)
            .setDescription(lang.help.requiredOrNot)
            .addField('Category', cmd.category)
            .addField('Description', cmd.description)
            .addField('Usage', cmd.usage === '' ? lang.help.noUsage : cmd.usage)
            .addField('Aliases', cmd.aliases.length === 0 ?  lang.help.noAliases : cmd.aliases)
            .addField('Client Permissions', cmd.clientPermissions)
            .addField('User Permissions', cmd.userPermissions)
            .addField('Cooldown', `${cmd.cooldown}s`)
            .setColor(`${color}`)
            .setFooter(`${lang.help.footer} ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        message.channel.send(embed)
    }

});


embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('prefixUpdate', (guildId, prefix) => {
    guildPrefix.set(guildId, prefix)
})

StateManager.on('prefixFetched', (guildId, prefix) => {
    guildPrefix.set(guildId, prefix)
})
