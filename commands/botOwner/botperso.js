const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
const mysql = require('mysql2/promise');
const ms = require('ms');
const gdate = require('gdate')
require('dotenv').config();
const prettyMilliseconds = require('pretty-ms');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const dateFormater = require('pm-date-formater');
const { exec, execFile, } = require('child_process');
const process = require('process');
const password = require('secure-random-password');
const bcrypt = require('bcryptjs');
const BotPerso = require('../../utils/BotPerso');

module.exports = new Command({
    name: 'botperso',
    description: 'create bot perso',
    // Optionnals :
    usage: 'botperso create / remove',
    category: 'botOwner',
    tags:['ownerOnly', "guildOnly"],
    cooldown: 5
}, async (handler, message, args) => {
    this.botperso = BotPerso.botperso;

    const color = guildEmbedColor.get(message.guild.id);
    const create = args[0] == "create";
    const del = args[0] == "delete";
    const add = args[0] == "add"
 
    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = now.getFullYear();
    const today = yyyy + '-' + mm + '-' + dd;
    if (create) {
        const randomPassword = password.randomPassword({ length: 8})
        let hashPass = await bcrypt.hash(randomPassword, 8)
        message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le client !(timeout dans 30s & \`cancel\` pour annuler)")
        const responseClient = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
        const CollectedClient = responseClient.first();
        if (CollectedClient.content.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée")

        const member = CollectedClient.mentions.members.first() || await message.guild.members.fetch(CollectedClient.content);
        console.log(member.user.username)
        // message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le token du bot !(timeout dans 30s & \`cancel\` pour annuler)")
        // const responseToken = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
        // const CollectedToken = responseToken.first().content;
        // if (CollectedToken.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée");

        // message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne l'id du bot !(timeout dans 30s & \`cancel\` pour annuler)")
        // const responseId = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
        // const CollectedId = responseId.first().content;
        // if (CollectedToken.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée");
        // if(isNaN(CollectedId)) return await message.channel.send(`Une id est composé uniquement de chiffre..`)


        message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Veuillez écrire une durée de l'abonnement en jours !(timeout dans 30s & \`cancel\` pour annuler)")
        const responseTime = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
        const CollectedTime = responseTime.first().content.toLowerCase();

        if (CollectedTime == "cancel") return message.channel.send("L'opération a été annulée");
        if (isNaN(ms(CollectedTime))) return message.channel.send("Mets une durée valide !");
        const dur = prettyMilliseconds(ms(CollectedTime)).replace("d", " ")
       

        let time =new Date(new Date().getTime()+(dur*24*60*60*1000));
        time = gdate.createYYYYMMDD(time);
        console.log(time)

        while (time.includes('/')) {
            time = time.replace('/', '-')


        }
        time = dateFormater.formatDate(new Date(time), 'yyyy-MM-dd');
        console.log(time)
        try {
            this.botperso.query(`
                INSERT INTO client VALUES (${member.user.id}, '${member.user.username}', 'NULL', STR_TO_DATE('${today}','%Y-%m-%d'),  STR_TO_DATE('${time}','%Y-%m-%d'), '${hashPass}', '0', 'NULL', 'NULL')
            `).then(async () => {
                time = dateFormater.formatDate(new Date(time), 'dd-MM-yyyy');
                const order = execFile('python', ['D:\\Github\\DiscordBot\\OneForAll\\assets\\oder.py', `${member.user.id}`, `${member.user.username}`])
                order.stdout.on('data', (data) => {
                    console.log(data)
                    console.log(`Bot created`)
                })


                order.stderr.on('data', (data) => {
                    console.log(`err ${data}`)
                });


                return message.channel.send(`J'ai créer le bot pour ${member.user.tag} qui expire le ${time} et le mot de pass du client est **${randomPassword}**`)
            }).catch((err) => {
                console.log(err);
                return message.channel.send('Il y a déjà un client avec cet id la');
            })
        } catch (err) {
            console.log(err)
        }


    } else if (del) {
        try {
            message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le client !(timeout dans 30s & \`cancel\` pour annuler)")
            const responseClient = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
            const CollectedClient = responseClient.first();
            const member = CollectedClient.mentions.members.first();
            if (CollectedClient.content.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée")

            const order = execFile('python', ['D:\\Github\\DiscordBot\\OneForAll\\assets\\deleteOrder.py', `${member.user.id}`])
            order.stdout.on('data', (data) => {
                console.log(`Bot deleted`)
            })


            order.stderr.on('data', (data) => {
                console.log(`err ${data}`)
            });


            return message.channel.send(`J'ai supprimé le bot de ${member.user.tag}`)
        } catch (err) {
            console.log(err)
        }
    } else if (add) {
        message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le client !(timeout dans 30s & \`cancel\` pour annuler)")
        const responseClient = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
        const CollectedClient = responseClient.first();
        const member = CollectedClient.mentions.members.first();
        if (CollectedClient.content.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée");

        message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` Combien de jours voulez-vous rajouter ?(timeout dans 30s & \`cancel\` pour annuler)")
        const responseDay = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
        const CollectedDay = responseDay.first();
        const day = CollectedDay.content.toLowerCase()
        if (CollectedDay.content.toLowerCase() == "cancel") return message.channel.send("L'opération a été annulée");
        if (isNaN(ms(day))) return message.channel.send("Mets une durée valide !");
        const dur = prettyMilliseconds(ms(day)).replace("d", " ")
        let time =new Date(new Date().getTime()+(dur*24*60*60*1000));
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



});

embedsColor(guildEmbedColor);