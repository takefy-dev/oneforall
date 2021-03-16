const cron = require('node-cron');
const Client = require('../models/client');
const Tokens = require('../models/availableToken');
const Discord = require('discord.js');
const clientReminder = new Discord.Client();
const prettyMilliseconds = require('pretty-ms');
const shell = require('shelljs');

module.exports = function detectExpire() {
    // cron.schedule('0 0 0 * * *', () =>{ // run every day ay 00:00

    // })  
    console.log("Detect expire bot is running")
    const path = `/home/takefy/Documents/BotPerso`;

    cron.schedule('0 0 0 * * *', async () => {
        let todayDate = new Date();
        const expireClient = await Client.find({ expireAt: { $lte: todayDate } })
        if (expireClient.length !== 0) {
            clientReminder.login(process.env.TOKEN);
            clientReminder.on('ready', () => {
                console.log(`${clientReminder.user.username}`)
                expireClient.forEach(async client => {

                    const dateToDeleteBot = client.deleteBotAt;

                    const users = await clientReminder.users.cache.get(client.discordId) || await clientReminder.users.fetch(client.discordId);
                    const timeLeftPretty = prettyMilliseconds(dateToDeleteBot.getTime() - todayDate.getTime())

                    if (dateToDeleteBot >= todayDate) {

                        await client.remove().then(async () => {
                            await shell.exec(`pm2 delete ${client.discordName} `, { async: true }, function (code, output) {
                                console.log('Exit code:', code);
                                console.log('Program output:', output);

                            })


                        });
                        await shell.rm('-rf', `${path}/${client.discordId}`)


                        await Tokens.findOneAndUpdate({ token: client.botToken }, { isUse: false })
                        const embed = new Discord.MessageEmbed()
                        embed.setTitle(`Votre bot est arrivé à expiration`)
                        embed.setDescription(`Vous n'avez plus accès a votre bot, pour en ravoir un merci de créer un ticket`)
                        embed.setTimestamp();
                        embed.setColor('RANDOM')
                        embed.setFooter('OneForAll reminder')

                        users.send(embed)


                    } else {

                        const embed = new Discord.MessageEmbed()
                        embed.setTitle(`Expiration de votre bot`)
                        embed.setDescription(`Votre bot va être arrêté dans ${timeLeftPretty} pour continuer votre abonnement merci de vous rendre dans votre ticket`)
                        embed.setTimestamp()
                        embed.setColor('RANDOM')
                        embed.setFooter('OneForAll reminder')

                        users.send(embed)
                    }
                    console.log(timeLeftPretty)
                })
            })

        }



    })

}



