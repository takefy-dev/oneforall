const prettyMilliseconds = require('pretty-ms');

const fetch = require('node-fetch')

const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'mybot',
            category: 'botperso',
            aliases: ['mybots', 'mesbot'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {


        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
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
                const avatar = message.author.displayAvatarURL({dynamic: true})

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
                const avatar = message.author.displayAvatarURL({dynamic: true})
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
}


