
const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor')
var checkOwner = require('../../function/check/botOwner')
const guildOwner = new Map();
const { Menu } = require('discord.js-menu')
const { Command } = require('advanced-command-handler');
const hasVoted = require('../../function/check/hasVoteTopGg')

let antiraidConfig = new Object();
module.exports = new Command({
    name: 'antiraid',
    description: "Setup the antiraid | Configurer l'antiraid",
    // Optionnals :
    usage: '!antiraid',
    clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
    ownerOnly: false,
    category: 'owners',
    cooldown: 5
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    const color = guildEmbedColor.get(message.guild.id)

    const owner = message.guild.ownerID;
    const sender = message.author.id;
    var isOwner = checkOwner(message.guild.id, sender);
    let owners = guildOwner.get(message.guild.id);
    const ownerTag = new Array();
    if (typeof owners != "object") {
        owners = owners.split(',')
    } else {
        owners = owners
    }
    for (var i = 0; i < owners.length - 1; i++) {
        let ownerSS
        await message.guild.members.fetch().then((members) => {
            ownerSS = members.get(owners[i])
        })

        const ownerList = ownerSS.user.tag;
        ownerTag.push(ownerList);

    }

    if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(`<:720681441670725645:780539422479351809> \`ERREUR\` Seulement les owners peuvent executer cette commande \`(${ownerTag.join(",")})\`!`)
    let voted
    const votedF = await hasVoted(message.author.id).then((vote) => {
        if(vote == false) voted = false
        if(vote == true) voted = true
    })
    if(voted == false){
        return message.channel.send("<a:image0:789413382591348738> Pour débloquer cette fonctionnalitée vous devez voter sur notre page **top.gg** ! (https://top.gg/bot/780019344511336518/vote)")

    }
    const allOn = args[0] == "on";
    const config = args[0] == "config";
    const allOff = args[0] == 'off';
    const opti = args[0] == 'opti';
    const antiSpamOn = args[0] == "antispam" && args[1] == "on";
    const antiSpamOff = args[0] == "antispam" && args[1] == "off";
    const antilinkOff = args[0] == "antilink" && args[1] == "off";
    const antilinkOn = args[0] == "antilink" && args[1] == "on";
    const sanction = args[0] == 'sanction'
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Informations antiraid`, `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setColor(`${color}`)
            .setTimestamp()
            .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
            .setFooter("Informations antiraid", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .addField('<:778353230559969320:780778719824183316> Anti Raid:', `[\`antiraid on\`](https://discord.gg/WHPSxcQkVk) ・ Active entierement l'antiraid\n[\`antiraid off\`](https://discord.gg/WHPSxcQkVk)・ Desactive tout l'antiraid\n[\`antiraid config\`](https://discord.gg/WHPSxcQkVk)・Config antiraid\n[\`antiraid opti\`](https://discord.gg/WHPSxcQkVk)・Paramètres recommandés par notre équipe\n[\`antiraid antispam on\`](https://discord.gg/WHPSxcQkVk)・Activer l'antilink et l'antispam\n[\`antiraid antispam off\`](https://discord.gg/WHPSxcQkVk)・Désactiver l'antilink et l'antispam\n[\`setlogs\`](https://discord.gg/WHPSxcQkVk)・Definir les logs antiraid\n[\`wl add\`](https://discord.gg/WHPSxcQkVk)・Whitelist un membre\n[\`wl remove\`](https://discord.gg/WHPSxcQkVk)・Enlève un membre de la whitelist\n[\`wl list\`](https://discord.gg/WHPSxcQkVk)・Liste de toute(s) le(s) personne(s) whitelist`)
        message.channel.send(embed);
    }

    if (allOn) {

        await this.connection.query(`INSERT INTO antiraid VALUES ('${message.guild.id}','1', '1' , '1' , '1' , '1' , '1' , '1' , '1', '1', '1', '1', '1','1','1','1','1','1','1') ON DUPLICATE KEY UPDATE webhookCreate=1,roleCreate=1, roleUpdate=1, roleDelete=1, channelCreate=1, channelUpdate=1,channelDelete=1,spam=1,ban=1, bot=1 , roleAdd =1, antilink = 1,antiDeco = 1,antiKick = 1,antiDc = 1,nameUpdate=1,regionUpdate=1, vanityUpdate=1`)
            .then((result) => {
                message.channel.send("Tous les évênements ont été activés")
            })
        StateManager.emit('spamUpdate', message.guild.id, "1")


    } else if (allOff) {
        await this.connection.query(`INSERT INTO antiraid VALUES ('${message.guild.id}', '0', '0' , '0' , '0' , '0' , '0' , '0' , '0', '0', '0', '0', '0','0','0','0','0','0','0') ON DUPLICATE KEY UPDATE webhookCreate=0, roleCreate=0, roleUpdate=0, roleDelete=0, channelCreate=0, channelUpdate=0,channelDelete=0,spam=0,ban=0, bot=0, roleAdd =0, antilink = 0,antiDeco = 0,antiKick = 0,antiDc = 0,nameUpdate=0,regionUpdate=0, vanityUpdate=0`)
            .then(() => { message.channel.send("Tous les évênements ont été désactivé") })
        StateManager.emit('spamUpdate', message.guild.id, "0")

    } else if (opti) {
        await this.connection.query(`INSERT INTO antiraid VALUES ('${message.guild.id}','1', '1' , '1' , '1' , '1' , '1' , '1' , '1', '1', '1', '1', '1','1','1','1','1','1','1') ON DUPLICATE KEY UPDATE webhookCreate=1,roleCreate=1, roleUpdate=1, roleDelete=1, channelCreate=1, channelUpdate=1,channelDelete=1,spam=1,ban=1, bot=1 , roleAdd =1, antilink = 1,antiDeco = 1,antiKick = 1,antiDc = 1, regionUpdate=1,nameUpdate= 1,vanityUpdate=1 `).catch(err => console.log("d",err))
        StateManager.emit('spamUpdate', message.guild.id, "1")


        await this.connection.query(`INSERT INTO antiraidconfig VALUES ('${message.guild.id}','ban', 'unrank' , 'unrank' , 'unrank' , 'unrank' , 'ban' , 'unrank' , 'mute', 'kick', 'kick', 'unrank', 'unrank', 'unrank','5','3','1d','unrank','unrank','unrank','ban','Aucune') ON DUPLICATE KEY UPDATE webhookCreate='ban',roleCreate='unrank', roleUpdate='unrank', roleDelete='unrank', channelCreate='unrank', channelUpdate='ban',channelDelete='unrank',spam='mute',ban='kick', bot='kick' , roleAdd='unrank',antiDeco='unrank',antiKick='unrank',antiKickLimit='5', antiBanLimit='3',antiDcLimit='1d', antiDc='unrank',regionUpdate='unrank',nameUpdate='unrank',vanityUpdate='ban',vanityUpdateBypass='Aucune'`).then(async () => {
            await this.connection.query(`SELECT * FROM antiraidconfig WHERE guildId = '${message.guild.id}'`).then((res) =>{
                delete res[0][0].guildId;
                antiraidConfig = res[0][0]
            }).catch(err => console.log("dok",err))
            StateManager.emit('antiraidConfU', message.guild.id, antiraidConfig);
            StateManager.emit('antilinkUpdate', message.guild.id, "1")

        }).catch(err => {
            console.log("d", err)
        }) 

        await this.connection.query(`INSERT INTO antiraidWlBp VALUES ('${message.guild.id}','0', '1' , '1' , '0' , '1' , '0' , '1' , '1', '0', '1', '1', '1','1','1','1','0','0') ON DUPLICATE KEY UPDATE webhookCreate=0,roleCreate=1, roleUpdate=1, roleDelete=0, channelCreate=1, channelUpdate=0,channelDelete=1,spam=1,ban=0, bot=1 , roleAdd =1, antilink = 1, antiDeco=1, antiKick=1,regionUpdate='1',nameUpdate='0',vanityUpdate='0'`)
            .then(() => {
                message.channel.send("L'antiraid est configuré avec les paramètres optimisés ")
                StateManager.emit('spamUpdate', message.guild.id, "1")
            })
    } else if (antiSpamOn) {
        await this.connection.query(`UPDATE antiraid SET spam = '1' WHERE guildId = '${message.guild.id}'`)
            .then(() => {
                message.channel.send("L'antispam a été activé !")
            })
        StateManager.emit('spamUpdate', message.guild.id, "1")

    } else if (antiSpamOff) {
        await this.connection.query(`UPDATE antiraid SET spam = '0' WHERE guildId = '${message.guild.id}'`)
            .then(() => {
                message.channel.send("L'antispam a été désactivé !")
            })
        StateManager.emit('spamUpdate', message.guild.id, "0")
    } else if (antilinkOn) {
        await this.connection.query(`UPDATE antiraid SET antilink = '1' WHERE guildId = '${message.guild.id}'`)
            .then(() => {
                message.channel.send("L'antilink a été activé !")
                StateManager.emit('antilinkUpdate', message.guild.id, "1")

                
            })
      

    } else if (antilinkOff) {
        await this.connection.query(`UPDATE antiraid SET antilink = '0' WHERE guildId = '${message.guild.id}'`)
            .then(() => {
                message.channel.send("L'antilink a été désactivé !")
                StateManager.emit('antilinkUpdate', message.guild.id, "0")
            })
     
    }


    else if (config) {
        await this.connection.query(`SELECT * FROM antiraidconfig WHERE guildId = '${message.guild.id}'`).then((res) =>{
            delete res[0][0].guildId;
            antiraidConfig = res[0][0]
        })
        const type = args[1];
        const sanction = args[2];
        const all = args[1] == 'all'
     
        const guildconfig = await this.connection.query(`SELECT muteRoleId FROM guildConfig WHERE guildId = ${message.guild.id}`)
        const muteRoleId = guildconfig[0][0].muteRoleId;
        const sanctionFetched = await this.connection.query(`SELECT * FROM antiraidconfig WHERE guildId = ${message.guild.id}`)
        const webhookCreate = sanctionFetched[0][0].webhookCreate;
        const roleCreate = sanctionFetched[0][0].roleCreate;
        const roleUpdate = sanctionFetched[0][0].roleUpdate;
        const roleDelete = sanctionFetched[0][0].roleDelete;
        const channelCreate = sanctionFetched[0][0].channelCreate;
        const channelUpdate = sanctionFetched[0][0].channelUpdate;
        const channelDelete = sanctionFetched[0][0].channelDelete;
        const spam = sanctionFetched[0][0].spam;
        const ban = sanctionFetched[0][0].ban;
        const banLimit = sanctionFetched[0][0].antiBanLimit;
        const bot = sanctionFetched[0][0].bot;
        const roleAdd = sanctionFetched[0][0].roleAdd;
        const antiKick = sanctionFetched[0][0].antiKick;
        const antiKickLimit = sanctionFetched[0][0].antiKickLimit;
        const antiDeco = sanctionFetched[0][0].antiDeco;
        // const antiDecoLimit = sanctionFetched[0][0].antiDecoLimit;
        const antiDc = sanctionFetched[0][0].antiDc
        const antiDcLimit = sanctionFetched[0][0].antiDcLimit;
        const regionUpdate = sanctionFetched[0][0].regionUpdate;
        const vanityUpdate = sanctionFetched[0][0].vanityUpdate;
        const nameUpdate = sanctionFetched[0][0].nameUpdate;
        const vanityUpdateBypass = sanctionFetched[0][0].vanityUpdateBypass;

        const actifFetched = await this.connection.query(`SELECT * FROM antiraid WHERE guildId = ${message.guild.id}`);
        const webhookCreateOn = actifFetched[0][0].webhookCreate;
        const roleCreateOn = actifFetched[0][0].roleCreate;
        const roleUpdateOn = actifFetched[0][0].roleUpdate;
        const roleDeleteOn = actifFetched[0][0].roleDelete;
        const channelCreateOn = actifFetched[0][0].channelCreate;
        const channelUpdateOn = actifFetched[0][0].channelUpdate;
        const channelDeleteOn = actifFetched[0][0].channelDelete;
        const spamOn = actifFetched[0][0].spam;
        const banOn = actifFetched[0][0].ban;
        const botOn = actifFetched[0][0].bot;
        const roleAddOn = actifFetched[0][0].roleAdd;
        const antilinkOn = actifFetched[0][0].antilink;
        const antiKickOn = actifFetched[0][0].antiKick;
        const antiDecoOn = actifFetched[0][0].antiDeco;
        const antiDcOn = actifFetched[0][0].antiDc;
        const regionUpdateOn = actifFetched[0][0].regionUpdate;
        const vanityUpdateOn = actifFetched[0][0].vanityUpdate;
        const nameUpdateOn = actifFetched[0][0].nameUpdate;

        const wlFetched = await this.connection.query(`SELECT * FROM antiraidWlBp WHERE guildId = ${message.guild.id}`);
        const webhookCreateWl = wlFetched[0][0].webhookCreate;
        const roleCreateOnWl = wlFetched[0][0].roleCreate;
        const roleUpdateOnWl = wlFetched[0][0].roleUpdate;
        const roleDeleteOnWl = wlFetched[0][0].roleDelete;
        const channelCreateWl = wlFetched[0][0].channelCreate;
        const channelUpdateWl = wlFetched[0][0].channelUpdate;
        const channelDeleteWl = wlFetched[0][0].channelDelete;
        const spamWl = wlFetched[0][0].spam;
        const banWl = wlFetched[0][0].ban;
        const botWl = wlFetched[0][0].bot;
        const roleAddWl = wlFetched[0][0].roleAdd;
        const antilinkWl = wlFetched[0][0].antilink;
        const antiKickWl = wlFetched[0][0].antiKick;
        const antiDecoWl = wlFetched[0][0].antiDeco;
        const regionUpdateWl = wlFetched[0][0].regionUpdate;
        const vanityUpdateWl = wlFetched[0][0].vanityUpdate;
        const nameUpdateWl = wlFetched[0][0].nameUpdate;


        let isOnWbCr;
        let isOnRlCr;
        let isOnRlUp;
        let isOnRlDel;
        let isOnChCr;
        let isOnChUp;
        let isOnChDel;
        let isOnSpam;
        let isOnBan;
        let isOnBot;
        let isOnroleAdd;
        let isOnAntilink;
        let isOnAntikick;
        let isOnAntideco;
        let isOnAntidc;
        let isOnRegionUpdate;
        let isOnNameUpdate;
        let isOnVanityUpdate;

        if (webhookCreateOn == "1") { isOnWbCr = '<:778348494712340561:781153837850820619>' }
        if (roleCreateOn == "1") { isOnRlCr = '<:778348494712340561:781153837850820619>' }
        if (roleUpdateOn == "1") { isOnRlUp = '<:778348494712340561:781153837850820619>' }
        if (roleDeleteOn == "1") { isOnRlDel = '<:778348494712340561:781153837850820619>' }
        if (channelCreateOn == "1") { isOnChCr = '<:778348494712340561:781153837850820619>' }
        if (channelUpdateOn == "1") { isOnChUp = '<:778348494712340561:781153837850820619>' }
        if (channelDeleteOn == "1") { isOnChDel = '<:778348494712340561:781153837850820619>' }
        if (spamOn == "1") { isOnSpam = '<:778348494712340561:781153837850820619>' }
        if (banOn == "1") { isOnBan = '<:778348494712340561:781153837850820619>' }
        if (botOn == "1") { isOnBot = '<:778348494712340561:781153837850820619>' }
        if (roleAddOn == "1") { isOnroleAdd = '<:778348494712340561:781153837850820619>' }
        if (antilinkOn == "1") { isOnAntilink = '<:778348494712340561:781153837850820619>' }
        if (antiKickOn == "1") { isOnAntikick = '<:778348494712340561:781153837850820619>' }
        if (antiDecoOn == "1") { isOnAntideco = '<:778348494712340561:781153837850820619>' }
        if (antiDcOn == "1") { isOnAntidc = '<:778348494712340561:781153837850820619>' }
        if (regionUpdateOn == "1") { isOnRegionUpdate = '<:778348494712340561:781153837850820619>' }
        if (nameUpdateOn == "1") { isOnNameUpdate = '<:778348494712340561:781153837850820619>' }
        if (vanityUpdateOn == "1") { isOnVanityUpdate = '<:778348494712340561:781153837850820619>' }
        if (webhookCreateOn == "0") { isOnWbCr = '<:778348495157329930:781189773645578311>' }
        if (roleCreateOn == "0") { isOnRlCr = '<:778348495157329930:781189773645578311>' }
        if (roleUpdateOn == "0") { isOnRlUp = '<:778348495157329930:781189773645578311>' }
        if (roleDeleteOn == "0") { isOnRlDel = '<:778348495157329930:781189773645578311>' }
        if (channelCreateOn == "0") { isOnChCr = '<:778348495157329930:781189773645578311>' }
        if (channelUpdateOn == "0") { isOnChUp = '<:778348495157329930:781189773645578311>' }
        if (channelDeleteOn == "0") { isOnChDel = '<:778348495157329930:781189773645578311>' }
        if (spamOn == "0") { isOnSpam = '<:778348495157329930:781189773645578311>' }
        if (banOn == "0") { isOnBan = '<:778348495157329930:781189773645578311>' }
        if (botOn == "0") { isOnBot = '<:778348495157329930:781189773645578311>' }
        if (roleAddOn == "0") { isOnroleAdd = '<:778348495157329930:781189773645578311>' }
        if (antilinkOn == "0") { isOnAntilink = '<:778348495157329930:781189773645578311>' }
        if (antiKickOn == "0") { isOnAntikick = '<:778348495157329930:781189773645578311>' }
        if (antiDecoOn == "0") { isOnAntideco = '<:778348495157329930:781189773645578311>' }
        if (antiDcOn == "0") { isOnAntidc = '<:778348495157329930:781189773645578311>' }
        if (regionUpdateOn == "0") { isOnRegionUpdate = '<:778348495157329930:781189773645578311>' }
        if (vanityUpdateOn == "0") { isOnVanityUpdate = '<:778348495157329930:781189773645578311>' }
        if (nameUpdateOn == "0") { isOnNameUpdate = '<:778348495157329930:781189773645578311>' }
        
        let isOnWlWbCr;
        let isOnWlRlCr;
        let isOnWlRlUp;
        let isOnWlRlDel;
        let isOnWlChCr;
        let isOnWlChUp;
        let isOnWlChDel;
        let isOnWlSpam;
        let isOnWlBan;
        let isOnWlBot;
        let isOnWlroleAdd;
        let isOnWlAntilink;
        let isOnWlAntideco;
        let isOnWlAntikick;
        let isOnWlRegionUpdate;
        let isOnWlNameUpdate;
        let isOnWlVanityUpdate;

        if (webhookCreateWl == "1") { isOnWlWbCr = 'Oui' }
        if (roleCreateOnWl == "1") { isOnWlRlCr = 'Oui' }
        if (roleUpdateOnWl == "1") { isOnWlRlUp = 'Oui' }
        if (roleDeleteOnWl == "1") { isOnWlRlDel = 'Oui' }
        if (channelCreateWl == "1") { isOnWlChCr = 'Oui' }
        if (channelUpdateWl == "1") { isOnWlChUp = 'Oui' }
        if (channelDeleteWl == "1") { isOnWlChDel = 'Oui' }
        if (spamWl == "1") { isOnWlSpam = 'Oui' }
        if (banWl == "1") { isOnWlBan = 'Oui' }
        if (botWl == "1") { isOnWlBot = 'Oui' }
        if (roleAddWl == "1") { isOnWlroleAdd = 'Oui' }
        if (antilinkWl == "1") { isOnWlAntilink = 'Oui' }
        if (antiDecoWl == "1") { isOnWlAntideco = 'Oui' }
        if (antiKickWl == "1") { isOnWlAntikick = 'Oui' }
        if (regionUpdateWl == "1") { isOnWlRegionUpdate = 'Oui' }
        if (vanityUpdateWl == "1") { isOnWlNameUpdate = 'Oui' }
        if (nameUpdateWl == "1") { isOnWlVanityUpdate = 'Oui' }

        if (webhookCreateWl == "0") { isOnWlWbCr = 'Non' }
        if (roleCreateOnWl == "0") { isOnWlRlCr = 'Non' }
        if (roleUpdateOnWl == "0") { isOnWlRlUp = 'Non' }
        if (roleDeleteOnWl == "0") { isOnWlRlDel = 'Non' }
        if (channelCreateWl == "0") { isOnWlChCr = 'Non' }
        if (channelUpdateWl == "0") { isOnWlChUp = 'Non' }
        if (channelDeleteWl == "0") { isOnWlChDel = 'Non' }
        if (spamWl == "0") { isOnWlSpam = 'Non' }
        if (banWl == "0") { isOnWlBan = 'Non' }
        if (botWl == "0") { isOnWlBot = 'Non' }
        if (roleAddWl == "0") { isOnWlroleAdd = 'Non' }
        if (antilinkWl == "0") { isOnWlAntilink = 'Non' }
        if (antiKickWl == "0") { isOnWlAntikick = 'Non' }
        if (antiDecoWl == "0") { isOnWlAntideco = 'Non' }
        if (regionUpdateWl == "0") { isOnWlRegionUpdate = 'Non' }
        if (vanityUpdateWl == "0") { isOnWlNameUpdate = 'Non' }
        if (nameUpdateWl == "0") { isOnWlVanityUpdate = 'Non' }




        // let tdata = await message.channel.send(`Chargement ... <a:2366_Loading_Pixels:784472554328555571>`)

        let p1 = new Discord.MessageEmbed();
        p1.setTitle(`<a:3770_this_animated_right:783432503854759936>__Configuration des évènements__ (__15__)`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
            .setDescription(`
            1 ・**WEBHOOK_CREE**\n
            Actif : **${isOnWbCr}**
            Sanction: **${webhookCreate}**
            Whitelist bypass : **${isOnWlWbCr}**
            
            2・**ROLE_CREE**\n
            Actif : **${isOnRlCr}**
            Sanction: **${roleCreate}**
            Whitelist bypass : **${isOnWlRlCr}**

            3・**ROLE_MODIFIE**\n
            Actif : **${isOnRlUp}**
            Sanction: **${roleUpdate}**
            Whitelist bypass : **${isOnWlRlUp}**

            4・**ROLE_SUPPRIME**\n
            Actif : **${isOnRlDel}**
            Sanction: **${roleDelete}**
            Whitelist bypass : **${isOnWlRlDel}**

            5・**ANTI_MASSBAN**\n
            Actif : **${isOnBan}**
            Sanction: **${ban}**
            Whitelist bypass : **${isOnWlBan}**
            Limite avant la sanction : **${banLimit}**

            6・**ANTI_ROLE_ADD**\n
            Actif : **${isOnroleAdd}**
            Sanction: **${roleAdd}**
            Whitelist bypass : **${isOnWlroleAdd}**
            
            Page 1 / 3
            `)
        let p2 = new Discord.MessageEmbed()

        p2.setDescription(`
                    1 ・**CHANNEL_CREE**\n
                    Actif : **${isOnChCr}**
                    Sanction: **${channelCreate}**
                    Whitelist bypass : **${isOnWlChCr}**

                    2 ・**CHANNEL_MODIFIE**\n
                    Actif : **${isOnChUp}**
                    Sanction: **${channelUpdate}**
                    Whitelist bypass : **${isOnWlChUp}**
                    
                    3 ・**CHANNEL_SUPPRIME**\n
                    Actif : **${isOnChDel}**
                    Sanction: **${channelDelete}**
                    Whitelist bypass : **${isOnWlChDel}**
                    
                    4・**ANTI_SPAM**\n
                    Actif : **${isOnSpam}**
                    Sanction: **${spam}**
                    Rôle muet : **<@&${muteRoleId}>**
                    Whitelist bypass : **${isOnWlSpam}**
                    

                    5・**ANTI_BOT**\n
                    Actif : **${isOnBot}**
                    Sanction: **${bot}**
                    Whitelist bypass : **${isOnWlBot}**

                    6・**ANTI_INVITE**\n
                    Actif : **${isOnAntilink}**
                    Sanction: **Supprime le message**
                    Whitelist bypass : **${isOnWlAntilink}**
                    
                    Page 2 / 3
                    `)
            .setTitle(`<a:3770_this_animated_right:783432503854759936>__Configuration des évènements__ (__15__)`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
        let p3 = new Discord.MessageEmbed()
        p3.setDescription(`
                        1 ・**ANTI_KICK**\n
                        Actif : **${isOnAntikick}**
                        Sanction: **${antiKick}**
                        Whitelist bypass : **${isOnWlAntikick}**
                        Limite avant la sanction : **${antiKickLimit}**

                        2 ・**ANTI_VOICE_DECO**\n
                        Actif : **${isOnAntideco}**
                        Sanction: **${antiDeco}**
                        Whitelist bypass : **${isOnWlAntideco}**
                       

                        3 ・**ANTI_DOUBLE_COMPTE**\n
                        Actif : **${isOnAntidc}**
                        Sanction: **${antiDc}**
                        Limit avant la sanction du compte : **${antiDcLimit}**

                        4 ・**ANTI_MODIFICATION_REGION**\n
                        Actif : **${isOnRegionUpdate}**
                        Sanction: **${regionUpdate}**
                        Whitelist bypass : **${isOnWlRegionUpdate}**

                        5 ・**ANTI_MODIFICATION_NOM**\n
                        Actif : **${isOnNameUpdate}**
                        Sanction: **${nameUpdate}**
                        Whitelist bypass : **${isOnWlNameUpdate}**

                        6 ・**ANTI_MODIFICATION_URL_PERSONNALISE**\n
                        Actif : **${isOnVanityUpdate}**
                        Sanction: **${vanityUpdate}**
                        Whitelist bypass : **${isOnWlVanityUpdate}**
                        Url a évité : **${vanityUpdateBypass}**
                      
                        
                        
                        Page 3 / 3
                        `)
            .setTitle(`<a:3770_this_animated_right:783432503854759936>__Configuration des évènements__ (__15__)`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
        let webhookEmbed = new Discord.MessageEmbed()
        webhookEmbed.setDescription(`
            \n
            Retouner à la page précédente : ↩
            Modifier l'activité : 1️⃣
            Modifier la sanction : 2️⃣
            Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**WEBHOOK_CREE**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`)
        let roleCreeEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**ROLE_CREE**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let roleEditEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**ROLE_MODIFIE**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let roleDeleteEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**ROLE_SUPPRIME**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiBanEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
                Modifier la limite avant d'éxécuter la sanction : 4️⃣
            `)
            .setTitle(`**ANTI_BAN**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiRoleAddEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**ANTI_ROLE_ADD**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let channelCreeEmed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**CHANNEL_CREE**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let channelEditEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**CHANNEL_MODIFIE**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let channelDeleteEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**CHANNEL_SUPPRIME**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let spamEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier le rôle muet : 3️⃣
                Modifier whitelist by pass : 4️⃣
            `)
            .setTitle(`**ANTI_SPAM**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiBotEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
            `)
            .setTitle(`**ANTI_BOT**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiInvEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier whitelist by pass : 2️⃣
            `)
            .setTitle(`**ANTI_INVITE**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiKickEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
                Modifier la limite avant d'éxécuter la sanction : 4️⃣

            `)
            .setTitle(`**ANTI_KICK**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiDecoEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣

            `)
            .setTitle(`**ANTI_DECONNEXION_VOCAL**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiDcEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier la limite avant d'éxécuter la sanction : 3️⃣

            `)
            .setTitle(`**ANTI_DOUBLE_COMPTE**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        
        let antiRegionUpdateEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣

            `)
            .setTitle(`**ANTI_MODIFICATION_REGION**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiNameUpdateEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣

            `)
            .setTitle(`**ANTI_MODIFICATION_NOM**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);
        let antiVanityUpdateEmbed = new Discord.MessageEmbed()
            .setDescription(`
                \n
                Retouner à la page précédente : ↩
                Modifier l'activité : 1️⃣
                Modifier la sanction : 2️⃣
                Modifier whitelist by pass : 3️⃣
                Modifier l'url a évité : 4️⃣

            `)
            .setTitle(`**ANTI_MODIFICATION_URL_PERSONNALISE**`)
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter("Antiraid Config", `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588`);

        let antiraidConfigMenu = new Menu(message.channel, message.author.id, [
            {
                name: "p1",
                content: p1,
                reactions: {
                    '⬅': 'p3',
                    '1️⃣': 'webhook',
                    '2️⃣': 'roleCree',
                    '3️⃣': 'roleModif',
                    '4️⃣': 'roleDelete',
                    '5️⃣': 'antiBan',
                    '6️⃣': 'antiRoleAdd',

                    '➡': 'p2',
                    '❌': 'delete'

                }
            },
            {
                name: 'webhook',
                content: webhookEmbed,
                reactions: {
                    '↩': 'p1',
                    '1️⃣': async () => {

                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbCr = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbCr = responseWbCr.first()
                        const lowercase = CollectedWbCr.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                    UPDATE antiraid SET webhookCreate = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbCr.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                    UPDATE antiraid SET webhookCreate = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbCr.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                    UPDATE antiraidconfig SET webhookCreate = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                antiraidConfig.webhookCreate = lowercase;
                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {

                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET webhookCreate = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET webhookCreate = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`oui / non\``)
                        }
                    },

                }
            },

            {
                name: 'roleCree',
                content: roleCreeEmbed,
                reactions: {
                    '↩': 'p1',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                UPDATE antiraid SET roleCreate = '1' WHERE guildId = '${message.guild.id}' 
                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                UPDATE antiraid SET roleCreate = '0' WHERE guildId = '${message.guild.id}' 
                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                UPDATE antiraidconfig SET roleCreate = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                            `).then(() => {
                                antiraidConfig.roleCreate = lowercase;
                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {

                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                UPDATE antiraidWlBp SET roleCreate = '1' WHERE guildId = '${message.guild.id}' 
                            `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                UPDATE antiraidWlBp SET roleCreate = '0' WHERE guildId = '${message.guild.id}' 
                            `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }

                    },
                }



            },
            {
                name: 'roleModif',
                content: roleEditEmbed,
                reactions: {
                    '↩': 'p1',
                    '1️⃣': async () => {

                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                    UPDATE antiraid SET roleUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {

                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                    UPDATE antiraid SET roleUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                    UPDATE antiraidconfig SET roleUpdate = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                antiraidConfig.roleUpdate = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {

                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET roleUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET roleUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },

                }
            },
            {
                name: 'roleDelete',
                content: roleDeleteEmbed,
                reactions: {
                    '↩': 'p1',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                    UPDATE antiraid SET roleDelete = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {

                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                    UPDATE antiraid SET roleDelete = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                    UPDATE antiraidconfig SET roleDelete = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                antiraidConfig.roleDelete = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET roleDelete = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET roleDelete = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },

                }
            },
            {
                name: 'antiBan',
                content: antiBanEmbed,
                reactions: {
                    '↩': 'p1',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET ban = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET ban = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET ban = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.ban = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET ban = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET ban = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '4️⃣': async () => {


                        let q = await message.channel.send("Quelle est la limite de bannissement avant d'éxécuter la sanction ?(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (!isNaN(lowercase)) {
                            await this.connection.query(`UPDATE antiraidconfig SET antiBanLimit = '${lowercase}' WHERE guildId = '${message.guild.id}'`).then(() => {
                                antiraidConfig.antiBanLimit = lowercase
                                message.channel.send(`La limite de bannissement est maintenant définie pour \`${lowercase}\``)
                                q.delete();
                                CollectedWbSanc.delete()
                            });
                        }
                        else if (lowercase == "cancel") {
                            let error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else if (isNaN(lowercase)) {
                            message.channel.send(`Vous devez uniquement entrer \`des nombres\``)
                        }
                    },

                }
            },
            {
                name: 'antiRoleAdd',
                content: antiRoleAddEmbed,
                reactions: {
                    '↩': 'p1',
                    '1️⃣': async () => {
                        let q = await message.channel.send("L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                    UPDATE antiraid SET roleAdd = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                    UPDATE antiraid SET roleAdd = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                    UPDATE antiraidconfig SET roleAdd = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                antiraidConfig.roleAdd = lowercase;
                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET roleAdd = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET roleAdd = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },

                }
            },

            {
                name: "p2",
                content: p2,
                reactions: {
                    '⬅': 'p1',
                    '1️⃣': 'channelCr',
                    '2️⃣': 'channelEdit',
                    '3️⃣': 'channelDelete',
                    '4️⃣': 'antiSpam',
                    '5️⃣': 'antiBot',
                    '6️⃣': 'antiInv',
                    '➡': 'p3',
                    '❌': 'delete'
                }
            },
            {
                name: 'channelCr',
                content: channelCreeEmed,
                reactions: {
                    '↩': 'p2',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbCr = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbCr = responseWbCr.first()
                        const lowercase = CollectedWbCr.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                        UPDATE antiraid SET channelCreate = '1' WHERE guildId = '${message.guild.id}' 
                                                    `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbCr.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                        UPDATE antiraid SET channelCreate = '0' WHERE guildId = '${message.guild.id}' 
                                                    `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbCr.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {


                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET channelCreate = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.channelCreate = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET channelCreate = '1' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET channelCreate = '0' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }

                    },

                }
            },

            {
                name: 'channelEdit',
                content: channelEditEmbed,
                reactions: {
                    '↩': 'p2',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbUp = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbUp = responseWbUp.first()
                        const lowercase = CollectedWbUp.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET channelUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbUp.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET channelUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                        UPDATE antiraidconfig SET channelUpdate = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                                    `).then(() => {
                                antiraidConfig.channelUpdate = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {

                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET channelUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET channelUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                }



            },
            {
                name: 'channelDelete',
                content: channelDeleteEmbed,
                reactions: {
                    '↩': 'p2',
                    '1️⃣': async () => {

                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET channelDelete = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET channelDelete = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET channelDelete = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.channelDelete = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {

                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET channelDelete = '1' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET channelDelete = '0' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },

                }
            },
            {
                name: 'antiSpam',
                content: spamEmbed,
                reactions: {
                    '↩': 'p2',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET spam = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                                StateManager.emit('spamUpdate', message.guild.id, '1')
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET spam = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                                StateManager.emit('spamUpdate', message.guild.id, '0')
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },

                    '2️⃣': async () => {


                        let q = await message.channel.send("Quelle est le role muet ? (`\mention`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseRole = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedRole = responseRole.first()
                        const lowercase = CollectedRole.content.toLowerCase()


                        const muteRole = CollectedRole.mentions.roles.first();
                        const mureRoleId = muteRole.id;
                        if (lowercase != "cancel" && muteRole) {
                            await this.connection.query(`
                                                UPDATE guildConfig SET muteRoleId = '${mureRoleId}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send(`Le role à été mis à jour pour \`${muteRole}\` `)
                                q.delete();
                                CollectedRole.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`mention le role mute / cancel\``)
                        }
                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET spam = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET spam = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },

                }
            },
            {
                name: 'antiBot',
                content: antiBotEmbed,
                reactions: {
                    '↩': 'p2',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                        UPDATE antiraid SET bot = '1' WHERE guildId = '${message.guild.id}' 
                                                    `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                        UPDATE antiraid SET bot = '0' WHERE guildId = '${message.guild.id}' 
                                                    `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET bot = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.bot = lowercase;
                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send("Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET bot = '1' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET bot = '0' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }

                    },



                }
            },
            {
                name: 'antiInv',
                content: antiInvEmbed,
                reactions: {
                    '↩': 'p2',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET antilink = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET antilink = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {
                        let q = await message.channel.send("Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET antilink = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET antilink = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },


                }
            },


            {
                name: "p3",
                content: p3,
                reactions: {
                    '⬅': 'p2',
                    '1️⃣': 'antiKick',
                    '2️⃣': 'antiDeco',
                    '3️⃣': 'antiDc',
                    '4️⃣': 'antiRegion',
                    '5️⃣': 'antiName',
                    '6️⃣': 'antiVanity',


                    '➡': 'p1',
                    '❌': 'delete'
                }
            },
            {
                name: "antiKick",
                content: antiKickEmbed,
                reactions: {
                    '↩': 'p3',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET antiKick = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET antiKick = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET antiKick = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.antiKick = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET antiKick = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET antiKick = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '4️⃣': async () => {


                        let q = await message.channel.send("Quelle est la limite de execlusion avant d'éxécuter la sanction ?(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (!isNaN(lowercase)) {
                            await this.connection.query(`UPDATE antiraidconfig SET antiKickLimit = '${lowercase}' WHERE guildId = '${message.guild.id}'`).then(() => {
                                antiraidConfig.antiKickLimit = lowercase
                                message.channel.send(`La limite de execlusion est maintenant définie pour \`${lowercase}\``)
                                q.delete();
                                CollectedWbSanc.delete()
                            });
                        }
                        else if (lowercase == "cancel") {
                            let error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else if (isNaN(lowercase)) {
                            message.channel.send(`Vous devez uniquement entrer \`des nombres\``)
                        }
                    },

                }
            },
            {
                name: "antiDeco",
                content: antiDecoEmbed,
                reactions: {
                    '↩': 'p3',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET antiDeco = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                StateManager.emit('antiDecoUp', message.guild.id, '1')
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET antiDeco = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                StateManager.emit('antiDecoUp', message.guild.id, '0')

                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET antiDeco = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.antiDeco = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET antiDeco = '1' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                StateManager.emit('antiDecoUpdate', message.guild.id, '1')

                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                    UPDATE antiraidWlBp SET antiDeco = '0' WHERE guildId = '${message.guild.id}' 
                                `).then(() => {
                                StateManager.emit('antiDecoUpdate', message.guild.id, '0')
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }

                    },
                   
                    

                }
            },
            {
                name: "antiDc",
                content: antiDcEmbed,
                reactions: {
                    '↩': 'p3',
                    '1️⃣': async () => {
                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET antiDc = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET antiDc = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }

                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET antiDc = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.antiDc = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / cancel\``)
                        }

                    },
                    '3️⃣': async () => {


                        let q = await message.channel.send("Quelle est la limite de la création de compte avant d'éxécuter la sanction ?(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()


                        let response;
                        if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        }
                        if (isNaN(lowercase[0])) return message.channel.send(`Mauvaise syntaxe \`1s/1m/2h/2d\``)
                        // console.log(!lowercase.endsWith('s') && !lowercase.endsWith('m') && !lowercase.endsWith('h') && !lowercase.endsWith('d'))

                        if (!lowercase.endsWith('s') && !lowercase.endsWith('m') && !lowercase.endsWith('h') && !lowercase.endsWith('d')) return message.channel.send(`Mauvaise syntaxe \`1s/1m/2h/2d\``)
                        if (lowercase.endsWith('s')) {
                            if (lowercase.startsWith('1')) {
                                response = lowercase.replace('s', ' second')
                            } else {
                                response = lowercase.replace('s', ' seconds')

                            }
                        } else if (lowercase.endsWith('m')) {
                            if (lowercase.startsWith('1')) {
                                response = lowercase.replace('m', ' minute')
                            } else {
                                response = lowercase.replace('m', ' minutes')

                            }
                        } else if (lowercase.endsWith('h')) {
                            if (lowercase.startsWith('1')) {
                                response = lowercase.replace('h', ' hour')
                            } else {
                                response = lowercase.replace('h', ' hours')

                            }
                        } else if (lowercase.endsWith('d')) {
                            if (lowercase.startsWith('1')) {
                                response = lowercase.replace('d', ' day')
                            } else {
                                response = lowercase.replace('d', ' days')
                            }
                        }
                        await this.connection.query(`UPDATE antiraidconfig SET antiDcLimit = '${response}' WHERE guildId = '${message.guild.id}'`).then(() => {
                            antiraidConfig.antiDcLimit = lowercase;
                            message.channel.send(`La limite de la création de compte est maintenant définie pour \`${lowercase}\``)
                            q.delete();
                            CollectedWbSanc.delete()
                        });

                        if (lowercase == "cancel") {
                            let error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        }

                    },

                }
            },
            {
                name: 'antiRegion',
                content: antiRegionUpdateEmbed,
                reactions: {
                    '↩': 'p3',
                    '1️⃣': async () => {

                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET regionUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET regionUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET regionUpdate = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.regionUpdate = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {

                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET regionUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET regionUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                }
            },
            {
                name: 'antiName',
                content: antiNameUpdateEmbed,
                reactions: {
                    '↩': 'p3',
                    '1️⃣': async () => {

                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET nameUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET nameUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET nameUpdate = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.nameUpdate = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {

                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET nameUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET nameUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                }
            },
            {
                name: 'antiVanity',
                content: antiVanityUpdateEmbed,
                reactions: {
                    '↩': 'p3',
                    '1️⃣': async () => {

                        let q = await message.channel.send("<:720681705219817534:780540043033837622> \`SUCCÈS\` L'évênement doit être activé sur `\ on`\  ou `\ off`\ !(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbDel = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbDel = responseWbDel.first()
                        const lowercase = CollectedWbDel.content.toLowerCase()
                        if (lowercase == "on") {
                            await this.connection.query(`
                                                UPDATE antiraid SET vanityUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été activé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "off") {
                            await this.connection.query(`
                                                UPDATE antiraid SET vanityUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                message.channel.send("L'évènement a été desactivé")
                                q.delete();
                                CollectedWbDel.delete()
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`on / off / cancel\``)
                        }
                    },
                    '2️⃣': async () => {

                        let q = await message.channel.send(" Quelle sanction voulez-vous mettre ? (`\ ban / kick / unrank`\)!(timeout dans 30s & \`cancel\` pour annuler)")

                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "ban" || lowercase == "kick" || lowercase == "unrank") {
                            await this.connection.query(`
                                                UPDATE antiraidconfig SET vanityUpdate = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                            `).then(() => {
                                antiraidConfig.vanityUpdate = lowercase;

                                message.channel.send(`La sanction a été mise à jour pour \`${lowercase}\` `)
                                q.delete();
                                CollectedWbSanc.delete();
                            })
                        } else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '3️⃣': async () => {

                        let q = await message.channel.send(" Voulez-vous que les whitelists puissent by pass cet évênement ? (`\oui/non`\)!(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content.toLowerCase()
                        if (lowercase != "cancel" && lowercase == "oui") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET vanityUpdate = '1' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists peuvent maintenant bypass l'évènement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        } else if (lowercase == "non") {
                            await this.connection.query(`
                                            UPDATE antiraidWlBp SET vanityUpdate = '0' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                message.channel.send(`Les whitelists ne peuvent pas bypass l'évênement `)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } else {
                            message.channel.send(`Vous devez choisir entre \`ban / kick / unrank / cancel\``)
                        }
                    },
                    '4️⃣': async() => {
                        let q = await message.channel.send(" Quel est l'url à ne pas sanctionner en cas de modification ?(timeout dans 30s & \`cancel\` pour annuler)")
                        const responseWbSanc = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000 }).catch(() => { message.channel.send("Opération annulé pas de réponse après 30s") })
                        const CollectedWbSanc = responseWbSanc.first()
                        const lowercase = CollectedWbSanc.content
                        if (lowercase != "cancel") {
                            await this.connection.query(`
                                            UPDATE antiraidconfig SET vanityUpdateBypass = '${lowercase}' WHERE guildId = '${message.guild.id}' 
                                        `).then(() => {
                                antiraidConfig.vanityUpdateBypass = lowercase;
                                message.channel.send(`L'url à ne pas sanctionner est **${lowercase}**`)
                                q.delete();
                                CollectedWbSanc.delete()
                            })
                        }

                        else if (lowercase == "cancel") {
                            error = message.channel.send("L'opération a été annulée")
                            error.delete();
                            return
                        } 
                    }
                }
            },
        ])
        await antiraidConfigMenu.start();
        const filter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
        const confirMsg = await message.channel.send(`Pour sauvegarder vos paramètres veuiller **réagir à ce message avec ✅**`).then(async (m) => {
            const collector = m.createReactionCollector(filter, { time: 900000 });
            collector.on('collect', async r => {
                if(r.emoji.name == '✅'){
                    StateManager.emit('antiraidConfU', message.guild.id, antiraidConfig);
                    const replyMsg = message.channel.send(`Les paramètres de l'antiraid ont été sauvegardés`);
                    setTimeout(async () =>{
                        await m.delete();
                        await collector.stop();
                        await replyMsg.delete();
                    }, 5000)
                }
            });
            collector.on('end', async () => {
                await m.delete();
                const timeoutmsg = await message.channel.send(`Temps écoulé vos paramètres ne sont donc pas sauvegardés.`);
                setTimeout(async () =>{
                    timeoutmsg.delete()
                }, 5000)
            });
        })

    }

});

embedsColor(guildEmbedColor);
StateManager.on('ownerUpdate', (guildId, data) => {
    guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) => {
    guildOwner.set(guildId, data);

})
