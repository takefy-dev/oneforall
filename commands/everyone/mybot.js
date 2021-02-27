const { Command } = require('advanced-command-handler');
const BotPerso = require('../../utils/BotPerso.js')
const Discord = require('discord.js')
const prettyMilliseconds = require('pretty-ms');
const guildEmbedColor = new Map();
var embedsColor = require('../../function/embedsColor');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command(
    {
        name: 'mybot',
        description : `Show your current subscription of custom bot | Montre votre abonnement de bot personnalisé`,
        usage: '!mybot',
        category: 'botperso',
        tags: ['guildOnly'],
        aliases: ['mybots', 'mesbot'],
        clientPermissions: ['SEND_MESSAGES'],
        cooldown: 5,
    },
    async (client, message, args) => {
        const color = guildEmbedColor.get(message.guild.id);
        const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
        this.botperso = BotPerso.botperso;
        this.botperso.query(`SELECT * FROM client WHERE discordId = '${message.author.id}'`).then(async (res) => {
            if (res[0].length === 0) return message.channel.send(`Vous n'avez pas de bot personnalisé pour en commander un veuillez créer un ticket !`).then((rp) => {
                rp.delete({ timeout: 2000 })
            })
            let now = Date.now();
            now = new Date(now)
            const expireAt = new Date(res[0][0].expireAt)
            const timeLeft = prettyMilliseconds(expireAt.getTime() - now.getTime())
            const msg = await message.channel.send(lang.loading)
            const avatar = message.author.displayAvatarURL({ dynamic: true })
            const inv = `https://discord.com/oauth2/authorize?client_id=${res[0][0].botId}&scope=bot&permissions=8`
            const embed = new Discord.MessageEmbed()

                .setDescription(`
                    [Invitation](${inv}) ・ **${timeLeft}**
                `)
                .setTimestamp()
                .setColor(`${color}`)
                .setFooter(message.author.tag, avatar)
            msg.edit('', embed)
        })
    }
);

embedsColor(guildEmbedColor);
langF(guildLang);
