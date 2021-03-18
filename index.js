require('dotenv').config();
const StateManager = require('./utils/StateManager');
const guildCommandPrefixes = new Map();
require('events').EventEmitter.defaultMaxListeners = 0;
const { CommandHandler } = require('advanced-command-handler');
const Distube = require('distube');


CommandHandler.create({
    commandsDir: 'commands',
    eventsDir: 'events',
    prefix: '',
    owners: ['659038301331783680', '188356697482330122', '443812465772462090']
});
CommandHandler.launch({
    token: process.env.TOKEN,
    clientOptions: {
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        restTimeOffset: 0,
    },
});

const MySQL = require('mysql2');
const sql = MySQL.createConnection({
    host     : 'localhost',
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});
sql.connect( (err) => {
    if (err){
        console.error('Impossible to connect to MySQL server. Code: ' + err.code);
        process.exit(99); // stop the process if we can't connect to MySQL server
    } else {
        console.log('[SQL] Connected to the MySQL server! Connexion ID: ' + sql.threadId);
    }
});

// Create giveaways table
sql.query(`
	CREATE TABLE IF NOT EXISTS \`giveaways\`
	(
		\`id\` INT(1) NOT NULL AUTO_INCREMENT,
		\`message_id\` VARCHAR(64) NOT NULL,
		\`data\` LONGTEXT NOT NULL,
		PRIMARY KEY (\`id\`)
	);
`, (err) => {
    if (err) console.error(err);
    console.log('[SQL] Created table `giveaways`');
});

const { GiveawaysManager } = require('discord-giveaways');

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async refreshStorage() {
        // This should make all shard refreshing their cache with the updated database
        return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
    }
    // This function is called when the manager needs to get all the giveaway stored in the database.
    async getAllGiveaways(){
        return new Promise(function (resolve, reject) {
            sql.query('SELECT `data` FROM `giveaways`', (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                const giveaways = res.map((row) => JSON.parse(row.data));
                resolve(giveaways);
            });
        });
    }

    // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
    async saveGiveaway(messageID, giveawayData){
        return new Promise(function (resolve, reject) {
            sql.query('INSERT INTO `giveaways` (`message_id`, `data`) VALUES (?,?)', [messageID, JSON.stringify(giveawayData)], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    async editGiveaway(messageID, giveawayData){
        return new Promise(function (resolve, reject) {
            sql.query('UPDATE `giveaways` SET `data` = ? WHERE `message_id` = ?', [JSON.stringify(giveawayData), messageID], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageID){
        return new Promise(function (resolve, reject) {
            sql.query('DELETE FROM `giveaways` WHERE `message_id` = ?', messageID, (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
    }
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(CommandHandler.client, {
    storage: false, // Important - use false instead of a storage path
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        embedColor: '#7289da',
        reaction: '🎉'
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
CommandHandler.client.giveawaysManager = manager;

const distube= new Distube(CommandHandler.client, { searchSongs: true, leaveOnEmpty: true});
CommandHandler.client.music = distube;
CommandHandler.client.BotPerso = false

CommandHandler.client.isGuildOwner = require('./function/check/botOwner')

const logs = require('discord-logs');
logs(CommandHandler.client);
// Crea

StateManager.on('prefixFetched', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix)
})

StateManager.on('prefixUpdate', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix);
});
