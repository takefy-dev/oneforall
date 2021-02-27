const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const sniped = new Map();
module.exports = new Command({
    name: 'snipe',
    description: 'Show the last deleted message in a channel',
    // Optionnals :
    usage: '!snipe',
    category: 'everyone',
   
    cooldown: 2
}, async(client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)
    function hasDiscordInvite(string) {
		let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

		if (discordInvite.test(string)) return true;
		return false;
	}

    const color = guildEmbedColor.get(message.guild.id)
    let msg;

    try{
        msg = sniped.get(message.guild.id).get(message.channel.id)

    }catch(err){
        console.error(err)
        return message.channel.send(lang.snipe.error)
    }
    let msgContent = msg.content
    if(hasDiscordInvite(msg.content)) msgContent = msgContent.replace(msgContent, lang.snipe.link)
    const embed = new Discord.MessageEmbed()
    .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic : true, size:256}))
    .setDescription(msgContent)
    .setFooter(`${client.user.username} | Date: ${msg.date}`)
    .setColor(`${color}`)
    if(msg.image)embed.setImage(msg.image)
    message.channel.send(embed)
});
StateManager.on('snipes', async (guildId, snipe) =>{
    await sniped.set(guildId, snipe)
})
embedsColor(guildEmbedColor);
langF(guildLang);
