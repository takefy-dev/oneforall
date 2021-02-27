const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
const {Command} = require('advanced-command-handler');
const lang = require('../../lang/fr');
module.exports = new Command({
    name: 'ping',
    description: 'Get the latency and ping of the bot',
    // Optionnals :
    usage: '!ping',
    clientPermissions: ['SEND_MESSAGES'],
    category: 'everyone',
    cooldown: 2
}, async(client, message, args) => {
    message.channel.send(lang.ping.pinging).then(m => {
        let ping = m.createdTimestamp - message.createdTimestamp; //calculate the ping of the bot
        //edit the message to the bot's ping and the ping to the API
        // :m.edit(`Latence du bot: \`${ping}\` ms, Latence de l'api: \`${Math.round(client.ws.ping)}\` ms`);
        m.edit(lang.ping.success(ping, client));
    })
});

embedsColor(guildEmbedColor);