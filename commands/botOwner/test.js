const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command, getThing } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'test',
    description: 'test',
    // Optionnals :
    usage: 'test',
    category: 'test',
    tags: [],
    aliases: [],
    userPermissions: [],
    clientPermissions: [],
}, async (client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    await message.react('1️⃣')
    await sleep(100);
    await message.react('2️⃣')
    await sleep(100);
    await message.react('3️⃣')
    await sleep(100);
    await message.react('4️⃣')
    await sleep(100);
    await message.react('5️⃣')
    await sleep(100);
    await message.react('6️⃣')
    await sleep(100);
    await message.react('7️⃣')
    await sleep(100);
    await message.react('8️⃣')
    await sleep(100);
    await message.react('9️⃣')
    await sleep(100);
    await message.react('❌')
    await sleep(100)

    function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
});

embedsColor(guildEmbedColor);
langF(guildLang);
