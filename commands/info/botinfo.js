const {version} = require('../../package.json'),
    {utc} = require('moment'),
    {version: djsversion} = require('discord.js'),
    os = require('os'),
    ms = require('ms'),
    Discord = require('discord.js')

module.exports = {

    name: 'botinfo',
    description: 'Get the information about the bot | Avoir les informations concernant le bot',
    category: 'info',
    clientPermissions: ['SEND_MESSAGES'],
    aliases: ['infobot', 'bot'],
    cooldown: 5,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const color = guildData.get('color')
        let guildArray;
        let guildCount;
        let channelArray;
        const takefy = await client.users.fetch('708047733994553344')
        const baby = await client.users.fetch('659038301331783680')
        const kpri = await client.users.fetch('295947937756872709')
        let userArray;
        await client.cluster.fetchClientValues("guilds.cache.size").then((res) => {
            guildArray = res
        });
        await client.cluster.fetchClientValues("channels.cache.size").then((res) => {
            channelArray = res
        });
        await client.cluster.broadcastEval('this.guilds.cache.filter(g => g.available).reduce((acc, guild) => acc + guild.memberCount, 0)')
            .then(results => {
                userArray = results.reduce((acc, memberCount) => acc + memberCount, 0)
            })
            .catch(console.error);
        const core = os.cpus()[0];
        const embedBot = new Discord.MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`${client.user.tag} <:online_il:786325180070625311>`)
            .setColor(color)
            .addField('<a:fleche:786340501531262977> **INFORMATIONS:**', [
                `Date de création: **${utc(client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}**`,
                `Developers: **${takefy.username}#${takefy.discriminator}, ${baby.username}#${baby.discriminator}, ${kpri.username}#${kpri.discriminator}**`,
                `Node.js: **${process.version}**`,
                `Version: **v${version}**`,
                `Discord.js: **v${djsversion}**`,
                `Bot Uptime: **${ms(client.uptime)}**`,
                '\u200b'
            ])
            .addField('<a:fleche:786340501531262977> **STATISTICS:**', [
                `Serveurs: **${guildArray.reduce((acc, guildCount) => acc + guildCount, 0).toLocaleString()}** `,
                `Users: **${userArray.toLocaleString()}**`,
                `Channels: **${channelArray.reduce((acc, channelCount) => acc + channelCount, 0).toLocaleString()}**`,
                '\u200b'
            ])
            .addField('<a:fleche:786340501531262977> **SYSTEM:**', [
                `Platforme: **${process.platform}**`,
                `Uptime: **${ms(os.uptime() * 1000, {long: true})}**`,
                `CPU:`,
                `\u3000 Coeurs: **${os.cpus().length}**`,
                `\u3000 Modèle: **${core.model}**`,
                `\u3000 Vitesse: **${core.speed}**MHz`,
            ])
            .setFooter(client.user.username)

            .setTimestamp();

        message.channel.send({embeds: [embedBot]});
    }
};

