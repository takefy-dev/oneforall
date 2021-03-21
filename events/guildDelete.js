const StateManager = require('../utils/StateManager');
const Discord = require('discord.js')
const { Event } = require('advanced-command-handler');
module.exports = new Event(
	{
		name: 'guildDelete',
	},
module.exports = async(handler, guild) => {
  this.connection = StateManager.connection;
  if(guild.deleted) return;
  try {
    await this.connection.query(
      `DELETE FROM guilds WHERE guildId = '${guild.id}'`
    );
    await this.connection.query(
      `DELETE FROM guildConfig WHERE guildId = '${guild.id}'`
    );

    await this.connection.query(
      `DELETE FROM antiraid WHERE guildId = '${guild.id}'`
    )
    await this.connection.query(
      `DELETE FROM antiraidconfig WHERE guildId = '${guild.id}'`
    )
    await this.connection.query(
      `DELETE FROM antiraidWlBp WHERE guildId = '${guild.id}'`
    )
    await this.connection.query(`DELETE FROM coinShop WHERE guildId = '${guild.id}'`)

    console.log(`Deleted from db.`)
  } catch(err) {
    console.log(err);
  }

  
  const hook = new Discord.WebhookClient('803540682912038952', '7KhZEwqtJ3hZVWF1bGhuAuoSAzqju8e6V3Yv51wfvahtfChaUYhCtEn-Tbe5f7ErJNE6');
  const embed = new Discord.MessageEmbed()
  .setTitle(`J'ai été enlevé d'un nouveau serveur`)
  .setDescription(
    `<:778353230484471819:780727288903237663> Nom : **${guild.name}**\n
     <:778353230589460530:780725963465687060> GuildId : **${guild.id}**\n
     <:778353230383546419:781153631881265173> GuildCount : **${guild.memberCount}**\n
     <:778353230383546419:781153631881265173> OnwerName : **<@${guild.ownerID}>**\n
  `)
  
  hook.send(embed);
})

