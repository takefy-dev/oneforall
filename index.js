const moment = require('moment')

require('dotenv').config();
require('discord-reply')
const Client = require('./structures/Client/OneForAll')
// Structures
require('./structures/DiscordClasses/User');
require('./structures/DiscordClasses/Guild');
require('./structures/DiscordClasses/Member');
const client = new Client({partials:  ['MESSAGE', 'CHANNEL', 'REACTION'],  restTimeOffset: 0,})


require('events').EventEmitter.defaultMaxListeners = 0;
moment.locale('fr')

