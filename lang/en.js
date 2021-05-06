const Discord = require('discord.js')
const prettyMilliseconds = require('pretty-ms');
const ms = require('ms')
module.exports = {
    clic : "Click here",
    yes : "yes",
    no : "no",
    cancel : "Operation canceled",
    loading : `Loading... <a:2366_Loading_Pixels:784472554328555571>`,

    error: {
        YesNo : `Please answer with \`yes or no\` only !`,
        timeout : `Time elapsed !`,
        noSetup : "You need to setup the bot to be able to use this command (!setup)",
        errorNoOwner : (ownerTag) => `<:720681441670725645:780539422479351809> \`ERROR\` Only owners can execute this command \`(${ownerTag.join(",")})\`!`,
        NoYes : "You must answer only with yes or no !",

    },
    ping: {
        pinging : "Pinging...",
        success: (ping, client) => `Bot latency: \`${ping}\` ms, API latency: \`${Math.round(parseInt(client.ws.ping))}\` ms`,
    },
    help: {
        information2: (prefix) => `<:778353230484471819:780727288903237663> The prefix for this server is \`${prefix}\`.\n<:desc2:783422775821729792> To get more information about a command, just type \`${prefix}help\` \`command\`.\n<:folder:783422648196923452> You can also type \`${prefix}help commands\` or press on 📄 to get all my commands.`,
        noCommand: (args) => `I don't find this command (${args}) in my commands`,
        information: `Information and commands`,
        noAliases : `No aliases`,
        cmdTitle :`Command help`,
        footer : `Asked by `,
        titleNoArgs : `General help page`,
        command : `Show all commands`,
        search : `Find detailed help on a command`,
        noUsage : `No particular use`,
        requiredOrNot : `\`< >\` are the required arguments and \`[ ]\` are optional arguments`
    },
    helpall: {
        botOwner: `List of botOwner commands`,
        moderation : `List of Moderation commands`,
        antiriraid : `List of Antiraid commands`,
        giveaway : `List of Giveaway commands`,
        reactrole : `List of ReactRole & Embed commands`,
        general : `List of General commands`,

    },
    snipe: {
        error : "There is no deleted message in this channel",
        link : "Sorry but it's a link"
    },
    inviteBot : {
        invite : `Invite bot`,
    },
    support: {
        support: `Support Server`,
    },
    vocal: {
        msg: (count, muteCount, streamingCount, muteHeadSetCount, openMicCount) =>
            `<:voc:801123036576612353> Stats vocal :
        > <:unmute:801122798629945354> Open microphone : **${openMicCount}**
        > <:stream:801122725602000946> Streaming : **${streamingCount}**
        > <:mutecasque:801123005287628890> Headphone mute : **${muteHeadSetCount}**
        > <:mutemic:801122908445212723> Mute microphone : **${muteCount}**\n\n<:sageata:788796887121657877> Total of members in voice channel : **${count}**`,
    },
    authorinfo: {
        description: `__**OneforAll**__\n\n*OneforAll is a bot owned by* \`TAKEFY#9831\`\n\n**Developers :**\n[TAKEFY#9831](https://discord.gg/h69YZHB7Nh) -> Bot & Host\n[baby.#0006](https://discord.gg/h69YZHB7Nh) -> Ideas & Design\n[qzzzz#0101](https://discord.gg/h69YZHB7Nh) -> Communication\n[!" Iroz (pause)#0001](https://discord.gg/h69YZHB7Nh) -> Communication\n`,
    },
    alladmins: {
        error : `There is 0 admins on server.`,
        list : `List of admins`,
    },
    ban: {
        noBan : "<:720681441670725645:780539422479351809> `ERROR` You must specify a member to ban (`\mention / id`\)",
        errorRl : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` You cannot ban **\`${member.tag}\`** because they have roles above yours !`,
        errorBanSelf : "<:720681441670725645:780539422479351809> \`ERROR\` You cannot ban yourself !",
        noReason : "No reason specified",
        success : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` ${member.tag} was banned.`,
        error : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` Sorry, i just couldn't ban ${member.tag}`,
        alreadyBan : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member.tag}** is already ban`,
        missingPerm : (member) => `<:720681441670725645:780539422479351809> \`ERROR\`I don't have enought permissions to ban **${member}**`,
        dm : (guildName, bannerName) => `You've been ban from ${guildName} by ${bannerName}`
    },
    banlist : {
        title : (guild) => `Member(s) banned from the server __${guild.name}__`,
        description : (banned, list) => ` There is <:Banhammer:785492588269535263> **${banned.size}** banned member(s):  \n  \`${list}\` `,
        descriptionInf : (banned) =>`There is <:Banhammer:785492588269535263> **${banned.size}** banned member(s). `
    },
    clear: {
        error100 : '<:720681441670725645:780539422479351809> \`ERROR\` You cannot delete more than 100 messages !',
        errorNaN : '<:720681441670725645:780539422479351809> \`ERROR\` Put only numbers !',
        success : (deleteAmount) => `<:720681705219817534:780540043033837622> \`SUCCES\` You deleted ${deleteAmount} messages.`
    },
    derank: {
        errorNoMember : "<:720681441670725645:780539422479351809> `ERROR` You must specify a member to unrank (`\mention / id`\)",
        errorUnrankMe : "<:720681441670725645:780539422479351809> `ERROR` You can\'t unrank me.",
        errorRl : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` You can't unrank **\`${member}\`** ecause they have roles above yours`,
        errorUnrankSelf : "<:720681441670725645:780539422479351809> \`ERROR\` You can't unrank yourself",
        errorNoRl : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member}** has no role !`,
        reason : (executor) => `OneForAll - Type: unrank by ${executor.user.tag}`,
        success : (member) =>`<:720681705219817534:780540043033837622> \`SUCCES\` **${member}** was unranked.`
    },
    dero : {
        success : "<:720681705219817534:780540043033837622> \`SUCCES\` All waivers have been updated.",
    },
    embedBuilder : {
        loading : `Loading... <a:2366_Loading_Pixels:784472554328555571>`,
        title : `Embed creation menu !`,
        description : ` <a:dboatsSharkDance:788375939234398218> Welcome to the embed creation menu ! \n<a:image0:789413382591348738> Cliquez sur les reactions pour pouvoir personnaliser votre embed !`,

        titleField: `・Allows you to edit the title`,
        descriptionField : `・Allows you to modify the description`,
        authorField : `・Allows you to modify the author`,
        footerField : `・Allows you to modify the footer`,
        thumbnailField : `・Allows you to edit the thumbnail`,
        imageField : `・Allows you to edit the image`,
        urlField : `・Allows you to modify the url`,
        colorField : `・Allows you to change the color`,
        timestampField : `・Allows you to add a timestamp`,
        copyField : `Copy an embed and edit it`,
        cancelField : `・Allows to cancel the creation of the embed`,
        sendField :  `・Allows to send the embed with the bot`,

        titleMsg : `✏ What title do you want for your embed ?`,
        descriptionMsg : `📝 What description do you want for your embed ?`,
        authorMsg : `🗣 Which author do you want for your embed ?`,
        footerMsg : `🖍 What footer do you want for your embed ?`,
        thumbnailMsg : `💶 Which thumbnail do you want for your embed ?`,
        imageMsg : `🖼 What image do you want for your embed ?`,
        urlMsg : `🌐 What url do you want for your embed ?`,
        colorMsg : `🎨 What color do you want for your embed (\`HEX or rouge/vert/jaune/violet/rose/noir/blanc/bleu/orange/invisible\`)?`,
        timestampMsg : `⏲ Do you want to add a timestamp to your embed (\`oui/non\`)?`,
        copyMsg : `© What is the channel where the embed is located (\`mention / id\`)?`,
        messageId : `© What is the id of the embed message (\`id\`)?`,
        cancelMsg :`❌ Do you want to cancel the creation of the embed ? (\`oui/non\`)?`,
        sendMsg : `✅ In which channel do you want to send the embed \`mention ou id\`?`,


        errorUrl : `The url must start with __http/https__`,
        errorColor : `Please enter a valid color \`HEX or rouge/vert/jaune/violet/rose/noir/blanc/bleu/orange/invisible\``,
        errorChannel : `I can't find this channel !`,
        errorWrongId : `Please enter a valid id !`,
        errorMessage : (ch) => `I can't find the message in the channel ${ch} !`,
    },
    kick: {
        noKick : "<:720681441670725645:780539422479351809> `ERROR` You must specify a member to kick (`\mention / id`\)",
        errorRl : (tag) => `<:720681441670725645:780539422479351809> \`ERROR\` You cannot ban **\`${tag}\`** because they have roles above yours`,
        errorKickSelf : "<:720681441670725645:780539422479351809> \`ERROR\` You can't exclude yourself",
        noReason : "No specific reason",
        success : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` ${member} was kicked.`,
        error : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` Sorry, i didn't manage to kick ${member}`

    },
    lock : {
        successLockAll : "<:720681705219817534:780540043033837622> \`SUCCES\` All channels have been closed.",
        successOpenAll : "<:720681705219817534:780540043033837622> \`SUCCES\` All channels have been opened.",
        successLock : "<:720681705219817534:780540043033837622> \`SUCCES\` The channel was closed.",
        successOpen : "<:720681705219817534:780540043033837622> \`SUCCES\` The channel was opened.",
    },
    massrole: {
        errorNoRl : "You must specify a role / id to add to all members!",
        errorRlAlready : (role) => `The role \`${role.name}\` is already added to all server members !`,
        title : (role, member) => `I add the role ${role.name} to **${memberlength}** members`,
        descriptionTimeLeft : (timeLeft) => `🕙 __Remaining time__ : **${prettyMilliseconds(timeLeft)}**`,
        descriptionFinish : `  🕙 __Remaining time__ : **Fini**`,
        successAdd : (role, member) => `I added the role \`${role.name}\` to ${memberlength} members`,
        errorRlNot : (role) => `The role \`${role.name}\` is not added to anyone !`,
        titleRm : (role, member) => `I remove the role ${role.name} from **${memberlength}** members`,
        descriptionTimeLeft : (timeLeft) => `🕙 __Remaining time__ : **${prettyMilliseconds(timeLeft)}**`,
        successRemove : (role, member) => `I took off the role \`${role.name}\` from ${memberlength} members`
    },
    mute : {
        errorNoMember : `<:720681441670725645:780539422479351809> \`ERROR\` You must specify a member to mute \`id/mention\`.`,
        errorCantFindRole : `<:720681441670725645:780539422479351809> \`ERROR\` I can't find the mute role.`,
        errorAlreadyMute : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` You can't mute \`${member}\` because he is already muted !`,
        success : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` I mute \`${member}\` !`
    },
    nuke : {
        success : (member) => `💥 The channel was recreated by ${member}.`,


    },
    role : {
        author : `Informations rôle`,
        errorAlreadyRl : (member, role) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member}** already has the role ${role.name}.`,
        succcessAdd : (member, role) => `<:720681705219817534:780540043033837622> \`SUCCES\` I added the role (${role.name}) at **${member}**`,
        errorNoRl : (member, role) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member}** does not have the role ${role.name}.`,
        errorCantRm : (member) =>`<:720681441670725645:780539422479351809> \`ERROR\` There was an error I could not remove the role from **${member}**`,
        successRemove : (member, role) => `<:720681705219817534:780540043033837622> \`SUCCES\` I removed the role (${role.name}) from **${member}**`,
        error : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` There was an error I could not remove the role from **${member}**`
    },
    setcolor : {
        noColor : "<:720681441670725645:780539422479351809> `ERROR` You must specify a color !" ,
        success : (color) => `<:720681705219817534:780540043033837622> \`SUCCES\` The color of the embeds has been changed to ${color} `,
        successDescription : "This is the new embeds colors.",
        titleDescription : "Result !",
        errorSql : (color) => `<:720681441670725645:780539422479351809> \`ERROR\` Oops, updating the embeds color in ${color} failed.`,
        errorNoArgs : "<:720681441670725645:780539422479351809> \`ERROR\` You must specify a valid color (``#36393F``) !"
    },
    setprefix: {
        errorNoValid : "Please use the following prefixes: ``!‎``, ``@``, ``#‎``, ``$‎``, ``%‎``, ``^‎``, ``&‎``, ``*‎``, ``(‎``, ``)‎``, ``_‎``, ``+‎``, ``\\‎``, ``-‎``, ``=‎``, ``{‎``, ``}‎``, ``;‎``, ``'‎``, ``:‎``, ``\"‎``, ``|‎``, ``,‎``, ``.‎``, ``<‎``, ``>‎``, ``\/‎``, ``?``",
        success : (newPrefix) => `<:720681705219817534:780540043033837622> \`SUCCES\` The prefix has been updated to **${newPrefix}** `,
        errorSql : (newPrefix) => `<:720681441670725645:780539422479351809> \`ERROR\` Oops, updating the prefix to ${newPrefix} failed.`,
        errorNoArgs : "<:720681441670725645:780539422479351809> \`ERROR\`Incorrect number of arguments"
    },
    tempmute : {
        errorNoMember : `<:720681441670725645:780539422479351809> \`ERROR\` You must specify a member to mute \`id/mention\`.`,
        errorCantFindRole : `<:720681441670725645:780539422479351809> \`ERROR\` I can't find the mute role.`,
        errorTime : `You must specify a valid duration !`,
        errorAlreadyMute : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` You can't mute \`${member}\` because he is already muted !`,
        success : (member, time) => `<:720681705219817534:780540043033837622> \`SUCCES\` I mute \`${member}\` while **${prettyMilliseconds(ms(time))}**.`,
        errorUnMute : (member, time) => `<:720681441670725645:780539422479351809> \`ERROR\` I tried to unmute \`${member}\` after **${prettyMilliseconds(ms(time))}**, but he's already no longer muted...`,
        successUnMute : (member, time) => `<:720681705219817534:780540043033837622> \`SUCCES\` \`${member}\` no longer muted after **${prettyMilliseconds(ms(time))}**`
    },
    unban : {
        unbanAll : `I've unban everybody`,
        notBan : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` ${member.tag} was not banned`,
        noUnBanAll : `<:720681441670725645:780539422479351809> \`ERROR\` I can't find any member to unban !`,
        unbanSelf : "<:720681441670725645:780539422479351809> \`ERROR\` You can't unban yourself !",
        noMember : "<:720681441670725645:780539422479351809> `ERROR` You must specify a member to be unbanned (`\mention / id`\)",
        noReason : "Aucune raison spécifique",
        success : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` ${member.tag} was unban.`,
        error : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` Sorry, i can't unban <@${member}>`
    },
    unmute : {
        noMember : `<:720681441670725645:780539422479351809> \`ERROR\` You must specify a member to unmute \`id/mention\`.`,
        errorCantFindRole : `<:720681441670725645:780539422479351809> \`ERROR\` I can't find the mute role.`,
        success : (member) =>`<:720681705219817534:780540043033837622> \`SUCCES\` I unmuted \`${member}\` !`,
        errorAlreadyUnMute : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` You can't unmute \`${member}\` because he is already unmute !`
    },
    webhook : {
        replyMsg : (guild, webhooks) => '<:778353230589460530:780725963465687060> The server **' + guild.name + '** contient **' + webhooks.size + '** webhook.',
        replyMsgDelete : '<:720681705219817534:780540043033837622> All webhooks have been deleted.'
    },
    wl : {
        errorSyntax :"<:720681441670725645:780539422479351809> `ERROR` Syntax error : (!wl add/remove/list/clear @TAKEFY)",
        errorSyntaxAdd : "<:720681441670725645:780539422479351809> `ERROR` Syntax error : !wl\`<add/ remove/ list>\` \`<mention / id>\`",
        errorAlreadyWl : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member}** is already in the whitelist`,
        successWl : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` I added **${member}** to the whitelist`,
        clearWl : `Are you sure you want to clear the whitelist ?`,
        successClearWl : `I have cleared the whitelist`,
        error :`Oops an error was detected, so I could not clear the whitelist`,
        cancel : `Move me in the channel you want me to move all people`,
        errorNotWl: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member}** n'est pas dans les whitelist`,

    },
    voicemove : {
        success :  (author) => `<:720681705219817534:780540043033837622> \`SUCCES\` ${author}, move me in the channel you want me to move all people!`,

    },
    soutien : {
        title : `<:771462923855069204:784471984087236658> __Support Parameter__`,
        description :(soutienId,soutienMsg, isOnS, guild) => `
        1 ・ Configure the role that will be given to the member who has the required personalized status. \n
            __Current role__ : **<@&${soutienId.get(guild.id)}>** \n
        2 ・ Configure the personalized status message that members should have.\n
            __Current message__ : **${soutienMsg.get(guild.id)}** \n
        3 ・ Enable or disable support \n
                __Active__ : ${isOnS}
        `,
        roleQ : `<a:2366_Loading_Pixels:784472554328555571> Mention the role the supporters will receive (cancel to cancel)`,
        success : (response) => `<:720681705219817534:780540043033837622> \`SUCCES\` Supporters will now receive the role: ${response}.`,
        errorAdd : (response) =>`<:720681441670725645:780539422479351809> \`ERROR\` I have not been able to define the role where the supporters will receive                                               ${response}`,
        errorTimeOut : "<:720681441670725645:780539422479351809> \`ERROR\` No response after 30 seconds operation will be canceled",
        msgQ : `<a:2366_Loading_Pixels:784472554328555571> Please define your message to acquire the support role (cancel to cancel)`,
        successEditRl : `<:720681705219817534:780540043033837622> \`SUCCES\` I have changed the support message to : `,
        rmAllRlQ : `<a:2366_Loading_Pixels:784472554328555571> You have changed the support message. Do you want to remove the role from all the people who have the support role? Yes / No (cancel to cancel)`,
        errorRmAllRl : (rlId) => `I didn't manage to remove the role <@&${rlId}> to the supports`,
        successNo : "The support role is therefore not taken away from former support",
        removingRl : (rlId) => `I am removing the whole role <@&${rlId}> support (this may take a little time!).`,
        errorTimeout2M :"<:720681441670725645:780539422479351809> \`ERROR\` No response after 2 minutes operation will be canceled",
        errorChMsg : `<:720681441670725645:780539422479351809> \`ERROR\` I was unable to change the support message to:`,
        enableQ : `<a:2366_Loading_Pixels:784472554328555571> Do you want to activate support? Yes / No (cancel to cancel)`,
        successEnable : `<:720681705219817534:780540043033837622> \`SUCCES\` I have activated the support!`,
        errorEnable : `<:720681441670725645:780539422479351809> \`ERROR\` I have not arrived to activate the support...`,
        successDisable : `<:720681705219817534:780540043033837622> \`SUCCES\` I have deactivate  the support !`,
        errorDisable : `<:720681441670725645:780539422479351809> \`ERROR\` I didn't manage to deactivate the support...`,
        descriptionCount : (count) => "There is currently <:Support:785486768719265813> **" + count + " ** people who support the server.",

    },
    setup : {
        muteQ : "<:720681705219817534:780540043033837622> \`SUCCES\` Mention the mute role! (Timeout in 30s & \`cancel \` to cancel)",
        memberRoleQ :"<:720681705219817534:780540043033837622> \`SUCCES\` Mention the member role (if it's everyone put the id of everyone)! (Timeout in 30s & \`cancel \` to cancel)",
        success : (mureRoleId, memberRoleId) => `<:720681705219817534:780540043033837622> \`SUCCES\` The roles \`(${mureRoleId}, ${memberRoleId})\` have been added`,
        error : (mureRoleId, memberRole) =>`<:720681441670725645:780539422479351809> \`ERROR\` Oops an error occured adding the roles ${mureRoleId} ${memberRole} in the database list.`,

    },
    setlogs : {
        embedTitle : `Logs parameter`,
        embedDescription : (raid, mod, voc, msg, react) => `
        \n
           To disable a log just put off as a channel
            
            1 ・ Raid Logs
            ***${raid}***\n
            2 ・ Moderation logs
            ***${mod}***\n
            3 ・ voice chat Logs 
            ***${voc}***\n
            4 ・ Message Logs 
            ***${msg}***\n
            ❌ ・ Close the panel\n
            ✅ ・ Save the logs
        `,
        errorNotChannel : `You've specified a invalid channel or an id `,

        raidChQ : `What is the channel for the raid logs ?`,
        successRaidCh : (ch) => `You've defined the raid logs for ${ch}`,
        disable : (type) => `The logs ${type} has been disable`,
        modChQ : `What is the channel for the moderation logs ?`,
        successModCh : (ch) => `You've defined the moderation logs for ${ch}`,
        vocChQ : `What is the channel for the voice chat logs ?`,
        successVocCh : (ch) => `You've defined the voice chat logs for  ${ch}`,
        msgChQ : `What is the channel for the message logs ?`,
        successMsgCh : (ch) => `You've defined the message logs for ${ch}`,
        cancel :  `You've cancel the configuration`,
        save :  `You've save the configuration`,

    },
    owner : {
        noMember: `Please specify a member`,
        errorSyntax :"<:720681441670725645:780539422479351809> `ERROR` Syntax error (!owner add/remove/list/clear @TAKEFY)",
        errorSyntaxAdd : "<:720681441670725645:780539422479351809> `ERROR` Syntax error : !owner\`<add/ remove/ list>\` \`<mention / id>\`",
        errorAlreadyOwner : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member}** is already in the owner list`,
        successOwner : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` I added **${member}** to the owner list`,
        errorNotOwner : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member}** it is not in the owner list`,
        successRmOwner : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` I removed **${member}** from owner list`,
        clearOwner : `Are you sure you want to clear the owner list?`,
        successClearOwner : `I have cleared the owner list`,
        error :`Oops an error was detected, so I could not clear the owner list`,
        cancel : `I have not cleared the owner list`,
        titleList : `<:778353230383546419:781153631881265173> List of owners`,

    },
    addinvite: {
        noMember: `I can't find this member`,
        noNumber: `Please specify a correct number to add`,
        success: (number, tag) => `I added **${number}** ${number > 1 ? 'invites' : 'invite'} at ${tag}`,
    },
    rminvite: {
        success: (number, tag) => `I removed **${number}** ${number > 1 ? 'invites' : 'invite'} from ${tag}`,

    },
    clearInv: {
        success: (tag) => `I have cleared the on ${tag}`
    },
    invite : {
        countDesc : (author, userInviteCount, inv) => `
        **${author.tag}** currently owns : \n
        <:invite_oeople:785494680904138763> **${userInviteCount}** ${inv}. `,
        titleConfig : `<:771462923855069204:784471984087236658> __Invitations settings__`,
        descConfig : (inviteChannel, guild, isOnS, inviteMsg) => `
        1 ・Configure the channel where messages will be sent\n
            __Current channel__ : **<#${inviteChannel.get(guild.id)}>**\n
        2 ・ Configure the welcome message\n
            __Current message__ : **${inviteMsg.get(guild.id)}** \n
        3 ・ Help for the welcome message  \n
        4 ・ Activate or deactivate the welcome message \n
        __Active__ : ${isOnS}`,
        chQ : `<a:2366_Loading_Pixels:784472554328555571> Mention the channel where the welcome messages will be sent (cancel to cancel)`,
        successCh : (response) => `<:720681705219817534:780540043033837622> \`SUCCES\` Welcome messages will now be sent to the channel ${response}.`,
        errorCh : (response) => `<:720681441670725645:780539422479351809> \`ERROR\` I have not been able to define the channel where the welcome messages will be sent to ${response}`,
        timeout : "<:720681441670725645:780539422479351809> \`ERROR\` No response after 30 seconds operation will be canceled",
        msgQ : `<a:2366_Loading_Pixels:784472554328555571> Please define your welcome message (cancel to cancel)`,
        successMsg : `<:720681705219817534:780540043033837622> \`SUCCES\` I have modified the welcome message to :`,
        errorMsg : `<:720681441670725645:780539422479351809> \`ERROR\` I have not been able to change the welcome message to :`,
        timeout2M : "<:720681441670725645:780539422479351809> \`ERROR\` No response after 2 minutes operation will be canceled",
        helpTitle : `<:771462923855069204:784471984087236658> __Help on configuring the welcome message__`,
        helpDesc: (invitedHelp, inviterHelp, invitedMention, inviterMention, accountCreate, countHelp, fakeHelp, leaveHelp, totalMemberHelp, space) => `
        ${invitedHelp} \n
        ${inviterHelp} \n
        ${invitedMention}\n
        ${inviterMention}\n
        ${accountCreate}\n 
        ${countHelp} \n
        ${fakeHelp}\n
        ${leaveHelp}\n
        ${totalMemberHelp} \n
        ${space}  `,
        enableQ : `<a:2366_Loading_Pixels:784472554328555571> Do you want to activate welcome messages? Yes / No (cancel to cancel)`,
        successEnable : `<:720681705219817534:780540043033837622> \`SUCCES\` I have activated the welcome messages !`,
        errorEnable : `<:720681441670725645:780539422479351809> \`ERROR\` I have not arrived to activate the welcome messages...`,
        successDisable : `<:720681705219817534:780540043033837622> \`SUCCES\` I have deactivated the welcome messages !`,
        errorDisable : `<:720681441670725645:780539422479351809> \`ERROR\` I have not been able to deactivate the welcome messages...`,
        cantTrace: (invited) => `I don't know how ${invited} was invited on the server`,
        vanity: (invited) => `${invited} has been invited with custom server url`,
        syncSuccess: `The invations have been synchronized`,
        oauth: (invited) => `${invited} was invited using oauth `


    },
    password : {
        reply : `look your private message`,
        resetQ : `What was your old password ?  (timeout 30 seconds)`,
        errorNotClient : `Sorry but you are not client. To be a client please subscribe to an offer !`,
        wrongPassword : `The password is incorrect`,
        newPasswordQ : `What is the new password ? (timeout 30 seconds)`,
        successChange : `You've correctly change your password !`
    },
    authorinfo: {
        description: `__**OneforAll**__\n\n*OneforAll is a bot owned by* \`TAKEFY#9831\`\n\n**Developer :**\n[TAKEFY#9831](https://discord.gg/h69YZHB7Nh) -> Bot & Host\n[rh#0002](https://discord.gg/h69YZHB7Nh) -> Ideas & Design\n[qzzzz#0101](https://discord.gg/h69YZHB7Nh) -> Communication\n`,
    },
    setlang : {
        title : `Change language`,
        description :(lang) =>  `Actual language : **${lang}**    \n\n 🇫🇷 ・ French \n\n 🇬🇧 ・ English`,
        errorSelected : `<:720681441670725645:780539422479351809> \`ERROR\` The lang you wanted is already the actual language.`,
        success : (lang) => `<:720681705219817534:780540043033837622> \`SUCCES\` The bot language as been set for : **${lang}**`,
    },
    addemoji : {
        missingUrl : `<:720681441670725645:780539422479351809> \`ERROR\` You need to provide an emoji`,
        missingName : `<:720681441670725645:780539422479351809> \`ERROR\` You need to provide a name for the emoji`,
        invalidName : `<:720681441670725645:780539422479351809> \`ERROR\` You need to provide a valid name (between 3 and 31 characters)`,
        success : (emoji) => `<:720681705219817534:780540043033837622> \`SUCCES\` The emoji **${emoji}** has been added`,
        error : (name) => `<:720681441670725645:780539422479351809> \`ERROR\` A error has occurred during adding the emoji **${name}**`
    },
    removeemoji : {
        missingUrl : `<:720681441670725645:780539422479351809> \`ERROR\` You need to provide an emoji`,
        success : (emoji) => `<:720681705219817534:780540043033837622> \`SUCCES\` The emoji **${emoji}**  has been delete`,
        error : (name) => `<:720681441670725645:780539422479351809> \`ERROR\` A error has occurred during deleting the emoji **${name}**`
    },
    backup : {
        configEmbedT : `<:server:783422366230380565> Backup configuration`,
        configEmbedDesc : (ignoreCh, ignoreRl, ignoreEmo, ignoreBans) =>`
        **1** ・ Ignore channels (**${ignoreCh}**)
        **2** ・ Ignore roles (**${ignoreRl}**)
        **3** ・ Ignore emojis (**${ignoreEmo}**)
        **4** ・ Ignore bans (**${ignoreBans}**)\n
        **❌** ・ Close menu
        **✅** ・ Create the backup
        
        `,
        cancel : `<:720681705219817534:780540043033837622> \`SUCCES\` Backup creation canceled!`,
        successDelete : (backupId) =>  `<:720681705219817534:780540043033837622> \`SUCCES\` I deleted the backup **${backupId}** !`,
        successCreate : (id) => `<:720681705219817534:780540043033837622> \`SUCCES\` The backup was created with the id **${id}**`,
        successLoad : (guildName) => `<:720681705219817534:780540043033837622> \`SUCCES\` The backup was loaded on **${guildName}** !`,
        errorToManyBackup : `<:720681441670725645:780539422479351809> \`ERROR\` You have reached the maximum backup quota created (5 backups)`,
        noLoadId : `<:720681441670725645:780539422479351809> \`ERROR\` You must specify the id of a backup`,
        backupNoFound : `<:720681441670725645:780539422479351809> \`ERROR\` I can't find this backup in my database!`,
        error : `<:720681441670725645:780539422479351809> \`ERROR\` An error has occurred`,
        timeout : `<:720681441670725645:780539422479351809> \`ERROR\` You must wait \`20 minutes\` before you can load a backup !`
    },
    blacklist : {
        errorCantFindMember : `<:720681441670725645:780539422479351809> \`ERROR\` I can't find this member mentioned try with member id! `,
        successEnable : `<:720681705219817534:780540043033837622> \`SUCCES\` I activated the blacklist for owner(s)!`,
        successDisable : `<:720681705219817534:780540043033837622> \`SUCCES\` I deactivated the blacklist for owner(s)`,
        errorAlreadyOff : `<:720681441670725645:780539422479351809> \`ERROR\` The blacklist is already deactivated.`,
        errorAlreadyOn : `<:720681441670725645:780539422479351809> \`ERROR\` The blacklist is already activated.`,
        errorSyntax : "<:720681441670725645:780539422479351809> `ERROR` Syntax error : !blacklist on/off/add/remove/list/clear @TAKEFY",
        errorSyntaxAdd : "<:720681441670725645:780539422479351809> `ERROR` Syntax error : !blacklist \`<add/ remove/ list>\` \`<mention / id>\`",
        errorTryBlOwner : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` You cannot blacklist **${member.tag}** because you are part of the owner list and he too.`,
        errorTryUnBlOwner : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` You cannot unblacklist **${member.tag}** because you are part of the owner list and he too.`,
        successBanBl : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` I banned **${member.tag}**`,
        successBanGuild : (guildCount) => `<:720681705219817534:780540043033837622> \`SUCCES\` He was banned on **${guildCount}** servers...`,
        successUnBanBl : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` I unbanned **${member.tag}**`,
        successUnBanGuild : (guildCount) => `<:720681705219817534:780540043033837622> \`SUCCES\` He was unban on **${guildCount}** servers...`,
        errorAlreadyBl : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member.tag}** is already in the blacklist.`,
        successBl : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` I added **${member.tag}** to the blacklist`,
        errorNotBl : (member) => `<:720681441670725645:780539422479351809> \`ERROR\` **${member.tag}** is not in the blacklist`,
        successRmBl : (member) => `<:720681705219817534:780540043033837622> \`SUCCES\` I removed **${member.tag}** from blacklist`,
        errorCrown : `<:720681441670725645:780539422479351809> \`ERROR\` Sorry, you can't blacklist the server owner`,
        errorBannable : `<:720681441670725645:780539422479351809> \`ERROR\` Sorry, I cannot ban this person from this server`,
        clearBl : `Are you sure you want to clear the blacklist?`,
        successClearBl : `<:720681705219817534:780540043033837622> \`SUCCES\` I cleared the blacklist`,
        error :`<:720681441670725645:780539422479351809> \`ERROR\` Oops, an error was detected, so I couldn't clear the blacklist`,
        cancel : `<:720681705219817534:780540043033837622> \`SUCCES\` I have not cleared the blacklist`,
        titleList : `<:778353230383546419:781153631881265173> Blacklist list`,
        errorMe : `<:720681441670725645:780539422479351809> \`ERROR\` Sorry, you can't blacklist me!`,
        errorNotInDb: (prefix) => `<:720681441670725645:780539422479351809> \`ERROR\` You are not registered in my database please use \` ${prefix}bl on\``,

    },
    allbot : {
        title : (bots) => `Number of bots : ${bots}`,
    },
    warn: {
        warnDm: (tag, reason, amount) => `Vous avez été warn par **${tag}** pour ${reason}, vous avez au total : \`${amount}\` warn(s)`,
        warnSuccess: (tag, reason, amount) => `J'ai warn **${tag}** pour ${reason}, **${tag}** est actuellement à ${amount} warn(s)`,
        banDm: (amount, serverName) => `Vous avez été banni de **${serverName}** car vous avez atteind la limite de warn avec \`(${amount})\` warn(s)  `,
        kickDm: (amount, serverName) => `Vous avez été kick de **${serverName}** car vous avez atteind la limite de warn avec \`(${amount})\` warn(s)  `,
        muteDm: (amount, serverName) => `Vous avez été mute de **${serverName}** car vous avez atteind la limite de warn avec \`(${amount})\` warn(s)  `,

        settingsTitle: `Configuration des warns`,
        description: (ban, kick, mute) => ` \n
        Cliquez sur les reactions pour pouvoir configurer les warns !
        Pour mettre aucune sanction il suffit de mettre __0__

        \`💥\` ・ Modifier le nombre de warn avant de ban
        ***${ban}***\n
        \`💢\` ・ Modifier le nombre de warn avant de kick
        ***${kick}***\n
        \`😶\` ・ Modifié le  nombre de warn avant de mute
        **${mute}**\n
        
        \`❌\` ・ Fermer le menu\n
        \`✅\` ・ Sauvegarder la configuration
        `,
        banQ: `Quel doit être le nouveau nombre de warn avant de ban ? **Cancel pour annuler**`,
        onlyNumber: `Vous devez entrer uniquement des nombres`,
        kickQ: `Quel doit être le nouveau nombre de warn avant de kick ? **Cancel pour annuler**`,
        muteQ: `Quel doit être le nouveau nombre de warn avant de mute ? **Cancel pour annuler**`,
        cancel: `La configuration du nombre de warn a été annulé`,
        save: `La configuration a été sauvegardé`,
        error: `J'ai rencontré une erreur lors de la mis à jour`,
        listTitle: (tag) => `Liste des warns de ${tag}`,
        reason: `Raison`,
        noWarn: `Aucun warn enregistré`,
        nothingToClear: `Il n'y a aucun warn a clear sur ce membre`,
        successClear: (tag) => `J'ai clear tout les warns de ${tag}`,
        amountHigherThanWarnTotal: `Le nombre de warn à supprimer est supérieur au nombre total de warn que ce membre possède`,
        successClearAmount: (tag, amount) => `J'ai clear __${amount}__ warn(s) de **${tag}**`,
        warnNotFound: `Le warn n'existe pas`,
        successDelete: (tag, amount) => `J'ai enlevé le warn numéro ${amount} a **${tag}**`,
        noReason: "Aucune raison spécifique",
        notNumber: `You must enter the warn number to delete`,
        noMember: "<:720681441670725645:780539422479351809> `ERROR` You must specify a member (`\mention / id`\)",
        noGuildWarn: `No warn on this server `


    },
    counter : {
        embedTitle : `Counters Parameter`,
        embedDescription : (member, bot, voc, online, offline, channel, role, booster) => `
        \n
           To deactivate a counter just put off as channel  !
            
            \`👥\`・ Member counter
            ***${member}***\n
            \`🤖\` ・ Robot counter
            ***${bot}***\n
            \`🔊\`・ Voice connections counter 
            ***${voc}***\n
            \`🟢\` ・ Online members counter 
            ***${online}***\n
            \`⭕\` ・ Offline members counter 
            ***${offline}***\n
            \`📖\` ・ Channel counter
            ***${channel}***\n
            \`✨\` ・ Roles counter
            ***${role}***\n
            \`💠\` ・ Boosts counter 
            ***${booster}***\n
           
            \`❌\` ・ Close menu\n
            \`✅\` ・ Save counters
        `,
        notVoice : `<:720681441670725645:780539422479351809> \`ERROR\` The desired channel is not a vocal channel`,
        nameQ : `What must be the name of the **salon** \`ex : 💥・ Members:\`?`,

        errorNotChannel : `<:720681441670725645:780539422479351809> \`ERROR\` You must specify a valid channel or id`,
        disable : (type) => `<:720681705219817534:780540043033837622> \`SUCCES\` The counter ${type} has been disabled`,
        successMemberCh : (ch) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel for the members counter to ${ch}`,
        memberChQ : `What is the voice channel for the members counter ?`,
        successMemberName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the name of the channel for the members counter to ${name}`,

        botChQ : `What is the voice channel for the bots counter ?`,
        successBotName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the name of the channel for the bots counter to ${name}`,
        successBotCh : (ch) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel for the bots to ${ch}`,

        vocalChQ : `What is the voice channel for the voice connections counter?`,
        successVocalName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the name of the channel for the voice connections counter to ${name}`,
        successVocalCh : (ch) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel for the voice connections counter to ${ch}`,

        onlineChQ : `What is the voice channel for the online members counter?`,
        successOnlineName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the name of the channel for the online members counter to ${name}`,
        successOnlineCh : (ch) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel for the online members counter to ${ch}`,

        offlineChQ : `What is the voice channel for the offline members counter?`,
        successOfflineName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel name for the offline members counter to ${name}`,
        successOfflineCh : (ch) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel for the offline members counter to ${ch}`,

        channelChQ : `What is the voice channel for the channels counter?`,
        successChannelName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel name for the channels counter to ${name}`,
        successChannelCh : (ch) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel for the channels counter to ${ch}`,

        roleChQ : `What is the voice channel for the roles counter?`,
        successRoleName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel name for the roles counter to ${name}`,
        successRoleCh : (ch) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel for the roles counter to ${ch}`,

        boostChQ : `What is the voice channel for the boosts counter?`,
        successBoostName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel name for the boosts counter to ${name}`,
        successBoostCh : (ch) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have defined the channel for the boosts counter to ${ch}`,


    },
    reactionRole :{
        embedTitle: `Role reaction creation menu`,
        embedDescription : (channel, id,emoji, role) => `
        \n
            Click on the reactions to be able to configure the role reaction !
            
            \`📖\` ・ Choose the channel where the reaction role should be
            ***${channel}***\n
            \`🆔\` ・ Define the message id associated with the reaction role
            ***${id}***\n
            \`💠\` ・ Add a role\n
            **${emoji.join(`\n`)}**\n
            \`🚫\` ・ Delete a role\n
            \`📛\` ・ Delete an existing role reaction
            
           
            \`❌\` ・ Close menu\n
            \`✅\` ・ Save the reaction role
        `,
        notText : `The channel should only be of the type **text**`,
        chQ : `📖 What is the channel where you would like to have your reaction role ? (\`mention/id\`) (cancel to cancel)`,
        successCh: (ch) => `You have defined the channel to **${ch}**`,
        msgIdQ : `🆔 What is the message id for your reaction role ? (\`id\`) (cancel to cancel)`,
        notId : `Please enter a valid id !`,
        noChannel: `You have not defined a channel so I could not retrieve the message`,
        invalid : `The channel or the message id is invalid`,
        roleQ : `💠 What is the role to add for the reaction role ? (\`mention/id\`) (cancel to cancel)`,
        noRole : `Please define a role`,
        managedRole : `This role cannot be added because it is a role **managed by an application**`,
        emojiQ : `💠 What is the emoji for this role ? (\`send emoji\`)`,
        emojiDoesNotExist :`The desired emoji does not exist I am ready to add an emoji to the server what name should it have? (cancel to cancel)`,
        roleAlready :`The desired role is already associated with an emoji`,
        emojiAlready :`The desired emoji is already associated with a role`,
        roleDelQ : `🚫 What is the role to remove from the reaction role ? (\`mention/id\`) (cancel to cancel)`,
        roleNotFound : `The role is not part of the configuration of a role reaction`,
        noRole : `Before deleting a role please define it`,
        cancel : `Creating a role reaction canceled.`,
        chDeleteQ : `📛 What is the channel where the reaction plays a role? ? (\`mention/id\`) (cancel to cancel)`,
        msgDeleteQ : `📛 What is the id of the message associated with the reaction role ? (cancel to cancel)`,
        msgNotFound : `The message was not found.`,
        successDel : `The reaction role has been deleted.`,
        noMsg : `You have not defined a message.`,
        noEmoji : `You haven't set an emoji and role.`,
        alreadyReact : `A reaction role already exists with this message`,
        success : `The reaction role has been perfectly saved and created !`,
    },
    antiraidConfig :{
        noVote : `<a:image0:789413382591348738> To unlock this feature you must vote on our page **top.gg**! (https://top.gg/bot/780019344511336518/vote)`,
        allOn : `All events have been activated `,
        allOff : `All events have been disabled `,
        opti : `The antiraid was configured with the optimized parameters `,
        antiSpamOn : `Antispam has been activated !`,
        antiSpamOff : `Antispam has been disabled !`,
        antilinkOn : `The antilink has been activated !`,
        antilinkOff : `The antilink has been deactivated  !`,
        p1Title : `<a:3770_this_animated_right:783432503854759936>__Event configuration__ (__15__)`,
        p2Title : `<a:3770_this_animated_right:783432503854759936>__Event configuration__ (__15__)`,
        p3Title : `<a:3770_this_animated_right:783432503854759936>__Event configuration__ (__15__)`,
        timeoutmsg : `Elapsed time your settings are not saved!`,
        savedmsg : `Anti raid parameters have been saved `,
        reactsave : `To save your settings, please **react** to this message with **✅ ** `,
        anulee : `The operation was canceled `,
        active : `The event has been activated`,
        deactive : `The event has been deactivated`,
    },
    tempvoc: {
        embedTitle: `Temporary voice creation menu`,
        embedDescription : (tempname, enable) => `
        \n
            Click on the reactions to be able to configure the temporary voice !
            
            \`🕳\` ・ Auto configure temporary voice 
            \`💬\` ・ Change the name of the user's temporary room 
            ***${tempname}***\n
            \`💨\` ・ Activate / deactivate temporary voice 
            **${enable}**\n
            \`💥\` ・ Delete an existing temporary voice 
            
           
            \`❌\` ・ Close menu\n
            \`✅\` ・ Save temporary voice 
        `,
        loadingCreation : `Creation in progress...`,
        autoCat : `Temporary channel`,
        autoChName : `➕ Create your channel`,
        autoConfigFinish : `Creation is complete`,
        nameQ : `What should be the name of the channel? \`ex : ❤ - {username}\` (cancel to cancel)`,
        errorNoUsername: `You have to put **{username}** in the name of the channel`,
        cancel : `Creation of a temporary voice canceled`,
        alreadyTempvoc : `There is already a temporary voice on this server please delete it .`,
        success : `The temporary voice is well saved `,
        noCat : `Please configure temporary voice `,
        tempVocNotFound : `I cannot find any temporary channel for this server`,
        successDel : `Temporary vocal has been deleted`
    },
    serverlist: {
        title: `List of all the guild`,
        leave : `To remove the bot from a guild do !serverlist <the number associate to the guild>`,
        success: (name) => `The bot has left **${name}**`
    },
    ball : {
        noQuestion :  `Please enter a question.`,
        reponseQuestion : ["Oui.","Non.","Oui bien sûr","Oui définitivement !","Il ne vaut mieux pas en parler !","J'ai pas envie de répondre à cette question.","j'espère","J'imagine bien"],
        reponse : `Reply`

    },
    meme : {
        reponse :  (random) =>`Your meme was found on /r${random} (if the picture does not load please click the link)`
    },
    gaydetector : {
        title : `Gay Detector Machine`
    },


    addShop : {
        noItem : `Please enter an item for the shop`,
        noPrice : `Please enter a correct price to add the item to the shop`,
        successAdd : (item, price) => `You have added the item **${item}** at the price of ${price}`,
        priceInf0 : `You must enter a price greater than 0`,
        noShop : `<:720681441670725645:780539422479351809> \`ERROR\` Your store is not in our database (\`shop create\` to create the shop)`,
        alreadyShop : `<:720681441670725645:780539422479351809> \`ERROR\` Your server already have a store to delete it use \`shop delete\` `,
        create : `<:720681705219817534:780540043033837622> \`SUCCES\` The store has been created `,
        delete : `<:720681705219817534:780540043033837622> \`SUCCES\` The store has been deleted `,
        successRemove : (item) => `<:720681705219817534:780540043033837622> \`SUCCES\` You removed the item **${item}** from the shop`,
        successAdd : (item, price) => `<:720681705219817534:780540043033837622> \`SUCCES\` You added the item **${item}** at the price of ${price}`,
        shopShowTitle : (guildName) => `Store on the server ${guildName}`,
        nothingInShop : `Nothing in the store`,
        notFoundItem : `<:720681441670725645:780539422479351809> \`ERROR\` I can't find the item associated with this id try wtih another id `,
        editCondition : `Only the price and the name of the item can be edited`,
        newNameQ : `What should the new name of the item be? (cancel for cancel)`,
        successEditItemName : (name) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have changed the name of the item to ${name}`,
        newPriceQ : `What should be the new price for the item ? (cancel for cancel)`,
        successEditItemPrice : (price) => `<:720681705219817534:780540043033837622> \`SUCCES\` You have changed the price of the item to ${price}`,
        cancel : `<:720681705219817534:780540043033837622> \`SUCCES\` You canceled the modification of the item`,
        onlyNumber : `<:720681441670725645:780539422479351809> \`ERROR\` You must enter numbers only`,
        syntaxEdit : `<:720681441670725645:780539422479351809> \`ERROR\` Syntax Error: (!shop edit <itemId>)`,
        noModification : `You have not modified anything in the item`,
        successEdit : `<:720681705219817534:780540043033837622> \`SUCCES\` The item has been modified`,
        shopDesc : (guildName) => `:shopping_cart: Store on the server **${guildName}**.\n<a:coinsoneforall:819646518180446228> Buy an item with the \`buy [number]\` command.`

    },
    buy : {
        shoDisable : `<:720681441670725645:780539422479351809> \`ERREUR\` The store is deactivated`,
        syntaxError : `<:720681441670725645:780539422479351809> \`ERREUR\` Syntax Error: !buy <itemId>`,
        noCoins : `<:720681441670725645:780539422479351809> \`ERREUR\` You don't have coins.`,
        nothingInShop : `<:720681441670725645:780539422479351809> \`ERREUR\` There is nothing in the store `,
        notEnoughCoins : `<:720681441670725645:780539422479351809> \`ERREUR\` You have not enough coins to buy this item`,
        itemNotInShop : `<:720681441670725645:780539422479351809> \`ERREUR\` The item is not in the store`,
        success : (name, price) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` You bought **${name}** for <a:coinsoneforall:819646518180446228> **${price}** coins.`,
        alreadyRole : `<:720681441670725645:780539422479351809> \`ERREUR\` You already have this role so you cannot purchase this item.`,
        buyLog : (memberPing, itemName, price) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` ${memberPing} bought **${itemName}** for <a:coinsoneforall:819646518180446228> **${price}** coins.`

    },
    coins: {
        description: (coins) => `__${coins}__ coins`,
    },
    pay: {
        noMember : `Please specify a member to pay`,
        noCoins : `Please specify a number of coins to pay`,
        coinsInf0 : `Please specify a number of coins to pay greater than 0`,
        coinsDec2 : `The number of coins have too many decimals (2 maximum)`,
        noGoinsToGive : `You don't have coins.`,
        notEnoughtCoins : (coins) => `You don't have enough coins to give ${coins}`,
        giveCoins : (coins, member) => `You paid \`${coins}\` coins at ${member}`,
        logs : (coins, giver, receiver) => `${giver} gave \`${coins}\` coins at ${receiver}`
    },
    lb :{
        title : `Top 10 members with the most coins`,
        noCoins : `Nobody has coins on the server.`
    },

    music:{
        filter: {
            noArgs: `<a:music:822494244434214982> \`ERREUR\` You must choose an effect option \`3d, bassboost, echo, karaoke, nightcore, vaporwave, flanger, gate,haas, reverse, surround, mcompand, phaser, tremolo, earwax\``,
            success: (addedFilter, filter) => `<a:music:822494244434214982> Success the filter ${addedFilter} has been added to the filter list (${filter || "Off"}) `,
            successOff: `<a:music:822494244434214982> The filter is deactivated`,

        },
        requestedBy : `Asked by:`,
        playing : `<a:music:822494244434214982> Playing`,
        nothingInQueue : `<a:music:822494244434214982> There is nothing in the queue at the moment `,
        play:{
            noMusic: `<a:music:822494244434214982> \`ERROR\` You must enter a url or a music to search  !`
        },
        pause:{
            unPause : `<a:music:822494244434214982> Music is no longer paused`,
            pause : `<a:music:822494244434214982> Music is now paused `,
        },
        queue : `<a:music:822494244434214982> **Server Queue**`,
        skip : `<a:music:822494244434214982> Skipped! I play now:`,
        repeatMode : (mode) => `<a:music:822494244434214982> Loop mode is now set to \`${mode}\``,
        stop : `<a:music:822494244434214982> The music is now stopped `,
        volume :{
            notNumber : `<a:music:822494244434214982> \`ERROR\` Please enter a valid number `,
            changed : (volume) => `<a:music:822494244434214982> The volume is now set for \`${volume}%\``
        },
        noAvgRate :`Aucune information disponible`,
        lyrics :{
            notFound : `<a:music:822494244434214982> \`ERROR\` No lyrics found for: `
        },
        currentPlaying: {
            timeLeft : `Temps restant:`,
        },
        autoplay: {
            missingArgs : `<a:music:822494244434214982> \`ERROR\` Please enter \`on\` or \`off\`.`,
            on : `<a:music:822494244434214982> Autoplay is now activated`,
            off : `<a:music:822494244434214982> Autoplay is now disabled `,
            alreadyOn : `<a:music:822494244434214982> \`ERROR\` Autoplay is already activated `,
            alreadyOff : `<a:music:822494244434214982> \`ERROR\` Autoplay is already disabled `,
        },
        events :{
            addToQueue : {
                add: (songName, time, url) => `<a:music:822494244434214982> I added [${songName} - \`${time}\`](${url}) in the queue`
            },
            empty : `No one is in the channel. I leave him`,


        },
        importPlaylist:{
            description : `Do you want to import this playlist into your personal playlist ?`,
            nameQ : `What should be the name of this playlist ?`,
            success : `The playlist has been saved`,
            toManySongs : `Your playlist has too much music, please take another one with less music (35 max)`
        },
        search : {
            searching : `<a:music:822494244434214982> Browsing the web ...`,
            title : `List of music found:`,
            noArgs: `<a:music:822494244434214982> \`ERREUR\` Please enter something to look for it`,
            nothingFound: `<a:music:822494244434214982> \`ERREUR\` Nothing was found`,
            end: `<a:music:822494244434214982> The search is finished`
        },
        playlist:{
            noPlaylist: `<a:music:822494244434214982> \`ERREUR\` You do not have a saved playlist to save it, do \`!play <playlistUrl>\``,
            noPlaylistName : `<a:music:822494244434214982> \`ERREUR\` You must enter the name of one of your playlists.`,
            notFound : `<a:music:822494244434214982> \`ERREUR\` This playlist is not part of your playlist .`,
            urlQ : (name) => `<a:music:822494244434214982> What is the url of the music to add to the playlist  ${name} ?`,
            urlPlaylistQ: `<a:music:822494244434214982> What is the url of the playlist to import?`,
            provideOnlyValidUrl: `<a:music:822494244434214982> \`ERREUR\` Please enter only valid urls \`(youtube)\``,
            successAdd : (name) => `The music has been added to the playlist ${name}`,
            successImport: (name) => `<a:music:822494244434214982> La playlist a bien été importé avec le nom ${name}`,
            successDelete: (name) => `<a:music:822494244434214982> La playlist ${name} a bien été supprimé`,
            successRemove: (name) => `<a:music:822494244434214982> J'ai enlevé la music souhaité de ${name}`,
            successCreate: (name) => `<a:music:822494244434214982> J'ai créé la playlist ${name}`,
            playlistToLong: `<a:music:822494244434214982> La playlist comporte plus de 50 musics, je prend les 50 premières musics`,
            removeQ: `<a:music:822494244434214982> Quel est l'url de la music à enlever (cancel pour annuler)`,
            songNotFound: `<a:music:822494244434214982> La music à supprimer n'est pas dans cette playlist`,
            toManyPlaylist: `<a:music:822494244434214982> \`ERREUR\` Vous ne pouvez pas avoir plus de 10 playlist`,
            alreadyName: `<a:music:822494244434214982> \`ERREUR\` Une playlist comportant déjà ce nom existe veuillez choisir un autre nom de playlist`,
            createQ: `<a:music:822494244434214982> Quel est la première music à ajouter dans votre playlist ?`
        },
        shuffle: `<a:music:822494244434214982> The musics will be played randomly `
    },

    logs: {
        targetExecutorLogs: (type, executor, target, color, sanction) => new Discord.MessageEmbed()

            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a ${type}: **${target.tag || target.username}**\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${target.id}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),


        editionMsg: (executor, before, after, color, extra) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a edité son message:`)
            .addField(`Edition:`, `[Ce rendre sur le message](${extra})`)
            .addField('AVANT:', before)
            .addField('APRES:', after)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nMessage = ${extra.split('/')[6]}\nChannel = ${extra.split('/')[5]}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        edtionChannel: (executor, channel, before, after, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a edité le channel: <#${channel}>\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`Edition:`, `<#${channel}>`)
            .addField('AVANT:', before)
            .addField('APRES:', after)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        edtionRole: (executor, role, before, after, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a edité le rôle: <@&${role}>\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`Edition:`, `<@&${role}>`)
            .addField('AVANT:', before)
            .addField('APRES:', after)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nRole = ${role}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        guildNameUpdate: (executor, before, after, guild, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a edité le nom du serveur:\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField('AVANT:', before)
            .addField('APRES:', after)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nGuild = ${guild}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        guildVanityUpdate: (executor, before, after, guild, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a edité l'url du serveur:\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField('AVANT:', before)
            .addField('APRES:', after)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nGuild = ${guild}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        voiceChange: (executor, target, before, after, color) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} ${executor.id === target.id ? 'a changé de salon' : `a déplacé **${target.tag || target.username}**`}:`)
            .addField('AVANT:', `<#${before}>`)
            .addField('APRES:', `<#${after}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${target.id}\noldChannel = ${before}\nnewChannel = ${after}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        voiceConnect: (executor, channel, color) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} s'est connecté: <#${channel}>`)
            .addField('CHANNEL:', `<#${channel}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        voiceLeave: (executor, channel, color) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} s'est déconnecté: <#${channel}>`)
            .addField('CHANNEL:', `<#${channel}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),


        voiceMute: (executor, channel, color) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} s'est mute:`)
            .addField('CHANNEL:', `<#${channel}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        voiceUnMute: (executor, channel, color) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} s'est unmute:`)
            .addField('CHANNEL:', `<#${channel}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        messageDelete: (executor, target, channel, color, content) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} ${executor.id === target.id ? 'a son supprimé son message' : `a supprimé le message de **${target.tag || target.username}**`}:`)
            .addField('CHANNEL:', `<#${channel}>`)
            .addField('CONTENT:', content)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${target.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        memberRole: (executor, target, role, color, sanction, type) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a ${type} le role <@&${role}> à: **${target.tag || target.username}**\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`${type}`, `<@&${role}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${target.id}\nRole = ${role}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        webhookCreate: (executor, channel, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a créé un webhook\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`CHANNEL`, `<#${channel}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        roleCreate: (executor, roleName, roleId, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a créé un role\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`ROLE`, `${roleName}`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nRole = ${roleId}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        roleDelete: (executor, roleName, roleId, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a supprimé un role\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`ROLE`, `${roleName}`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nRole = ${roleId}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        channelCreate: (executor, channelName, channelId, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a créé un channel\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`CHANNEL`, `${channelName}`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channelId}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        channelDelete: (executor, channelName, channelId, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a supprimé un channel\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`CHANNEL`, `${channelName}`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channelId}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        antiDc: (executor, time, limit, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a créé son compte trop récemment\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`TEMPS`, `${time}`)
            .addField(`LIMITE`, `${limit}`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nTime = ${time}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        botAdd: (executor, bot, id, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a ajouté le bot: **${bot}**\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`BOT`, `${bot}`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nBot = ${id}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        blacklist: (executor, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a rejoins en étant blacklist:\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\n\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        changeRegion: (executor, oldRegion, newRegion, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a modifié la région du serveur:\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField('OLD', oldRegion)
            .addField('NEW', newRegion)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\n\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        antiSpam: (executor, channel, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a été mute pour spam :\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField('CHANNEL', `<#${channel}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        antiLink: (executor, channel, link, color, sanction) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${executor || executor.user.tag || executor.user.username} a été posté un lien :\n${!sanction ? '' : `**SANCTION:** ${sanction}`}`)
            .addField('LINK', link)
            .addField('CHANNEL', `<#${channel}>`)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nChannel = ${channel}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        mute: (executor, target, time, color, type) => new Discord.MessageEmbed()
            .setAuthor(executor.user.tag || executor.user.username, executor.user.tag ? executor.user.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`${target || target.tag || target.username} a été ${type}:`)
            .addField('TIME', time)
            .addField(`ID:`, `\`\`\`js\nExecutor = ${executor.id}\nTarget = ${target.id}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),

        unmute: (target, time, color) => new Discord.MessageEmbed()
            .setAuthor(target.tag || target.username, target.tag ? target.displayAvatarURL({dynamic: true}) : '')
            .setDescription(`**${target.tag || target.username}** a été unmute:`)
            .addField('TIME', time)
            .addField(`ID:`, `\`\`\`js\nTarget = ${target.id}\`\`\``)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(color),


    },
    perm: {
        noPermEnough : `Vous n'avez pas assez de permissions`,
        permNotFound : `La nom de la perm est invalide (1,2,3,4,everyone)`,
        commandNotFound: `La nom de la commande est introuvable`,
        noRoleConfig : `Aucun role n'est spécifié pour cette perm`,
        noRole: `Aucun rôle`,
        noCommand : `Aucune commandes`,
        noSetup : (prefix) => `Les perm ne sont pas configuré veuillez faire la commande ${prefix}permconfig`,
        successCommand : (name, perm) =>  `La commande **${name}** est maintenant en perm __${perm}__`,
        setupPerm: (role, perm) => `Le role **${role}** est maintenant en perm **${perm}**`,
        enable: (type) => `Les perm sont maintenant ${type}`
    }
}
