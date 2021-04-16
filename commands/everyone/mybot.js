const { Command } = require('advanced-command-handler');
const BotPerso = require('../../utils/BotPerso.js')
const Discord = require('discord.js')
const prettyMilliseconds = require('pretty-ms');
const guildEmbedColor = new Map();
var embedsColor = require('../../function/embedsColor');
const fetch = require('node-fetch')
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command(
    {
        name: 'mybot',

        category: 'botperso',
        tags: ['guildOnly'],
        aliases: ['mybots', 'mesbot'],
        clientPermissions: ['SEND_MESSAGES'],
        cooldown: 5,
    },
    async (client, message, args) => {
        const color = message.guild.color
        const lang = require(`../../lang/${message.guild.lang}`);
        const moderatorAuthorisation = {
            '659038301331783680': {
                name: 'baby',
                auth: 'WkvYaAWBW7t6ZN3U'
            },
            '188356697482330122': {
                name: 'takefy',
                auth: 'RerVzLrdYXBrC479'
            },
            '443812465772462090': {
                name: 'kpri',
                auth: 'A6nhLtkA8cwP3tGG'
            },
            '743853024312819816': {
                name: 'alpha',
                auth: 'UQE9Rjp8Xx5yxmm7'
            },
            '771891030814490624': {
                name: 'rheus',
                auth: 'ytAMTQMRH5TtB5fA'
            },
        
        }
        await fetch(`http://46.4.251.37:3000/api/client/${message.author.id}`, {
            "credentials": "include",
            "headers": {
                "content-type": "application/json",
                "referrerPolicy": "no-referrer-when-downgrade",
                "accept": "*/*",
                "authorization": `${moderatorAuthorisation['188356697482330122'].auth}`,
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "method": "GET",



        }).then(async res => {
            const result = await res.json();
            if (result.message) {
                const avatar = message.author.displayAvatarURL({ dynamic: true })

                const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setDescription(`
                    Vous n'avez pas de bot personnalisé
                `)
                .setColor(`${color}`)
                .setFooter(message.author.tag, avatar)
                
                return message.channel.send(embed)
            } else {

                let now = Date.now();
                now = new Date(now)
                const expireAt = new Date(result.client.expireAt)
                const timeLeft = prettyMilliseconds(expireAt.getTime() - now.getTime())
                const msg = await message.channel.send(lang.loading)
                const avatar = message.author.displayAvatarURL({ dynamic: true })
                const inv = `https://discord.com/oauth2/authorize?client_id=${result.client.botId}&scope=bot&permissions=8`
                const embed = new Discord.MessageEmbed()

                    .setDescription(`
                    [Invitation](${inv}) ・ **${timeLeft}**
                `)
                    .setTimestamp()
                    .setColor(`${color}`)
                    .setFooter(message.author.tag, avatar)
                msg.edit('', embed)

            }
        })

    }
);

embedsColor(guildEmbedColor);
langF(guildLang);
