
const StateManager = require('../../utils/StateManager');
const sniped = new Map();
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'snipe',
            description: 'Show the last deleted message in a channel',
            usage: '!snipe',
            category: 'everyone',
        });
    }
    async run(client, message,args){



    const lang = client.lang(message.guild.lang)
    function hasDiscordInvite(string) {
		let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

		return discordInvite.test(string);

	}

    const color =message.guild.color
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
}};
StateManager.on('snipes', async (guildId, snipe) =>{
    await sniped.set(guildId, snipe)
})

