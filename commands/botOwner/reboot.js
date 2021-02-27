var checkOwner = require('../../function/check/botOwner')
const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
require('dotenv').config();
const {Command} = require('advanced-command-handler');
module.exports = new Command({
    name: 'reboot',
    description: 'reboot bot',
    category: 'botOwner',
    tags:['ownerOnly', "guildOnly"],
    ownerOnly: true,
    aliases: ['rb'],
}, async(client, message, args) => {
    await message.channel.send(`Je suis en train de redémarrer !`)
    process.exit()
   
});


embedsColor(guildEmbedColor);
