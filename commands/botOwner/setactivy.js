const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
module.exports = new Command({
    name: 'setactivity',
    description: 'defininr activite',
    // Optionnals :
    usage: '!setactivity',
    tags:['ownerOnly', "guildOnly"],
    category: 'botOwner',

    cooldown: 1
}, async (client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const activityName = args.join(" ");
    if(args[0] == "streaming"){
        client.user.setPresence({ activity: { name: activityName.replace("streaming", " "), type: 'STREAMING', url: "https://www.twitch.tv/discord" } })
            .then(p => message.channel.send(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("streaming", " ")}\`.`))
            .catch(e => { return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``); });


    }    
    else if(args[0] == "playing"){
        client.user.setPresence({ activity: { name: activityName.replace("playing", " "), type: 'PLAYING'} })
            .then(p => message.channel.send(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("playing", " ")}\`.`))
            .catch(e => { return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``); });
    }else if(args[0] == "watching"){
        client.user.setPresence({ activity: { name: activityName.replace("watching", " "), type: 'WATCHING'} })
            .then(p => message.channel.send(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("watching", " ")}\`.`))
            .catch(e => { return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``); });
    }else if(!args[0]){
        message.channel.send(`${message.author}, Vous avez fournie aucune valeur pour l'activité`);

    }else if(args[0] && !args[1]){
        message.channel.send(`${message.author}, Vous avez fournie aucune valeur pour le nom de l'activié`);

    }
     
        
});

embedsColor(guildEmbedColor);