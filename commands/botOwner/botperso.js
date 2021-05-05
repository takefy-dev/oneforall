
const ms = require('ms');
const gdate = require('gdate')
require('dotenv').config();
const prettyMilliseconds = require('pretty-ms');
const dateFormater = require('pm-date-formater');
const importer = require('node-mysql-importer')
const password = require('secure-random-password');
const bcrypt = require('bcryptjs');
const BotPerso = require('../../utils/BotPerso');
const fetch = require('node-fetch')
const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'botperso',
            description: 'Create bot perso',
            category: 'botOwner',
            usage: 'botperso',
            userPermissions: ['ADMINISTRATOR'],
            cooldown: 5

        });
    }
    async run(client, message,args) {


        this.botperso = BotPerso.botperso;
        const moderatorAuthorisation = {
            '659038301331783680': {
                name: 'baby',
                auth: 'WkvYaAWBW7t6ZN3U'
            },
            '188356697482330122': {
                name: 'takefy',
                auth: 'RerVzLrdYXBrC479'
            },
            '831248681004171305': {
                name: 'kpri',
                auth: 'A6nhLtkA8cwP3tGG'
            },
           
            '771891030814490624': {
                name: 'rheus',
                auth: 'ytAMTQMRH5TtB5fA'
            },

        }
        if (!moderatorAuthorisation.hasOwnProperty(message.author.id)) return message.channel.send(`{"message": "Unauthorized"}`);
        const color = message.guild.color
        const create = args[0] == "create";
        const del = args[0] == "delete";
        const add = args[0] == "add"

        let now = new Date();
        let dd = String(now.getDate()).padStart(2, '0');
        let mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = now.getFullYear();
        const today = yyyy + '-' + mm + '-' + dd;
        if (create) {
            const randomPassword = password.randomPassword({length: 8})
            let hashPass = await bcrypt.hash(randomPassword, 8)
            message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le client !(timeout dans 30s & \`cancel\` pour annuler)")
            const responseClient = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                timeout: 30000
            }).catch(() => {
                message.channel.send("Opération annulée pas de réponse après 30s")
            })
            const CollectedClient = responseClient.first();
            if (CollectedClient.content.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée")

            const member = CollectedClient.mentions.members.first() || await message.guild.members.fetch(CollectedClient.content);
            console.log(member.user.username)


            message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Veuillez écrire une durée de l'abonnement en jours !(timeout dans 30s & \`cancel\` pour annuler)")
            const responseTime = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                timeout: 30000
            }).catch(() => {
                message.channel.send("Opération annulée pas de réponse après 30s")
            })
            const CollectedTime = responseTime.first().content.toLowerCase();

            if (CollectedTime == "cancel") return message.channel.send("L'opération a été annulée");
            if (isNaN(ms(CollectedTime))) return message.channel.send("Mets une durée valide !");
            const dur = prettyMilliseconds(ms(CollectedTime)).replace("d", " ")


            let time = new Date(new Date().getTime() + (dur * 24 * 60 * 60 * 1000));
            time = gdate.createYYYYMMDD(time);
            console.log(time)

            while (time.includes('/')) {
                time = time.replace('/', '-')


            }
            const formattime = dateFormater.formatDate(new Date(time), 'yyyy-MM-dd');
            console.log(time)
            const discordName = !member.nickname ? member.user.username : member.nickname;
            const botpersoSqlPath = `/home/oneforall/assets/botperso.sql`
          

            try {
                const newBot = {
                    discordId: member.user.id,
                    expireAt: new Date(time),
                    discordName,
                    password: hashPass
                }
                await fetch(`http://localhost:3000/api/client`, {
                    "credentials": "include",
                    "headers": {
                        "content-type": "application/json",
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "accept": "*/*",
                        "authorization": `${moderatorAuthorisation[message.author.id].auth}`,
                    },
                    "referrerPolicy": "no-referrer-when-downgrade",
                    'body': `${JSON.stringify(newBot)}`,
                    "method": "POST",


                }).then(async res => {
                    const result = await res.json();
                    if (result.message) {
                        this.botperso.query(`DROP DATABASE ${discordName}`)
                        return message.channel.send(JSON.stringify(result))
                    } else {

                        return message.channel.send(`Le bot pour ${member} a été créer son mot de pass est : ${randomPassword} et l'invite est ${result.inviteLink}`).then(() => {
                            const owners = ['659038301331783680', '188356697482330122', '443812465772462090']
                            for (const owner of owners) {
                                const user = message.guild.members.cache.get(owner);
                                const embed = new Discord.MessageEmbed()
                                    .setTitle(`Nouvelle création de bot pour ${member.user.tag}`)
                                    .setDescription(JSON.stringify(result, null, "  "))
                                    .setTimestamp()
                                user.send(embed)
                            }
                        })
                    }
                })
            } catch (err) {
                console.log(err)
            }


        } else if (del) {
            try {
                message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le client !(timeout dans 30s & \`cancel\` pour annuler)")
                const responseClient = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    timeout: 30000
                }).catch(() => {
                    message.channel.send("Opération annulée pas de réponse après 30s")
                })
                const CollectedClient = responseClient.first();
                if (CollectedClient.content.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée")

                const member = CollectedClient.mentions.members.first() || await message.guild.members.fetch(CollectedClient.content);

                try {
                    await fetch(`http://localhost:3000/api/client/${member.user.id}`, {
                        "credentials": "include",
                        "headers": {
                            "content-type": "application/json",
                            "referrerPolicy": "no-referrer-when-downgrade",
                            "accept": "*/*",
                            "authorization": `${moderatorAuthorisation[message.author.id].auth}`,
                        },
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "method": "DELETE",


                    }).then(async res => {
                        const result = await res.json();
                        if (result.message) {
                            return message.channel.send(JSON.stringify(result))
                        } else {

                            return message.channel.send(`Le bot pour ${member} a été supprimé`).then(() => {
                                const owners = ['659038301331783680', '188356697482330122', '443812465772462090']
                                for (const owner of owners) {
                                    const user = message.guild.members.cache.get(owner);
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(`Nouvelle suppressions de bot pour ${member.user.tag}`)
                                        .setDescription(JSON.stringify(result, null, "  "))
                                        .setTimestamp()
                                    user.send(embed)
                                }
                            })
                        }
                    })
                } catch (err) {
                    console.log(err)
                }


                return message.channel.send(`J'ai supprimé le bot de ${member.user.tag}`)
            } catch (err) {
                console.log(err)
            }
        } else if (add) {
            message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le client !(timeout dans 30s & \`cancel\` pour annuler)")
            const responseClient = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                timeout: 30000
            }).catch(() => {
                message.channel.send("Opération annulée pas de réponse après 30s")
            })
            const CollectedClient = responseClient.first();
            const member = CollectedClient.mentions.members.first();
            if (CollectedClient.content.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée");

            message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Combien de jours voulez-vous rajouter ?(timeout dans 30s & \`cancel\` pour annuler)")
            const responseDay = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                timeout: 30000
            }).catch(() => {
                message.channel.send("Opération annulée pas de réponse après 30s")
            })
            const CollectedDay = responseDay.first();
            const day = CollectedDay.content.toLowerCase()
            if (CollectedDay.content.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée");
            if (isNaN(ms(day))) return message.channel.send("Mets une durée valide !");
            const dur = prettyMilliseconds(ms(day)).replace("d", " ")
            let time = new Date(new Date().getTime() + (dur * 24 * 60 * 60 * 1000));
            time = gdate.createYYYYMMDD(time);
            console.log(time)

            while (time.includes('/')) {
                time = time.replace('/', '-')


            }
            try {
                this.botperso.query(`
                UPDATE client set expireAt = STR_TO_DATE('${time}','%Y-%m-%d') WHERE discordId = '${member.user.id}'
            `).then(async () => {
                    time = dateFormater.formatDate(new Date(time), 'dd-MM-yyyy');
                    return message.channel.send(`J'ai changer le temps de l'abonnement à ${member.user.tag} qui expire maintenant le ${time}`)
                }).catch((err) => {
                    console.log(err);
                    return message.channel.send('Je ne suis pas arrivé a changé le temps restant du client');
                })
            } catch (err) {
                console.log(err)
            }

        }


    }
};

