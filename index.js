require('dotenv').config();
require('discord-reply')
const Client = require('./structures/Client/OneForAll')
// Structures
require('./structures/DiscordClasses/Guild');
require('./structures/DiscordClasses/Member');
require('./structures/DiscordClasses/User');
const client = new Client({partials:  ['MESSAGE', 'CHANNEL', 'REACTION'],  restTimeOffset: 0,})
require('events').EventEmitter.defaultMaxListeners = 0;

//
// const MySQL = require('mysql2');
// const sql = MySQL.createConnection({
//     host     : 'localhost',
//     user     : process.env.DB_USER,
//     password : process.env.DB_PASS,
//     database : process.env.DB_NAME
// });
// sql.connect( (err) => {
//     if (err){
//         console.error('Impossible to connect to MySQL server. Code: ' + err.code);
//         process.exit(99); // stop the process if we can't connect to MySQL server
//     } else {
//         console.log('[SQL] Connected to the MySQL server! Connexion ID: ' + sql.threadId);
//     }
// });
//
// // Create giveaways table
// sql.query(`
// 	CREATE TABLE IF NOT EXISTS \`giveaways\`
// 	(
// 		\`id\` INT(1) NOT NULL AUTO_INCREMENT,
// 		\`message_id\` VARCHAR(64) NOT NULL,
// 		\`data\` LONGTEXT NOT NULL,
// 		PRIMARY KEY (\`id\`)
// 	);
// `, (err) => {
//     if (err) console.error(err);
//     console.log('[SQL] Created table `giveaways`');
// });
//








