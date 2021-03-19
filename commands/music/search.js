const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'search',
    description: 'Search for a music | Cherche une music',
    // Optionnals :
    usage: '!search <music to search>',
    category: 'music',
    aliases: ['find', 'chercher'],
    tags: ['guildOnly', 'voiceOnly'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const musicName = args.join(" ");
    try{
        const msg = await message.channel.send(lang.music.search.searching);
        await client.music.search(musicName).then((result) =>{
            const embed = new Discord.MessageEmbed()
            .setTitle(lang.music.search.title)
            .setDescription(`
                ${result.map((song, i) => `**${i+1}**.${song.name} - \`${song.formattedDuration}\``).join("\n")}
            `)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter(client.user.username)
            msg.edit(" ", embed)

        })
    }catch(e){
        console.error(e)
    }
});

embedsColor(guildEmbedColor);
langF(guildLang);
