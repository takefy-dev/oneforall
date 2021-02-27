const StateManager = require('../../utils/StateManager');
var checkOwner = require('../../function/check/botOwner')
const guildOwner = new Map();
const guildLang = new Map();
var langF = require('../../function/lang')
const {Command} = require('advanced-command-handler');
module.exports = new Command({
    name: 'setprefix',
    description: 'Change the prefix | Changer le prefix',
    // Optionnals :
    usage: '!setprefix <prefix>',
    category: 'moderation',
    tags: ['guildOnly'],
    clientPermissions: ['SEND_MESSAGES'],
    cooldown: 5
}, async(client, message, args) => {
    this.connection = StateManager.connection;
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)

    const sender = message.author.id;
    var isOwner = checkOwner(message.guild.id, sender);
    const owner = message.guild.ownerID;
    let owners = guildOwner.get(message.guild.id);
    const ownerTag = new Array();
    if(typeof owners != "object"){
        owners = owners.split(',')
    }else {
        owners = owners
    }
    for(var i = 0; i < owners.length - 1; i++){
        let ownerSS
            await message.guild.members.fetch().then((members) =>{
                ownerSS = members.get(owners[i])
            })
        const ownerList = ownerSS.user.tag;
        ownerTag.push(ownerList);

    }
    
    if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(lang.error.errorNoOwner(ownerTag))

    var regex = /^[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{1}$/igm;
    var isValid = regex.test(args[0]);
    if (!isValid) return message.channel.send(lang.setprefix.errorNoValid)

    const [cmdName, newPrefix] = message.content.split(" ");
    if (newPrefix) {
        try {
            await this.connection.query(
                `UPDATE guildConfig SET prefix = '${newPrefix}' WHERE guildId = '${message.guild.id}'`
            );
            message.channel.send(lang.setprefix.success(newPrefix));
            StateManager.emit('prefixUpdate', message.guild.id, newPrefix);
        } catch (err) {
            console.log(err);
            message.channel.send(lang.setprefix.errorSql(newPrefix));
        }
    } else {
        message.channel.send(lang.setprefix.errorNoArgs);
    }
});
StateManager.on('ownerUpdate', (guildId, data) =>{
    guildOwner.set(guildId, data);
  })
  StateManager.on('ownerFetched', (guildId, data) =>{
    guildOwner.set(guildId, data);
  
  })
langF(guildLang);
