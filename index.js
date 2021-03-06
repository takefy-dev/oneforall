require('dotenv').config();
const StateManager = require('./utils/StateManager');
const guildCommandPrefixes = new Map();
const onlineId = new Map();
const onlineName = new Map();
const { execFile } = require('child_process');
require('events').EventEmitter.defaultMaxListeners = 0;
const { CommandHandler } = require('advanced-command-handler');
const counter = new Map();
const fetchCounter = require('./function/fetchCounter')

CommandHandler.create({
    commandsDir: 'commands',
    eventsDir: 'events',
    prefix: '',
    owners: ['659038301331783680', '188356697482330122', '443812465772462090', "679437160436465677"]
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
const { cpuUsage } = require('process');

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
CommandHandler.client.BotPerso = false

CommandHandler.client.isGuildOwner = require('./function/check/botOwner')

const logs = require('discord-logs');
logs(CommandHandler.client);
// CommandHandler.client.on("guildMemberRoleAdd", (member, role) => {
//     console.log(member.user.tag+" acquired the role: "+role.name);
//   });
// const detectExpire = execFile('python', ['D:\\Github\\DiscordBot\\OneForAll\\assets\\detectExpire.py'])
// detectExpire.stdout.on('data', (data) =>{
//     console.log(`run ${data}`)
// })
// detectExpire.stderr.on('data', (data) =>{
//     console.log(`err ${data}`)
// })

// client.guilds.cache.forEach(guild => {
//     setInterval(function () {
//         console.log("ee")
//         var onlineCount = guild.members.filter(m => m.presence.status === 'online' && m.presence.status === "dnd").size;
//         let name = onlineName.get(guild.id);
//         let onlineCh = client.guilds.cache.get(onlineId.get(guild.id));
//         onlineCh.setName(`${name} ${onlineCount}`).then((res) => {
//             console.log(res)
//         })
//     }, 5000)
// });




// StateManager.on('onlineCountChannelUpdate', (guildId, count) => {
//     onlineId.set(guildId, count)
// })
// StateManager.on('onlineCountChannelFetched', (guildId, count) => {
//     onlineId.set(guildId, count)
// })
// StateManager.on('memberOnlineNameUpdate', (guildId, name) => {
//     onlineName.set(guildId, name)
// })
// StateManager.on('memberOnlineNameFetched', (guildId, name) => {
//     onlineName.set(guildId, name)
// })
StateManager.on('prefixFetched', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix)
})

StateManager.on('prefixUpdate', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix);
});
