const discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
var hexColorRegex = require('hex-color-regex');
const guildWlId = new Map();
var checkSetup = require('../../function/check/checkSetup');
var checkOwner = require('../../function/check/botOwner')
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
const guildOwner = new Map();

var langF = require('../../function/lang')
module.exports = new Command({
    name: 'setcolor',
    description: 'Change all embeds color of the bot in your server | Changer la couleur des embeds dans votre serveur',
    // Optionnals :
    usage: '!setcolor <HTML COLOR>',
    category: 'moderation',
    clientPermissions: ['SEND_MESSAGES'],
    tags: ['guildOnly'],
    cooldown: 5
}, async (client, message, args) => {
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)
    this.connection = StateManager.connection;
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
    const color = args[0];
    var checkColor = hexColorCheck(color);

    if (!color) return message.channel.send(lang.setcolor.noColor)
    if (color) {
        if (checkColor == true) {
            try {
                await this.connection.query(
                    `UPDATE guildConfig SET embedColors = '${color}' WHERE guildId = '${message.guild.id}'`
                );
                message.channel.send(lang.setcolor.success(color));
                const exampleEmbed = new discord.MessageEmbed()
                    .setColor(`${color}`)
                    .setDescription(lang.setcolor.successDescription)
                    .setTitle(lang.setcolor.titleDescription)
                message.channel.send(exampleEmbed);

                StateManager.emit('colorUpdate', message.guild.id, color);
            } catch (err) {
                console.log(err);
                message.channel.send(lang.setcolor.errorSql(color))
            }

        } else {
            message.channel.send(lang.setcolor.errorNoArgs)
        }
    }


});


function hexColorCheck(a) {
    var check = hexColorRegex().test(a);
    var checkVerify = false;
    if (check == true) {
        checkVerify = true;
    }
    return checkVerify;
}
StateManager.on('wlIdFetched', (guildId, wlId) => {
    guildWlId.set(guildId, wlId)
})
langF(guildLang);


StateManager.on('ownerUpdate', (guildId, data) => {
    guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) => {
    guildOwner.set(guildId, data);

})