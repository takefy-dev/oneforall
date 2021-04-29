const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')
// TODO : REDO HELP
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'help',
            description: 'Show the command | Affiche les commandes',
            category: 'everyone',
            usage: 'help [commandName]',
            aliases: ['h'],
            clientPermissions : ['EMBED_LINKS'],
            cooldown: 4

        });
    }
    async run(client, message,args) {


        const lang = client.lang(message.guild.lang)
        const color =message.guild.color

        const helpCommand = new Discord.MessageEmbed()

            .setAuthor(lang.help.information, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setColor(`${color}`)
            .setTimestamp()
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter(lang.help.information, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            // .addField(`<:775305392787685378:780731436771573770> Développeur:`, `[\`setavatar\`](https://discord.gg/WHPSxcQkVk), [\`setactivity\`](https://discord.gg/WHPSxcQkVk), [\`setname\`](https://discord.gg/WHPSxcQkVk), [\`shutdown\`](https://discord.gg/WHPSxcQkVk), [\`eval\`](https://discord.gg/WHPSxcQkVk), [\`reboot\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:roles:783422388490469398> guildOwner:`, `[\`setlang\`](https://discord.gg/WHPSxcQkVk), [\`owner add\`](https://discord.gg/WHPSxcQkVk), [\`owner remove\`](https://discord.gg/WHPSxcQkVk), [\`owner clear\`](https://discord.gg/WHPSxcQkVk), [\`owner list\`](https://discord.gg/WHPSxcQkVk), [\`blacklist on\`](https://discord.gg/WHPSxcQkVk), [\`blacklist off\`](https://discord.gg/WHPSxcQkVk), [\`blacklist add\`](https://discord.gg/WHPSxcQkVk), [\`blacklist remove\`](https://discord.gg/WHPSxcQkVk), [\`blacklist list\`](https://discord.gg/WHPSxcQkVk), [\`blacklist clear\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:778353230559969320:780778719824183316> Anti Raid:`, `[\`antiraid\`](https://discord.gg/WHPSxcQkVk), [\`antiraid on\`](https://discord.gg/WHPSxcQkVk), [\`antiraid off\`](https://discord.gg/WHPSxcQkVk), [\`antiraid config\`](https://discord.gg/WHPSxcQkVk), [\`antiraid opti\`](https://discord.gg/WHPSxcQkVk), [\`antiraid antispam on\`](https://discord.gg/WHPSxcQkVk), [\`antiraid antispam off\`](https://discord.gg/WHPSxcQkVk), [\`antiraid antilink on\`](https://discord.gg/WHPSxcQkVk), [\`antiraid antilink off\`](https://discord.gg/WHPSxcQkVk), [\`setlogs\`](https://discord.gg/WHPSxcQkVk), [\`wl add\`](https://discord.gg/WHPSxcQkVk), [\`wl remove\`](https://discord.gg/WHPSxcQkVk), [\`wl clear\`](https://discord.gg/WHPSxcQkVk), [\`wl list\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:778353230589460530:780725963465687060> Modération:`, `[\`soutien config\`](https://discord.gg/WHPSxcQkVk), [\`soutien count\`](https://discord.gg/WHPSxcQkVk), [\`invite config\`](https://discord.gg/WHPSxcQkVk), [\`allbans\`](https://discord.gg/WHPSxcQkVk), [\`alladmins\`](https://discord.gg/WHPSxcQkVk), [\`lock all off\`](https://discord.gg/WHPSxcQkVk), [\`lock all on\`](https://discord.gg/WHPSxcQkVk), [\`lock off\`](https://discord.gg/WHPSxcQkVk), [\`lock on\`](https://discord.gg/WHPSxcQkVk), [\`clear\`](https://discord.gg/WHPSxcQkVk), [\`kick\`](https://discord.gg/WHPSxcQkVk), [\`ban\`](https://discord.gg/WHPSxcQkVk), [\`unban\`](https://discord.gg/WHPSxcQkVk), [\`unban all\`](https://discord.gg/WHPSxcQkVk), [\`say\`](https://discord.gg/WHPSxcQkVk), [\`mutelist\`](https://discord.gg/WHPSxcQkVk), [\`warn clear/list/remove/warnconfig\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:778353230589460530:780725963465687060> Modération 2:`, `[\`massrole add\`](https://discord.gg/WHPSxcQkVk), [\`massrole remove\`](https://discord.gg/WHPSxcQkVk) [\`role add\`](https://discord.gg/WHPSxcQkVk), [\`role remove\`](https://discord.gg/WHPSxcQkVk), [\`webhook size\`](https://discord.gg/WHPSxcQkVk), [\`webhook delete\`](https://discord.gg/WHPSxcQkVk), [\`nuke\`](https://discord.gg/WHPSxcQkVk), [\`setcolor\`](https://discord.gg/WHPSxcQkVk), [\`setprefix\`](https://discord.gg/WHPSxcQkVk), [\`setup\`](https://discord.gg/WHPSxcQkVk), [\`mute\`](https://discord.gg/WHPSxcQkVk), [\`tempmute\`](https://discord.gg/WHPSxcQkVk), [\`tempban\`](https://discord.gg/WHPSxcQkVk), [\`dero\`](https://discord.gg/WHPSxcQkVk), [\`addemoji\`](https://discord.gg/WHPSxcQkVk), [\`removemoji\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:server:783422366230380565> Backup:`, `[\`backup create\`](https://discord.gg/WHPSxcQkVk), [\`backup delete\`](https://discord.gg/WHPSxcQkVk), [\`backup list\`](https://discord.gg/WHPSxcQkVk), [\`backup info\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:desc2:783422775821729792> Autres:`, `[\`counter\`](https://discord.gg/WHPSxcQkVk), [\`embed\`](https://discord.gg/WHPSxcQkVk), [\`reactrole\`](https://discord.gg/WHPSxcQkVk), [\`tempvoc\`](https://discord.gg/WHPSxcQkVk), [\`gstart\`](https://discord.gg/WHPSxcQkVk), [\`greroll\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<a:coinsoneforall:823538178622488616> Coins:`, `[\`buy\`](https://discord.gg/WHPSxcQkVk), [\`coins\`](https://discord.gg/WHPSxcQkVk), [\`inventory\`](https://discord.gg/WHPSxcQkVk), [\`leaderboard\`](https://discord.gg/WHPSxcQkVk), [\`pay\`](https://discord.gg/WHPSxcQkVk), [\`shop-settings\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:music:822488990128799774> Music:`, `[\`play\`](https://discord.gg/WHPSxcQkVk), [\`autoplay\`](https://discord.gg/WHPSxcQkVk),[\`lyrics\`](https://discord.gg/WHPSxcQkVk), [\`pause\`](https://discord.gg/WHPSxcQkVk), [\`nowplaying\`](https://discord.gg/WHPSxcQkVk), [\`queue\`](https://discord.gg/WHPSxcQkVk), [\`resume\`](https://discord.gg/WHPSxcQkVk), [\`pause\`](https://discord.gg/WHPSxcQkVk), [\`search\`](https://discord.gg/WHPSxcQkVk), [\`skip\`](https://discord.gg/WHPSxcQkVk), [\`stop\`](https://discord.gg/WHPSxcQkVk), [\`volume\`](https://discord.gg/WHPSxcQkVk), [\`playlist (add/delete/remove/import/create)\`](https://discord.gg/WHPSxcQkVk), [\`myplaylist\`](https://discord.gg/WHPSxcQkVk), [\`filter\`](https://discord.gg/WHPSxcQkVk)`)
            .addField(`<:778353230484471819:780727288903237663> Général:`, `[\`helpall\`](https://discord.gg/WHPSxcQkVk), [\`support\`](https://discord.gg/WHPSxcQkVk), [\`addbot\`](https://discord.gg/WHPSxcQkVk), [\`snipe\`](https://discord.gg/WHPSxcQkVk),  [\`pic\`](https://discord.gg/WHPSxcQkVk), [\`vocal\`](https://discord.gg/WHPSxcQkVk), [\`authorinfo\`](https://discord.gg/WHPSxcQkVk), [\`ping\`](https://discord.gg/WHPSxcQkVk), [\`botinfo\`](https://discord.gg/WHPSxcQkVk), [\`serverinfo\`](https://discord.gg/WHPSxcQkVk), [\`userinfo\`](https://discord.gg/WHPSxcQkVk), [\`invite\`](https://discord.gg/WHPSxcQkVk), [\`8ball\`](https://discord.gg/WHPSxcQkVk), [\`gay\`](https://discord.gg/WHPSxcQkVk), [\`meme\`](https://discord.gg/WHPSxcQkVk)`)
        const prefix = message.guild.prefix
        if (!args[0]) {
            const filter = (reaction, user) => ['📄'].includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            const embed = new Discord.MessageEmbed()
                .setTitle(lang.help.titleNoArgs)
                .setColor(`${color}`)
                .setTimestamp()
                .setDescription(lang.help.information2(prefix))
                .setFooter(client.user.username, message.author.displayAvatarURL({dynamic: true}))
                .addField(`**Links:**`, `<:verified:824621335858249778> [Top.gg](https://top.gg/bot/780019344511336518)\n<:store_tag:815181746306809877> [Support Server](https://discord.gg/n2EvRECf88)\n<:role:815181750367682580> [Website](https://one4all.fr)\n<:771462923855069204:784471984087236658> [Invite me](https://discord.com/api/oauth2/authorize?client_id=780019344511336518&permissions=8&scope=bot)`)
            const princMsg = await message.channel.send(embed).then(async m => {
                await m.react('📄')
                const collector = m.createReactionCollector(filter, {time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === '📄') {
                        message.channel.send(helpCommand).then(() => {
                            m.reactions.removeAll()
                            collector.stop()
                        })
                    }
                })
            })


        }
        if (args[0] === 'commands') {

            // .setDescription('**A quoi je sers  ?** \n \n Je suis un atiraid ! je fais des antirole,weebhook,channel etc... (Je suis juste un complément je je vous déconseille de mettre que moi comme bot antiraid , car je suis juste la pour __ANTIRAID__ , je ne fais pas de modération etc... ');
            message.channel.send(helpCommand)
        }
        if (args[0] !== 'commands' && args[0]) {
            const cmd = await client.commands.get(args[0].toLowerCase().normalize()) || await client.aliases.get(args[0].toLocaleLowerCase().normalize());

            if (!cmd) return message.channel.send(message.channel.send(lang.help.noCommand(args[0]))).then((mp) => mp.delete({timeout: 4000}))
            console.log(cmd)
            const embed = new Discord.MessageEmbed()
                .setTitle(`${cmd.name} command`)
                .setDescription(lang.help.requiredOrNot)
                .setThumbnail(`https://media.discordapp.net/attachments/780360844696616962/818128852105691166/ddw3h8b-5dd50e8b-32f3-4d51-9328-e55cab4aa546.gif`)
                .addField('ALIASES', cmd.aliases.length < 1 ? lang.help.noAliases : cmd.aliases, true)
                .addField('COOLDOWN:', `${cmd.cooldown}s`, true)
                .addField('CATEGORY:', cmd.category, true)
                .addField('DESCRIPTION:', cmd.description, false)
                .addField('USAGE:', cmd.usage === '' ? lang.help.noUsage : `${prefix}${cmd.usage}`, true)
                .addField('Client Permissions', cmd.clientPermissions)
                .addField('User Permissions', cmd.userPermissions, true)
                .setColor(`${color}`)
                .setFooter(`${lang.help.footer} ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            message.channel.send(embed)
        }
    }
};


