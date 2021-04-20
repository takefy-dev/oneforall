const { Collection } = require('discord.js');
const config = require('./config')
const Client = require('./structures/Base')

require('./structures/Guild')
require('./structures/Member')
new Client()