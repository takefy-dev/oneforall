const moment = require('moment')
const express = require('express')

require('dotenv').config();
require('discord-reply')
const {OneForAll} = require('./structures/Client/OneForAll')
// Structures
// require('./structures/Managers/User');
// require('./structures/Managers/Guild');
// require('./structures/Managers/Member');
new OneForAll({partials:  ['MESSAGE', 'CHANNEL', 'REACTION'],  restTimeOffset: 0,})


require('events').EventEmitter.defaultMaxListeners = 0;
moment.locale('fr')
