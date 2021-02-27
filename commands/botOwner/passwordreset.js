const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const password = require('secure-random-password');
const bcrypt = require('bcryptjs');
const MySQL = require('mysql2/promise');
const BotPerso = require('../../utils/BotPerso');

// sql.connect( (err) => {
//     if (err){
//         process.exit(99); // stop the process if we can't connect to MySQL server
//     } else {
//         console.log('[SQL] Connected to the MySQL server! Connexion ID: ' + sql.threadId);
//     }
// });
module.exports = new Command({
    name: 'password',
    description: 'password manager',
    // Optionnals :
    usage: '!password ',
    category: 'botperso',
    userPermissions: [],
    clientPermissions: [],
    cooldown: 10
}, async (client, message, args) => {
    this.botperso = BotPerso.botperso;
    
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const reset = args[0] === 'reset';
    this.botperso.query(`SELECT * FROM client WHERE discordId = '${message.author.id}'`).then(async(result) =>{ 
        if (!result || result[0][0] == undefined) {
           return message.channel.send(lang.password.errorNotClient)
        }
        if (reset) {
            let pp;
            let reply = await message.channel.send(`${message.member}, ${lang.password.reply}`).then(async () => {
                let msgUSer = await message.member.send(lang.password.resetQ)
                const responseResetPdp = await msgUSer.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000, errors: ['time'] }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
                const CollectedPdp = responseResetPdp.first();
                if((!await bcrypt.compare(CollectedPdp.content, result[0][0].password))){
                    return message.member.send(lang.password.wrongPassword)
                }
                msgUser = await message.member.send(lang.password.newPasswordQ);
                const responseNewPdp = await msgUSer.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000, errors: ['time'] }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
                const CollectedNewPdp = responseNewPdp.first();
                pp = await bcrypt.hash(CollectedNewPdp.content, 8);
                this.botperso.query(`UPDATE client SET password = '${pp}' WHERE discordId = '${message.author.id}'`).then(() =>{
                    message.member.send(lang.password.successChange)
                })
                
                
                
            });
         
           
        }
    })
    


});

embedsColor(guildEmbedColor);
langF(guildLang);
