const moment = require('moment')
const express = require('express')

require('dotenv').config();
require('discord-reply')
const {OneForAll} = require('./structures/Client/OneForAll')
// Structures
// require('./structures/Managers/User');
// require('./structures/Managers/Guild');
// require('./structures/Managers/Member');
const { dev, botperso } = require('./config')
if(!dev && !botperso) {
    const Cluster = require("discord-hybrid-sharding");

    new OneForAll({
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        restTimeOffset: 0,
        shards: Cluster.data.SHARD_LIST,
        shardCount: Cluster.data.TOTAL_SHARDS
    })
}
else
    new OneForAll({partials:  ['MESSAGE', 'CHANNEL', 'REACTION'],  restTimeOffset: 0})


require('events').EventEmitter.defaultMaxListeners = 0;
moment.locale('fr')
