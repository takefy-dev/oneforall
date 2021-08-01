const moment = require('moment')
const { Intents } = require('discord.js')
require('dotenv').config();
const {OneForAll} = require('./structures/Client/OneForAll')

const { dev, botperso } = require('./config')
if(!dev && !botperso) {
    const Cluster = require("discord-hybrid-sharding");

    new OneForAll({
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        restTimeOffset: 0,
        shards: Cluster.data.SHARD_LIST,
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES],
        shardCount: Cluster.data.TOTAL_SHARDS
    })
}
else
    new OneForAll({partials:  ['MESSAGE', 'CHANNEL', 'REACTION'],  restTimeOffset: 0, intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES]})


require('events').EventEmitter.defaultMaxListeners = 0;
moment.locale('fr')