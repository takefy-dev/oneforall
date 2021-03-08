const StateManager = require('../utils/StateManager');
const Discord = require('discord.js');
// const { client } = require('advanced-command-handler/classes/CommandHandler');
const { Event } = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'guildCreate',
	},
module.exports = async(handler, guild) => {
  this.connection = StateManager.connection;
  try {
    await this.connection.query(
      `INSERT INTO guilds VALUES('${guild.id}', '${guild.ownerID}')`
    );
    await this.connection.query(
      `INSERT INTO guildConfig (guildId, owner) VALUES ('${guild.id}', '${guild.ownerID}')`
    );
    
    await this.connection.query(
      `INSERT INTO antiraid (guildId) VALUES ('${guild.id}')`
    )
    await this.connection.query(
      `INSERT INTO antiraidconfig (guildId) VALUES ('${guild.id}')`
    )
    await this.connection.query(
      `INSERT INTO antiraidWlBp (guildId) VALUES ('${guild.id}')`
    )
    await this.connection.query(`INSERT INTO coinShop VALUES ('${guild.id}', '[${JSON.stringify({item: 'Rien dans le magasin', prix: undefined, role:undefined})}]')`)
    console.log(`Added to db.`)
  } catch(err) {
    console.log(err);
  }
  let guild1 = handler.client.guilds.cache.get(guild.id)
  const hook = new Discord.WebhookClient('803543245287456789', 'tLiyC7T52buVE2o84kXuk5fDNZTPmVY4xBNkicSmUglGfntnR654ab0CgEuCBokUbY8p');
  const embed = new Discord.MessageEmbed()
  .setTitle(`J'ai été ajouté a un nouveau serveur`)
  .setDescription(
    `<:778353230484471819:780727288903237663> Nom : **${guild1.name}**\n
     <:778353230589460530:780725963465687060> GuildId : **${guild1.id}**\n
     <:778353230383546419:781153631881265173> GuildCount : **${guild1.memberCount}**\n
     <:778353230383546419:781153631881265173> OnwerName : **<@${guild1.ownerID}>**\n
  `)
  
  hook.send(embed);

    await this.connection.query(
      `SELECT prefix FROM guildConfig WHERE guildId = '${guild.id}'`
    ).then(result => {
      const guildId = guild.id;
      const prefix = result[0][0].prefix;
      StateManager.emit('prefixFetched', guildId, prefix);
    }).catch(err => console.log(err));
    await this.connection.query(
      `SELECT lang FROM guildConfig WHERE guildId = '${guild.id}'`
    ).then(result => {
      const guildId = guild.id;
      const lang = result[0][0].lang;
      StateManager.emit('langUpdate', guildId, lang);
    }).catch(err => console.log(err));
    await this.connection.query(
      `SELECT owner FROM guildConfig WHERE guildId = '${guild.id}'`
    ).then(result => {
      const guildId = guild.id;
      const owner = result[0][0].owner;
      StateManager.emit('ownerFetched', guildId, owner);
    }).catch(err => console.log(err));
    await this.connection.query(`
			SELECT * FROM antiraidconfig WHERE guildId = '${guild.id}';
		`).then(result => {
			const guildAntiraidConfig = new Map();
			// console.log(result[0][0]);
			delete result[0][0].guildId
			StateManager.emit('antiraidConfF', guild.id, result[0][0])

		

			// guildAntiraidConfig.forEach((guild) =>{
			// 	delete guild.guildId
			// }) 
			// console.log(guildAntiraidConfig.get("790276124009168957"))
			

		}).catch(error => console.error(error))
    this.connection.query(`SELECT coinsOn, coinsLogs, streamBoost, muteDiviseur FROM guildConfig WHERE guildId = '${guild.id}'`).then(result => {
      if(result[0].length === 0) return;
      const enable = result[0][0].coinsOn === "1" ? true : false;
      console.log(enable)
      StateManager.emit('coinSettings', guild.id, {enable, logs : result[0][0].coinsLogs, streamBoost: result[0][0].streamBoost, muteDiviseur: result[0][0].muteDiviseur})
    })
    this.connection.query(`SELECT shop FROM coinShop WHERE guildId = '${guild.id}'`).then(res =>{
      if(res[0].length === 0) return;
      const shopArray =JSON.parse(res[0][0].shop)
      StateManager.emit('shopFetched', guild.id, shopArray)	
        
    })
})

