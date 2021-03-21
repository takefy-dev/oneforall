const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const Date2MysqlFormat = require('date2mysqlformat');
const prettyMilliseconds = require('pretty-ms');

module.exports = new Command({
    name: 'mutelist',
    description: 'Show the tempmute member of the server | Afficher la liste des membres tempmute du serveur',
    // Optionnals :
    usage: '!mutelist',
    category: 'moderation',
    tags: ['guildOnly'],
    userPermissions: ['MUTE_MEMBERS'],
    clientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],
    cooldown: 5
}, async(client, message, args) => {
    const mutedData = [];
    this.connection = StateManager.connection;
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    await this.connection.query(`SELECT userId, muteEnd FROM tempMute WHERE guildId = '${message.guild.id}'`).then(async (res) => {
        if(res[0].length == 0) return;
        const userId = res[0][0].userId;
        const muteEnd = res[0][0].muteEnd;
        let now = Date.now();
        now = new Date(now)
        res[0].forEach(muted => {
            const expireAt = new Date(muted.muteEnd)
            const timeLeft = prettyMilliseconds(expireAt.getTime() - now.getTime())
            mutedData.push(`<@${muted.userId}> ・ ${timeLeft}`)
        })
        if(res[0].length === 0 ) return message.channel.send(`Il n'y a pas de membre muet`)
        try {
            let tdata = await message.channel.send(lang.loading)
    
            let p0 = 0;
            let p1 = 10;
            let page = 1;
            // console.log(mutedData.map(r => r).map((user, i) => message.guild.members.cache.get(user).user.id, i))
    
            let embed = new Discord.MessageEmbed()
            embed.setTitle(`${lang.mutelist.title}`)
                .setColor(`${color}`)
                .setDescription(mutedData
                    .slice(0, 10)
                    .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
                .setTimestamp()
                .setFooter(`${client.user.username}`);
    
            let reac1
            let reac2
            let reac3
    
            if (mutedData.length > 10) {
                reac1 = await tdata.react("⬅");
                reac2 = await tdata.react("❌");
                reac3 = await tdata.react("➡");
            }
    
            tdata.edit(" ", embed);
    
            const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);
    
            data_res.on("collect", async (reaction) => {
    
                if (reaction.emoji.name === "⬅") {
    
                    p0 = p0 - 10;
                    p1 = p1 - 10;
                    page = page - 1
    
                    if (p0 < 0) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }
    
    
                    embed.setDescription(mutedData
                        .slice(p0, p1)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
                    tdata.edit(embed);
    
                }
    
                if (reaction.emoji.name === "➡") {
    
                    p0 = p0 + 10;
                    p1 = p1 + 10;
    
                    page++;
    
                    if (p1 > mutedData.length + 10) {
                        return
                    }
                    if (p0 === undefined || p1 === undefined) {
                        return
                    }
    
    
                    embed.setDescription(mutedData
                        .slice(p0, p1)
                        .join('\n') + `\n\n<:778353230467825704:781155103566331904> Page **${page}** / **${Math.ceil(mutedData.length / 10)}**`)
                    tdata.edit(embed);
    
                }
    
                if (reaction.emoji.name === "❌") {
                    data_res.stop()
                    await tdata.reactions.removeAll()
                    return tdata.delete();
                }
    
                await reaction.users.remove(message.author.id);
    
            })
    
        } catch (err) {
            console.log(err)
        }
       
    })
});

embedsColor(guildEmbedColor);
langF(guildLang);
