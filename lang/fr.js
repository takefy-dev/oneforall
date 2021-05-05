const prettyMilliseconds = require('pretty-ms');
const ms = require('ms')
const Discord = require('discord.js')
let embed = new Discord.MessageEmbed()

module.exports = {
    maintenance: `Le bot est en maintenance pendant quelques minutes`,
    clic: "Clique ici",
    yes: "oui",
    no: "non",
    cancel: "Opération annulé",
    loading: `Chargement... <a:2366_Loading_Pixels:784472554328555571>`,
    descriptionTimeLeft: (timeLeft) => `🕙 __Temps restant__ : **${prettyMilliseconds(timeLeft)}**`,


    error: {
        YesNo: `Veuillez répondre par \`oui ou non\` uniquement !`,
        timeout: `Temps écoulé !`,
        cooldown: (time) => `Veuillez executer la commande dans \`${time}\` secondes.`,
        noSetup: "Vous devez setup le bot pour pouvoir utiliser cette commande (!setup)",
        NoYes: "Vous devez répondre uniquement avec oui ou non !",
        ownerOnly: `Seulement le propriétaire du bot peut faire cette commande`,
        notListOwner: `Vous n'êtes pas dans la liste des owners`,
        notGuildOwner: `Seulement le propiétaire du serveur peut executer cette action`,
        voiceChat: `Vous devez être dans un salon vocal pour executer cette commande`,
        MissingPermission: `Désolé je ne suis pas arrivé à faire cela je n'ai pas assé de permission.`,
        includesEveryoneMention: `Vous ne pouvez pas me faire dire un message qui contient un mention everyone ou here`,
         userPermissions : (perm) => `Vous n'avez pas la permission requise \`${perm}\``,
        clientPermissions : (perm) => `Je n'ai pas la permission requise \`${perm}\``
    },
    ping: {
        pinging: "Pinging...",
        success: (ping, client) => `Latence du bot: \`${ping}\` ms, Latence de l'api: \`${Math.round(parseInt(client.ws.ping))}\` ms`,
    },
    help: {
        information2: (prefix) => `<:778353230484471819:780727288903237663> Le préfixe de ce serveur est \`${prefix}\`.\n<:desc2:783422775821729792> Pour obtenir plus d'informations sur une commande, tapez simplement \`${prefix}help\` \`commands\`.\n<:folder:783422648196923452> Vous pouvez également taper \`${prefix}help commands\` ou réagir avec 📄 pour obtenir toutes mes commandes.`,
        noCommand: (args) => `Je ne trouve pas la commande **__${args}__** dans mes commandes`,
        information: `Information and commands`,
        noAliases: `Pas d'aliases`,
        cmdTitle: `Aide sur la commande`,
        footer: `Demandé par`,
        titleNoArgs: `Page d'aide général`,
        command: `Afficher toutes les commandes`,
        search: `Chercher une aide détaillé sur un commande`,
        noUsage: `Pas d'usage en particuler`,
        requiredOrNot: `\`< >\` sont les arguments requis et \`[ ]\` sont les arguments optionnel`

    },
    helpall: {
        botOwner: `Liste des commandes de botOwner`,
        moderation: `Liste des commandes de Modération`,
        antiriraid: `Liste des commandes de Antiraid`,
        giveaway: `Liste des commandes de Concours`,
        reactrole: `Liste des commandes de ReactRole & Embed`,
        general: `Liste des commandes de Général`,

    },
    snipe: {
        error: "Il n'y a pas de message delete dans ce channel",
        link: "Désolé mais c'est un lien"
    },
    inviteBot: {
        invite: `Inviter le bot`,
    },
    support: {
        support: `Serveur d'assistance`,
    },
    vocal: {
        msg: (count, muteCount, streamingCount, muteHeadSetCount, openMicCount) =>
            `<:voc:801123036576612353> Statistique vocal :
        > <:unmute:801122798629945354> Micro ouvert : **${openMicCount}**
        > <:stream:801122725602000946> En Stream : **${streamingCount}**
        > <:mutecasque:801123005287628890> Mute casque : **${muteHeadSetCount}**
        > <:mutemic:801122908445212723> Mute micro : **${muteCount}**\n\n<:sageata:788796887121657877> Total de personnes en vocal : **${count}**`,
    },
    authorinfo: {
        description: `__**OneforAll**__\n\n*OneforAll est un bot appartenant à* \`TAKEFY#9831\`\n\n**Développeurs :**\n[TAKEFY#9831](https://discord.gg/h69YZHB7Nh) -> Bot & Host\n[baby.#0006](https://discord.gg/h69YZHB7Nh) -> Ideas & Design\n[qzzzz#0101](https://discord.gg/h69YZHB7Nh) -> Communication\n`,
    },
    alladmins: {
        error: `Aucun admin sur ce serveur.`,
        list: `Liste des admins`,
    },
    ban: {
        noBan: "<:720681441670725645:780539422479351809> `ERREUR` Vous devez spécifier un membre à bannir (`\mention / id`\)",
        errorRl: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas bannir **\`${member.tag}\`** car ils possèdent plus de permissions que vous`,
        errorBanSelf: "<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas vous bannir vous-même",
        noReason: "Aucune raison spécifique",
        success: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` ${member.tag} a été ban.`,
        error: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Désolé, je ne suis pas arrivé à bannir ${member.tag}`,
        alreadyBan: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member.tag}** est déjà banni`,
        missingPerm: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Je n'ai pas assé de permission pour bannir **${member.tag}**`,
        dm: (guildName, bannerName) => `Vous avez été banni de ${guildName} par ${bannerName}`

    },
    banlist: {
        title: (guild) => `Membre(s) banni sur le serveur __${guild.name}__`,
        description: (banned, list) => ` Il y a <:Banhammer:785492588269535263> **${banned.size}** membres banni(s):  \n  \`${list}\` `,
        descriptionInf: (banned) => `Il y a <:Banhammer:785492588269535263> **${banned.size}** membres banni(s). `
    },
    clear: {
        error100: '<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas supprimer plus de 100 messages à la fois!',
        errorNaN: '<:720681441670725645:780539422479351809> \`ERREUR\` Mettez uniquement des nombres!',
        success: (deleteAmount) => `<:720681705219817534:780540043033837622> \`SUCCÈS\`  Vous avez supprimé ${deleteAmount} messages.`
    },
    derank: {
        errorNoMember: "<:720681441670725645:780539422479351809> `ERREUR` Vous devez spécifier un membre à unrank (`\mention / id`\)",
        errorUnrankMe: "<:720681441670725645:780539422479351809> `ERREUR`  Vous ne pouvez pas me unrank.",
        errorRl: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas unrank **\`${member.user.tag}\`** car ils possèdent des rôles aux dessus des votre`,
        errorUnrankSelf: "<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas vous unrank vous-même",
        errorNoRl: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member.user.tag}** ne possède aucun rôle`,
        reason: (executor) => `OneForAll - Type: unrank par ${executor.user.tag}`,
        success: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` **${member.user.tag}** a été unrank.`
    },
    dero: {
        success: "<:720681705219817534:780540043033837622> \`SUCCÈS\` Toutes les dérogattions ont été mis à jour.",
    },
    embedBuilder: {
        loading: `Chargement ... <a:2366_Loading_Pixels:784472554328555571>`,
        title: `Menu création d'embed !`,
        description: ` <a:dboatsSharkDance:788375939234398218> Bienvenue sur le menu de création d'embed ! \n<a:image0:789413382591348738> Cliquez sur les reactions pour pouvoir personnaliser votre embed !`,

        titleField: `・Permet de modifier le titre`,
        descriptionField: `・Permet de modifier la description`,
        authorField: `・Permet de modifier l'auteur`,
        footerField: `・Permet de modifier le footer`,
        thumbnailField: `・Permet de modifier la miniature`,
        imageField: `・Permet de modifier l'image`,
        urlField: `・Permet de modifier l'url`,
        colorField: `・Permet de modifier la couleur`,
        timestampField: `・Permet de ajouter un timestamp`,
        copyField: `Copier un embed et l'editer`,
        cancelField: `・Permet d'annuler la création de l'embed`,
        sendField: `・Permet d'envoyer l'embed avec le bot`,

        titleMsg: `✏ Quel titre voulez-vous pour votre embed ?`,
        descriptionMsg: `📝Quelle description voulez-vous pour votre embed ?`,
        authorMsg: `🗣 Quel auteur voulez-vous pour votre embed ?`,
        footerMsg: `🖍 Quel footer voulez-vous pour votre embed ?`,
        thumbnailMsg: `💶 Quelle miniature voulez-vous pour votre embed ?`,
        imageMsg: `🖼 Quelle image voulez-vous pour votre embed ?`,
        urlMsg: `🌐 Quel url voulez-vous pour votre embed ?`,
        colorMsg: `🎨 Quelle couleur voulez-vous pour votre embed (\`HEX ou rouge/vert/jaune/violet/rose/noir/blanc/bleu/orange/invisible\`)?`,
        timestampMsg: `⏲ Voulez-vous ajouter un timestamp à votre embed (\`oui/non\`)?`,
        copyMsg: `© Quel est le channel où l'embed est situer (\`mention / id\`)?`,
        messageId: `© Quel est l'id du message embed (\`id\`)?`,
        cancelMsg: `❌ Voulez-vous annuler la création de l'embed ? (\`oui/non\`)?`,
        sendMsg: `✅ Dans quel channel voulez-vous envoyer l'embed \`mention ou id\`?`,


        errorUrl: `L'url doit commencer par __http/https__`,
        errorColor: `Veuillez entrer une couleur valide \`#0CAE45/rouge/vert/jaune/violet/rose/noir/blanc/bleu/orange/invisible\``,
        errorChannel: `Je ne trouve pas ce channel !`,
        errorWrongId: `Veuilez entrer un id valide !`,
        errorMessage: (ch) => `Je ne trouve pas le message dans le channel ${ch} !`,
    },
    kick: {
        noKick: "<:720681441670725645:780539422479351809> `ERREUR` Vous devez spécifier un membre à exclure (`\mention / id`\)",
        errorRl: (tag) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas bannir **\`${tag}\`** car ils possèdent des rôles aux dessus des votre`,
        errorKickSelf: "<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas vous exclure vous-même",
        noReason: "Aucune raison spécifique",
        success: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` ${member} a été expulsé.`,
        error: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Désolé, je ne suis pas arrivé à exclure ${member}`

    },
    lock: {
        successLockAll: "<:720681705219817534:780540043033837622> \`SUCCÈS\` Tous les salons ont été fermés.",
        successOpenAll: "<:720681705219817534:780540043033837622> \`SUCCÈS\` Tous les salons ont été ouverts.",
        successLock: "<:720681705219817534:780540043033837622> \`SUCCÈS\` Le salon a été fermé.",
        successOpen: "<:720681705219817534:780540043033837622> \`SUCCÈS\` Le salon a été ouvert.",
    },
    massrole: {
        errorNoRl: "Vous devez spécifier un rôle / id à ajouter à tous les membres!",
        errorRlAlready: (role) => `Le rôle \`${role.name}\` est déjà ajouté à tous les membres du serveur !`,
        title: (role, member) => `J'ajoute le rôle ${role.name} à **${member}** membres`,
        descriptionTimeLeft: (timeLeft) => `🕙 __Temps restant__ : **${prettyMilliseconds(timeLeft)}**`,
        descriptionFinish: `  🕙 __Temps restant__ : **Fini**`,
        successAdd: (role, member) => `J'ai ajouté le role \`${role.name}\` à ${member} membres`,
        errorRlNot: (role) => `Le rôle \`${role.name}\` n'est ajouté à personne !`,
        titleRm: (role, member) => `J'enlève le rôle ${role.name} à **${member}** membres`,
        successRemove: (role, member) => `J'ai enlevé le role \`${role.name}\` à ${member} membres`,
        noMassrole: `Aucun massrole n'est en cours...`,
        highPermRole: (role) => `Vous ne pouvez pas ajouter le rôle ${role}, a tout le serveur car il possède une permissions sensible`
    },
    mute: {
        errorNoMember: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez spécifier un membre à mute \`id/mention\`.`,
        errorCantFindRole: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve pas le rôle mute.`,
        errorAlreadyMute: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas mute \`${member.user.tag}\` car il est déjà mute !`,
        success: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai mute \`${member.user.tag}\` !`
    },
    nuke: {
        success: (member) => `💥 Le salon a été recréé par ${member}.`,


    },
    role: {
        author: `Informations rôle`,
        errorAlreadyRl: (member, role) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member.user.tag}** possède déjà le rôle ${role.name}.`,
        successAdd: (member, role) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai ajouté le rôle (${role.name}) à **${member.user.tag}**`,
        errorNoRl: (member, role) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member.user.tag}** ne possède pas le rôle ${role.name}.`,
        errorCantRm: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Il y a eu une erreur je n'ai pas pu enlever le rôle à **${member.user.tag}**`,
        successRemove: (member, role) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai enlevé le rôle (${role.name}) à **${member.user.tag}**`,
        error: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Il y a eu une erreur je n'ai pas pu enlever le rôle à **${member.user.tag}**`
    },
    setcolor: {
        noColor: "<:720681441670725645:780539422479351809> `ERREUR` Vous devez spécifier une couleur !",
        success: (color) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` La couleur des embeds a été modfiée à ${color} `,
        successDescription: "Ceci est la nouvelle couleurs des embeds.",
        titleDescription: "Résultat !",
        errorSql: (color) => `<:720681441670725645:780539422479351809> \`ERREUR\`Oups, la mise à jour de la couleur des embeds en ${color} a échouée.`,
        errorNoArgs: "<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez spécifier une couleur valide (``#36393F``) !"
    },
    setprefix: {
        errorNoValid: "Veuillez utiliser les prefixes suivants: ``!‎``, ``@``, ``#‎``, ``$‎``, ``%‎``, ``^‎``, ``&‎``, ``*‎``, ``(‎``, ``)‎``, ``_‎``, ``+‎``, ``\\‎``, ``-‎``, ``=‎``, ``{‎``, ``}‎``, ``;‎``, ``'‎``, ``:‎``, ``\"‎``, ``|‎``, ``,‎``, ``.‎``, ``<‎``, ``>‎``, ``\/‎``, ``?``",
        success: (newPrefix) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Le prefix a été mise à jour en **${newPrefix}** `,
        errorSql: (newPrefix) => `<:720681441670725645:780539422479351809> \`ERREUR\` Oups, la mise à jour du prefix en ${newPrefix} a échouée.`,
        errorNoArgs: "<:720681441670725645:780539422479351809> \`ERREUR\` Nombre d'argument incorrect"
    },
    tempmute: {
        errorNoMember: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez spécifier un membre à mute \`id/mention\`.`,
        errorCantFindRole: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve pas le rôle mute.`,
        errorTime: `Vous devez spécifier une durée valide !`,
        errorAlreadyMute: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas mute \`${member.user.tag}\` car il est déjà mute !`,
        success: (member, time) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai mute \`${member.user.tag}\` pendant **${prettyMilliseconds(ms(time))}**.`,
        errorUnMute: (member, time) => `<:720681441670725645:780539422479351809> \`ERREUR\` J'ai essayé de unmute \`${member.user.tag}\` après **${prettyMilliseconds(ms(time))}**, mais il est déjà plus mute...`,
        successUnMute: (member, time) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` \`${member.user.tag}\` n'est plus mute après **${prettyMilliseconds(ms(time))}**`
    },
    unban: {
        unbanAll: `J'ai débanni tout les membes banni`,
        notBan: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` ${member.tag} n'est pas banni`,
        noUnBanAll: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve aucun membre à débannir !`,
        unbanSelf: "<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas vous unbannir vous-même",
        noMember: "<:720681441670725645:780539422479351809> `ERREUR` Vous devez spécifier un membre à unbannir (`\mention / id`\)",
        noReason: "Aucune raison spécifique",
        success: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` ${member.tag} a été unban.`,
        error: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Désolé, je ne suis pas arrivé à unban <@${member}>`
    },
    unmute: {
        noMember: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez spécifier un membre à unmute \`id/mention\`.`,
        errorCantFindRole: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve pas le rôle mute.`,
        success: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai unmute \`${member.user.tag}\` !`,
        errorAlreadyUnMute: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas unmute \`${member.user.tag}\` car il est déjà unmute !`
    },
    webhook: {
        replyMsg: (guild, webhooks) => '<:778353230589460530:780725963465687060> Le serveur **' + guild.name + '** contient **' + webhooks.size + '** webhook.',
        replyMsgDelete: '<:720681705219817534:780540043033837622> Tous les webhooks ont été supprimés.'
    },
    wl: {
        errorSyntaxAdd: "<:720681441670725645:780539422479351809> `ERREUR` Erreur de syntaxe : !wl\`<add/ remove/ list>\` \`<mention / id>\`",
        errorAlreadyWl: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member}** est déjà dans la whitelist`,
        successWl: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai ajouté **${member}** à la whitelist`,
        clearWl: `Êtes-vous sûr de vouloir clear la whitelist ?`,
        successClearWl: `J'ai clear la whitelist`,
        error: `Oupsi une erreur a été détectée, je n'ai donc pas pu clear la whitelist`,
        cancel: `Je n'ai pas clear de la whitelist`,
        errorNotWl: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member}** n'est pas dans les whitelist`,
        successRmWl: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai enlevé **${member}** des owner`,


    },
    voicemove: {
        success: (author) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` ${author}, déplace moi dans le salon ou tu souhaite que je déplace toutes les personnes du salon!`,

    },
    soutien: {
        title: `<:771462923855069204:784471984087236658> __Paramètre du soutien__`,
        description: (soutienId, soutienMsg, isOnS, guild) => `
        1 ・ Configurer le rôle qui sera donné au membre qui ont le status personnalisé requis. \n
            __Rôle actuel__ : **<@&${soutienId.get(guild.id)}>** \n
        2 ・ Configurer le message du status personnalisé que les membres devront avoir.\n
            __Message actuel__ : **${soutienMsg.get(guild.id)}** \n
        3 ・ Activer ou désactiver le soutien \n
                __Actif__ : ${isOnS}
        `,
        roleQ: `<a:2366_Loading_Pixels:784472554328555571> Mentionnez le rôle que les soutiens receveront (cancel pour annuler)`,
        success: (response) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Les soutiens vont maintenant recevoir le rôle: ${response}.`,
        errorAdd: (response) => `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne suis pas arrivé à définir le rôle où que les soutiens receveront à ${response}`,
        errorTimeOut: "<:720681441670725645:780539422479351809> \`ERREUR\` Pas de réponse après 30 secondes opération annulé",
        msgQ: `<a:2366_Loading_Pixels:784472554328555571> Veuillez definir votre message pour acquérir le rôle de soutien (cancel pour annuler)`,
        successEditRl: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai bien modifié le message de soutien en : `,
        rmAllRlQ: `<a:2366_Loading_Pixels:784472554328555571> Vous avez modifié le message de soutien. Voulez-vous supprimez le rôle a toutes les personnes qui ont le rôle soutien ? Oui / Non (cancel pour annuler)`,
        errorRmAllRl: (rlId) => `Je ne suis pas arrivé à enlever le rôle <@&${rlId}> aux soutiens`,
        successNo: "Le rôle soutien n'est donc pas enlever aux anciens soutien",
        removingRl: (rlId) => `Je suis en train d'enlever tout le rôle <@&${rlId}> aux soutiens (cela risque de prendre un peu de temps !).`,
        errorTimeout2M: "<:720681441670725645:780539422479351809> \`ERREUR\` Pas de réponse après 2 minutes opération annulé",
        errorChMsg: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne suis pas arrivé à changer le message de soutien en :`,
        enableQ: `<a:2366_Loading_Pixels:784472554328555571> Voulez-vous activer le soutien ? Oui / Non (cancel pour annuler)`,
        successEnable: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai bien activé le soutien !`,
        errorEnable: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne suis pas arrivé a activé le soutien ...`,
        successDisable: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai bien desactivé le soutien !`,
        errorDisable: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne suis pas arrivé a desactivé le soutien ...`,
        descriptionCount: (count) => "Il y a actuellement <:Support:785486768719265813> **" + count + " ** personnes qui soutiennent le serveur.",

    },
    setup: {
        muteQ: "<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le rôle mute !(timeout dans 30s & \`cancel\` pour annuler)",
        memberRoleQ: "<:720681705219817534:780540043033837622> \`SUCCÈS\` Mentionne le rôle membre (si c'est everyone mettre l'id de everyone) !(timeout dans 30s & \`cancel\` pour annuler)",
        success: (mureRoleId, memberRoleId) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Les roles \`(${mureRoleId}, ${memberRoleId})\`ont bien été ajouté`,
        error: (mureRoleId, memberRole) => `<:720681441670725645:780539422479351809> \`ERREUR\` Oupsi une erreur est survennue pour ajouter les rôles ${mureRoleId} ${memberRole} dans la liste base de donée`,
        dontFindMember: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve pas ce role membre`,
        dontFindMute: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve pas ce role mute`
    },
    setlogs: {
        embedTitle: `Configuration des logs`,
        embedDescription: (raid, mod, voc, msg, react) => `
        \n
            Pour désactiver une log il suffit de mettre off comme channel !
            
            1 ・ Raid Logs
            ***${raid}***\n
            2 ・ Logs modération
            ***${mod}***\n
            3 ・ Logs Vocal
            ***${voc}***\n
            4 ・ Logs Message
            ***${msg}***\n
            ❌ ・ Fermer le menu\n
            ✅ ・ Sauvegarder les logs
        `,
        errorNotChannel: `vous devez spécifier un channel ou une id valide`,

        raidChQ: `Quel est le salon pour les raids ?`,
        successRaidCh: (ch) => `Vous avez défini le salon pour les raid pour ${ch}`,
        disable: (type) => `Les logs ${type} ont été désactivé`,
        modChQ: `Quel est le salon pour les logs de modération ?`,
        successModCh: (ch) => `Le salon pour logs de modération a été définie pour ${ch}`,
        vocChQ: `Quel est le salon pour les logs vocal ?`,
        successVocCh: (ch) => `Le salon pour logs de vocal a été définie pour ${ch}`,
        msgChQ: `Quel est le salon pour les logs des messages ?`,
        successMsgCh: (ch) => `Le salon pour logs des messages a été définie pour ${ch}`,
        reactChQ: `Quel est le salon pour les logs des reactions ?`,
        successReactCh: (ch) => `Le salon pour logs des reactions a été définie pour ${ch}`,
        cancel: `Vous avez annulé la configuration des logs`,
        save: `Vous avez sauvegardé la configuration des logs`,

    },
    owner: {
        noMember: `Veuillez spécifier un membre`,
        errorSyntax: "<:720681441670725645:780539422479351809> `ERREUR` Erreur de syntaxe (!owner add/remove/list/clear @TAKEFY)",
        errorSyntaxAdd: "<:720681441670725645:780539422479351809> `ERREUR` Erreur de syntaxe : !owner\`<add/ remove/ list>\` \`<mention / id>\`",
        errorAlreadyOwner: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member}** est déjà dans la owner list`,
        successOwner: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai ajouté **${member}** à la owner list`,
        errorNotOwner: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member}** n'est pas dans les owners`,
        successRmOwner: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai enlevé **${member}** des owner`,
        clearOwner: `Êtes-vous sûr de vouloir clear la owner list ?`,
        successClearOwner: `J'ai clear la owner list`,
        error: `Oupsi une erreur a été détectée, je n'ai donc pas pu clear la owner list`,
        cancel: `Je n'ai pas clear de la owner list`,
        titleList: `<:778353230383546419:781153631881265173> Liste des owners`,

    },
    invite: {
        countDesc: (tag, userInviteCount, inv) => `
        **${tag}** possède actuellement : \n
        <:invite_oeople:785494680904138763> **${userInviteCount}** ${inv}. `,
        titleConfig: `<:771462923855069204:784471984087236658> __Paramètre des invitations__`,
        descConfig: (inviteChannel, guild, isOnS, inviteMsg) => `
        1 ・Configurer le channel où les messages seront envoyés\n
            __Channel actuel__ : **<#${inviteChannel.get(guild.id)}>**\n
        2 ・ Configurer le message de bienvenue\n
            __Message Actuel__ : **${inviteMsg.get(guild.id)}** \n
        3 ・ Aide sur le message de bienvenue  \n

        4 ・ Activer ou désactiver le message de bienvenue \n
        __Actif__ : ${isOnS}`,
        chQ: `<a:2366_Loading_Pixels:784472554328555571> Mentionnez le channel où les messages de bienvenue seront envoyés (cancel pour annuler)`,
        successCh: (response) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Les messages de bienvenue vont maintenant être envoyé dans le channel ${response}.`,
        errorCh: (response) => `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne suis pas arrivé a définir le salon où les messages de bienvenue seront envoyés à ${response}`,
        timeout: "<:720681441670725645:780539422479351809> \`ERREUR\` Pas de réponse après 30 secondes opération annulé",
        msgQ: `<a:2366_Loading_Pixels:784472554328555571> Veuillez definir votre message de bienvenue (cancel pour annuler)`,
        successMsg: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai bien modifié le message de bienvenue en :`,
        errorMsg: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne suis pas arrivé a changer le message de bienvenue en :`,
        timeout2M: "<:720681441670725645:780539422479351809> \`ERREUR\` Pas de réponse après 2 minutes opération annulé",
        helpTitle: `<:771462923855069204:784471984087236658> __Aide sur la configuration du message de bienvenue__`,
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
        enableQ: `<a:2366_Loading_Pixels:784472554328555571> Voulez-vous activer les messages de bienvenue ? Oui / Non (cancel pour annuler)`,
        successEnable: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai bien activé les messages de bienvenue !`,
        errorEnable: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne suis pas arrivé a activé les messages de bienvenue ...`,
        successDisable: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai bien desactivé les messages de bienvenue !`,
        errorDisable: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne suis pas arrivé a desactivé les messages de bienvenue ...`,
        cantTrace: (invited) => `Je ne sais pas comment ${invited} a été invité sur le serveur`,
        vanity: (invited) => `${invited} a été invité avec l'url personnalisé du serveur`,
        syncSuccess: `Les invations ont bien été synchronisé`,
        oauth: (invited) => `${invited} a été invité en utilisant l'oauth`
    },
    addinvite: {
        noMember: `Je ne trouve pas ce membre`,
        noNumber: `Veuillez spécifier un nombre correct à ajouter`,
        success: (number, tag) => `J'ai ajouté **${number}** ${number > 1 ? 'invites' : 'invite'} à ${tag}`,
    },
    rminvite: {
        success: (number, tag) => `J'ai enlevé **${number}** ${number > 1 ? 'invites' : 'invite'} à ${tag}`,

    },
    clearInv: {
        success: (tag) => `J'ai clear les invites sur ${tag}`
    },
    password: {
        reply: `regarde tes messages privés`,
        resetQ: `Quel etait votre ancien mot de pass ?  (timeout 30 secondes)`,
        errorNotClient: `Désolé vous n'êtes pas client veuillez souscrire à une offre pour débloquer cette option !`,
        wrongPassword: `Le mot de pass est incorrect`,
        newPasswordQ: `Quel doit être le nouveau mot de pass ? (timeout 30 secondes)`,
        successChange: `Vous avez bien modifié votre mot de pass !`
    },
    authorinfo: {
        description: `__**OneforAll**__\n\n*OneforAll est un bot appartenant à* \`TAKEFY#9831\`\n\n**Développeurs :**\n[TAKEFY#9831](https://discord.gg/h69YZHB7Nh) -> Bot & Host\n[rh#0002](https://discord.gg/h69YZHB7Nh) -> Ideas & Design\n[qzzzz#0101](https://discord.gg/h69YZHB7Nh) -> Communication\n`,
    },
    setlang: {
        title: `Changer la langue`,
        description: (lang) => `Langue actuelle : **${lang}**    \n\n 🇫🇷 ・ Français \n\n 🇬🇧 ・ Anglais`,
        errorSelected: `<:720681441670725645:780539422479351809> \`ERREUR\` La langue souhaité est déjà celle actuelle.`,
        success: (lang) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` La langue du bot est maintenat définie pour ${lang}`,
    },
    addemoji: {
        missingUrl: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez fournir un emoji`,
        missingName: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez fournir un nom pour l'emoji`,
        invalidName: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez fournir un nom valid (3 a 31 caractère)`,
        success: (emoji) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` L'emoji **${emoji}** a été ajouté`,
        error: (name) => `<:720681441670725645:780539422479351809> \`ERREUR\` Une erreur est survenue en ajoutant l'emoji **${name}**`
    },
    removeemoji: {
        missingUrl: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez fournir un emoji`,
        success: (emoji) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` L'emoji **${emoji}** a été supprimé`,
        error: (name) => `<:720681441670725645:780539422479351809> \`ERREUR\` Une erreur est survenue en supprimant l'emoji **${name}**`
    },
    backup: {
        configEmbedT: `<:server:783422366230380565> Configuration de la backups`,
        configEmbedDesc: (ignoreCh, ignoreRl, ignoreEmo, ignoreBans) => `
        **1** ・ Ignorer les channels (**${ignoreCh}**)
        **2** ・ Ignorer les rôles (**${ignoreRl}**)
        **3** ・ Ignorer les emojis (**${ignoreEmo}**)
        **4** ・ Ignorer les bans (**${ignoreBans}**)\n
        **❌** ・ Fermer le menu 
        **✅** ・ Créer la backup
        

        `,
        cancel: `<:720681705219817534:780540043033837622> \`SUCCÈS\` Création de backup annulé`,
        successDelete: (backupId) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai bien supprimé la backup **${backupId}** !`,
        successCreate: (id) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` La backup a été créé avec l'id **${id}**`,
        successLoad: (guildName) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` La backup a été load sur **${guildName}** !`,
        errorToManyBackup: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous avez atteind le quota maximum de backup crée (5 backup)`,
        noLoadId: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez spécifier l'id d'une backup`,
        backupNoFound: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve pas cette backup dans ma base de donnée`,
        error: `<:720681441670725645:780539422479351809> \`ERREUR\` Une erreur est survenue`,
        timeout: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez patienter \`20 minutes\` avant de pouvoir reload un backup !`,
        notBackupOwner: `<:720681441670725645:780539422479351809> \`ERREUR\` Cette backup de nous appartient pas...`
    },
    blacklist: {
        errorCantFindMember: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve pas ce membre mentionné essayez par id! `,
        successEnable: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai activé la blacklist pour cet owner`,
        successDisable: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai désactivé la blacklist pour cet owner`,
        errorAlreadyOff: `<:720681441670725645:780539422479351809> \`ERREUR\` La blacklist est déjà desactivé`,
        errorAlreadyOn: `<:720681441670725645:780539422479351809> \`ERREUR\` La blacklist est déjà activé`,
        errorSyntax: "<:720681441670725645:780539422479351809> `ERREUR` Erreur de syntaxe (!blacklist on/off/add/remove/list/clear @TAKEFY)",
        errorSyntaxAdd: "<:720681441670725645:780539422479351809> `ERREUR` Erreur de syntaxe : !blacklist \`<add/ remove/ list>\` \`<mention / id>\`",
        errorTryBlOwner: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas blacklist **${member.tag}** car vous faites parti de la liste des owner et lui aussi.`,
        errorTryUnBlOwner: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous ne pouvez pas unblacklist **${member.tag}** car vous faites parti de la liste des owner et lui aussi.`,
        successBanBl: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai ban **${member.tag}**`,
        successBanGuild: (guildCount) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Il a été ban sur **${guildCount}** serveurs...`,
        successUnBanBl: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai unban **${member.tag}**`,
        successUnBanGuild: (guildCount) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Il a été unban sur **${guildCount}** serveurs...`,
        errorAlreadyBl: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member.tag}** est déjà dans la blacklist`,
        successBl: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai ajouté **${member.tag}** à la blacklist`,
        errorNotBl: (member) => `<:720681441670725645:780539422479351809> \`ERREUR\` **${member.tag}** n'est pas dans les blacklist`,
        successRmBl: (member) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai enlevé **${member.tag}** des blacklist`,
        errorCrown: `<:720681441670725645:780539422479351809> \`ERREUR\` Désolé vous ne pouvez pas blacklist la couronne du serveur `,
        errorBannable: `<:720681441670725645:780539422479351809> \`ERREUR\` Désolé je ne peux pas bannir cette personne de ce serveur`,
        clearBl: `Êtes-vous sûr de vouloir clear la blacklist ?`,
        successClearBl: `<:720681705219817534:780540043033837622> \`SUCCÈS\` J'ai clear la blacklist`,
        error: `<:720681441670725645:780539422479351809> \`ERREUR\` Oupsi une erreur a été détectée, je n'ai donc pas pu clear la blacklist`,
        cancel: `<:720681705219817534:780540043033837622> \`SUCCÈS\` Je n'ai pas clear de la blacklist`,
        titleList: `<:778353230383546419:781153631881265173> Liste des blacklist`,
        errorMe: `<:720681441670725645:780539422479351809> \`ERREUR\` Désolé vous ne pouvez pas me blacklist`,
        errorBotOwner: `<:720681441670725645:780539422479351809> \`ERREUR\` Désolé vous ne pouvez pas blacklist un des owner du bot`,
        errorNotInDb: (prefix) => `<:720681441670725645:780539422479351809> \`ERREUR\` Vous n'êtes pas enregistré dans ma base de donnée veuillez utiliser \` ${prefix}bl on\``,
    },
    allbot: {
        title: (bots) => `Nombre de bots : ${bots}`,
    },
    counter: {
        embedTitle: `Paramètre des compteurs`,
        embedDescription: (member, bot, voc, online, offline, channel, role, booster) => `
        \n
            Pour désactiver un compteur il suffit de mettre off comme channel !
            
            \`👥\`・ Compteur de membres
            ***${member}***\n
            \`🤖\` ・ Compteur de robots
            ***${bot}***\n
            \`🔊\`・ Compteur de membre en vocal
            ***${voc}***\n
            \`🟢\` ・ Compteur de membre en ligne
            ***${online}***\n
            \`⭕\` ・ Compteur de membre en hors-ligne
            ***${offline}***\n
            \`📖\` ・ Compteur de salons
            ***${channel}***\n
            \`✨\` ・ Compteur de roles
            ***${role}***\n
            \`💠\` ・ Compteur de booster
            ***${booster}***\n
           
            \`❌\` ・ Fermer le menu\n
            \`✅\` ・ Sauvegarder les compteurs
        `,
        notVoice: `<:720681441670725645:780539422479351809> \`ERREUR\` Le channel souhaité n'est pas un channel vocal`,
        nameQ: `Quel doit être le nom du **salon** \`ex : 💥・ Membres:\`?`,

        errorNotChannel: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez spécifier un channel ou une id valide`,
        disable: (type) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Le compteur ${type} a été désactivé`,
        successMemberCh: (ch) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le salon pour les compteur de membre ${ch}`,
        memberChQ: `Quel est le channel vocal pour le compteur de membres ?`,
        successMemberName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le nom du salon pour les compteur de membre pour ${name}`,

        botChQ: `Quel est le channel vocal pour le compteur des bots ?`,
        successBotName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le nom du salon pour les compteur des bots pour ${name}`,
        successBotCh: (ch) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le salon pour les compteur des bots a ${ch}`,

        vocalChQ: `Quel est le channel vocal pour le compteur des membre en vocals?`,
        successVocalName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le nom du salon pour le compteur des membres en vocals pour ${name}`,
        successVocalCh: (ch) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le salon pour le compteur des membres en vocals a ${ch}`,

        onlineChQ: `Quel est le channel vocal pour le compteur de membre en ligne?`,
        successOnlineName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le nom du salon pour le compteur des membres en ligne pour ${name}`,
        successOnlineCh: (ch) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le salon pour le compteur des membres en ligne a ${ch}`,

        offlineChQ: `Quel est le channel vocal pour le compteur de membre hors-ligne?`,
        successOfflineName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le nom du salon pour le compteur des membres hors-ligne pour ${name}`,
        successOfflineCh: (ch) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le salon pour le compteur des membres hors-ligne a ${ch}`,

        channelChQ: `Quel est le channel vocal pour le compteur de salons ?`,
        successChannelName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le nom du salon pour le compteur des salons pour ${name}`,
        successChannelCh: (ch) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le salon pour le compteur des salons a ${ch}`,

        roleChQ: `Quel est le channel vocal pour le compteur de rôles ?`,
        successRoleName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le nom du salon pour le compteur de role pour ${name}`,
        successRoleCh: (ch) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le salon pour le compteur de role a ${ch}`,

        boostChQ: `Quel est le channel vocal pour le compteur de booster ?`,
        successBoostName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le nom du salon pour le compteur de booster pour ${name}`,
        successBoostCh: (ch) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez défini le salon pour le compteur de booster a ${ch}`,


    },
    reactionRole: {
        embedTitle: `Menu de création du reaction rôle`,
        embedDescription: (channel, id, emoji, role) => `
        \n
            Cliquez sur les reactions pour pouvoir configurer le reaction rôle !
            
            \`📖\` ・ Choisir le salon ou doit être le reaction rôle
            ***${channel}***\n
            \`🆔\` ・ Definir l'id du message associé au reaction rôle
            ***${id}***\n
            \`💠\` ・ Ajouter un rôle\n
            **${emoji.join(`\n`)}**\n
            \`🚫\` ・ Supprimer un rôle\n
            \`📛\` ・ Supprimer un reaction rôle existant
            
           
            \`❌\` ・ Fermer le menu\n
            \`✅\` ・ Sauvegarder le reaction rôle
        `,
        notText: `Le salon doit être uniquement du type **text**`,
        chQ: `📖 Quel est le salon où vous voudriez avoir votre reaction rôle ? (\`mention/id\`) (cancel pour annuler)`,
        successCh: (ch) => `Vous avez définie le salon pour **${ch}**`,
        msgIdQ: `🆔 Quel est l'id du message pour votre reaction rôle ? (\`id\`) (cancel pour annuler)`,
        notId: `Veuillez entrer une id valide !`,
        noChannel: `Vous n'avez pas défini de channel je n'ai donc pas pu récuperer le message`,
        invalid: `Le salon ou l'id du message est invalide`,
        roleQ: `💠 Quel est le rôle à ajouter pour le reaction rôle ? (\`mention/id\`) (cancel pour annuler)`,
        noRole: `Veuillez définir un rôle`,
        managedRole: `Ce rôle ne peut pas être ajouté car c'est un rôle **géré par une application**`,
        emojiQ: `💠 Quel est l'emoji pour ce rôle ? (\`envoyer l'emojis\`)`,
        emojiDoesNotExist: `L'emoji souhaité n'existe pas je suis a prêt à ajouter un emoji au serveur quel nom doit-il avoir(cancel pour annuler)`,
        roleAlready: `Le rôle désiré est déjà associé à un emoji`,
        emojiAlready: `L'emoji désiré est déjà associé à un role`,
        roleDelQ: `🚫 Quel est le rôle à supprimer pour le reaction rôle ? (\`mention/id\`) (cancel pour annuler)`,
        roleNotFound: `Le role ne fait pas partie de la configuration d'un reaction rôle`,
        noRole: `Avant de supprimer un rôle veuillez en définir`,
        cancel: `Création d'un reaction rôle terminé.`,
        chDeleteQ: `📛 Quel est le salon où le reaction role ce situe ? (\`mention/id\`) (cancel pour annuler)`,
        msgDeleteQ: `📛 Quel est l'id du message associé au reaction role ? (cancel pour annuler)`,
        msgNotFound: `Le message n'a pas été trouvé.`,
        successDel: `Le reaction rôle à bien été supprimé.`,
        noMsg: `Vous n'avez pas définie de message.`,
        noEmoji: `Vous n'avez pas définie d'emoji et de rôle.`,
        alreadyReact: `Un reaction rôle existe déjà avec ce message`,
        success: `Le reaction rôle a été parfaitement sauvagardé et crée !`,
    },
    tempvoc: {
        embedTitle: `Menu de création d'un vocal temporaire`,
        embedDescription: (tempname, enable) => `
        \n
            Cliquez sur les reactions pour pouvoir configurer le vocal temporaire !
            
            \`🕳\` ・ Auto configurer le vocal temporaire

            \`💬\` ・ Changer le nom du salon temporaire de l'utilisateur
            ***${tempname}***\n
            \`💨\` ・ Activé / désactiver le vocal temporaire
            **${enable}**\n
            \`💥\` ・ Supprimer un vocal temporaire existant
            
           
            \`❌\` ・ Fermer le menu\n
            \`✅\` ・ Sauvegarder le vocal temporaire
        `,
        loadingCreation: `Création en cours...`,
        autoCat: `Salon temporaire`,
        autoChName: `➕ Crée ton salon`,
        autoConfigFinish: `La création est terminé`,
        nameQ: `Quel doit être le nom du salon ? \`ex : ❤ - {username}\` (cancel pour annuler)`,
        errorNoUsername: `Vous devez mettre **{username}** dans le nom du salon`,
        cancel: `Création d'un vocal temporaire annulé`,
        alreadyTempvoc: `Il y a déjà un vocal temporaire sur ce serveur veuillez le supprimé.`,
        success: `Le vocal temporaire est bien sauvegardé`,
        noCat: `Veuillez configurer le vocal temporaire`,
        tempVocNotFound: `Je ne trouve aucun salon temporaire pour ce serveur`,
        successDel: `Le vocal temporaire est bien supprimé`
    },
    mutelist: {
        title: `List des membres muet`
    },
    serverlist: {
        title: `List des serveurs où le bot est présent`,
        leave: `Pour enlever le bot d'un serveur faites !serverlist <l'id du serveur>`,
        success: (name) => `Le bot vient de quitter **${name}**`,
        errorNotServer: `Le serveur souhaité n'est pas dans la liste`

    },

    say: {
        cantSendEmptyMsg: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne peux pas envoyer un message vide`
    },
    stats: {
        enable: `Les statistiques on été activé !`,
        disable: `Les statistiques on été désactivé !`,
        memberNotFound: `<:720681441670725645:780539422479351809> \`ERREUR\` Le membre souhaité n'est pas présent dans le serveur`,
        noStatsFound: `<:720681441670725645:780539422479351809> \`ERREUR\` Aucune statisique a été trouvé pour ce membre`,
        totalVoiceChat: `Temps passé en vocal`,
        desc: (member) => `Statistique de **${member.user.username}**`,
        voiceMostActive: `Salon le plus actif en vocal`,
        noVoiceChannel: `Salon vocal supprimé`
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
        notNumber: `Vous devez entrer le numéro de warn à supprimer`,
        noMember: "<:720681441670725645:780539422479351809> `ERREUR` Vous devez spécifier un membre (`\mention / id`\)",
        noGuildWarn: `Aucun warn sur ce serveur`


    },
    coinSettings: {
        title: `Configuration du système de coins`,
        description: (streamBoost, muteDiviseur, logs, enable) => ` \n
        Cliquez sur les reactions pour pouvoir configurer les warns !
        

        \`🎥\` ・ Modifier le multiplicateur de coins quand un membre est en stream/cam
        ***${streamBoost}***\n
        \`😶\` ・ Modifier le diviseur si un membre est mute
        ***${muteDiviseur}***\n
        \`💌\` ・ Modifié le salon des logs
        **${logs}**\n
        \`🌀\` ・Activer ou désactiver le système de coins
        **${enable}**

        \`❌\` ・ Fermer le menu\n
        \`✅\` ・ Sauvegarder la configuration
        `,
        onlyNumber: `Vous devez uniquement entrer des nombres`,
        streamBoostQ: `Quel doit être le nouveau multiplicateur pour les membres en stream ? (cancel pour annuler)`,
        muteDiviseurQ: `Quel doit être le nouveau diviseur pour les membres mute ?(cancel pour annuler)`,
        logsQ: `Quel doit être le nouveau salons pour les logs ? (cancel pour annuler)`,
        errorNotChannel: `<:720681441670725645:780539422479351809> \`ERREUR\` Veuillez spécifier uniquement des salons textuelle`,
        cancel: `Vous avez annuler la configuration`,
        save: `Configuration sauvegardé`
    },
    ball: {
        noQuestion: `S'il vous plait, veuillez entrer une question.`,
        reponseQuestion: ["Oui.", "Non.", "Oui bien sûr", "Oui définitivement !", "Il ne vaut mieux pas en parler !", "J'ai pas envie de répondre à cette question.", "j'espère", "J'imagine bien"],
        reponse: `Réponse`

    },
    meme: {
        reponse: (random) => `Ton meme a été trouvé sur /r${random} (si l'image ne charge pas veuillez cliquer sur le lien)`
    },
    gaydetector: {
        title: `Machine de detecteur de gay`
    },
    addShop: {
        noItem: `Veuillez entrer un item en pour le shop`,
        noPrice: `Veuillez entrer un prix correct pour ajouter l'item au shop`,
        successAdd: (item, price) => `Vous avez ajouter l'item **${item}** au prix de ${price}`,
        priceInf0: `Vous devez entrer un prix suppérieur à 0`,
        noShop: `<:720681441670725645:780539422479351809> \`ERREUR\` Votre magasin n'est pas dans notre base de donné (shop create pour créer le shop)`,
        alreadyShop: `<:720681441670725645:780539422479351809> \`ERREUR\` Votre serveurs possède déjà un magasin pour le supprimé (shop delete)`,
        create: `<:720681705219817534:780540043033837622> \`SUCCÈS\` Le magasin a bien été créé`,
        delete: `<:720681705219817534:780540043033837622> \`SUCCÈS\` Le magasin a bien été supprimé`,
        successRemove: (item) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez enlevé l'item **${item}** du magasin`,
        successAdd: (item, price) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez ajouté l'item **${item}** au prix de ${price}`,
        shopShowTitle: (guildName) => `Magasin sur le serveur ${guildName}`,
        nothingInShop: `Rien dans la magasin`,
        notFoundItem: `<:720681441670725645:780539422479351809> \`ERREUR\` Je ne trouve pas l'item associé avec cet id essayé un autre id`,
        editCondition: `Seulement le prix et le nom de l'item est éditable`,
        newNameQ: `Quel doit être le nouveau nom de l'item ? (cancel pour annuler)`,
        successEditItemName: (name) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez changer le nom de l'item pour ${name}`,
        newPriceQ: `Quel doit être le nouveau prix pour l'item ? (cancel pour annuler)`,
        successEditItemPrice: (price) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez changer le prix de l'item pour ${price}`,
        cancel: `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez annulé la modification de l'item`,
        onlyNumber: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous devez entrer uniquement des nombres`,
        syntaxEdit: `<:720681441670725645:780539422479351809> \`ERREUR\` Erreur de syntax : (!shop edit <itemId>)`,
        noModification: `Vous n'avez rien modifié dans l'item`,
        successEdit: `<:720681705219817534:780540043033837622> \`SUCCÈS\` L'item a bien été modifié`,
        shopDesc: (guildName) => `:shopping_cart: Magasin sur le serveur **${guildName}**.\n<a:coinsoneforall:823538178622488616> Achetez un item avec le \`buy [number]\` command.`

    },
    buy: {
        shoDisable: `<:720681441670725645:780539422479351809> \`ERREUR\` Le magasin est désactivé`,
        syntaxError: `<:720681441670725645:780539422479351809> \`ERREUR\` Error de syntaxe : !buy <itemId>`,
        noCoins: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous avez aucun coins`,
        nothingInShop: `<:720681441670725645:780539422479351809> \`ERREUR\` Il n'y a rien dans le magasin`,
        notEnoughCoins: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous n'avez pas assé d'argent pour acheter cet item`,
        itemNotInShop: `<:720681441670725645:780539422479351809> \`ERREUR\` L'item n'est pas dans le magasin`,
        success: (name, price) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Vous avez acheté **${name}** pour <a:coinsoneforall:823538178622488616> **${price}** coins.`,
        alreadyRole: `<:720681441670725645:780539422479351809> \`ERREUR\` Vous possédez déjà ce rôle vous ne pouvez donc pas acheter cet item.`,
        buyLog: (memberPing, itemName, price) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` ${memberPing} a acheté **${itemName}** pour <a:coinsoneforall:823538178622488616> **${price}** coins.`

    },
    coins: {
        description: (coins) => `<a:coinsoneforall:823538178622488616> __${coins}__ coins`,
    },
    pay: {
        noMember: `Veuillez spécifier un membre à payer`,
        noCoins: `Veuillez spécifier un nombre de coins à payer`,
        coinsInf0: `Veuillez spécifier un nombre de coins à payer supérieur a 0`,
        coinsDec2: `Le nombre de coins à trop de décimal 2 maximum`,
        noGoinsToGive: `Vous n'avez pas de coins`,
        notEnoughtCoins: (coins) => `Vous n'avez pas assé de coins pour donné ${coins}`,
        giveCoins: (coins, member) => `Vous avez payé \`${coins}\` coins à ${member}`,
        logs: (coins, giver, receiver) => `${giver} a donné \`${coins}\` coins à ${receiver}`
    },
    lb: {
        title: `Top des 10 membres ayant le plus de coins`,
        noCoins: `Personne a de coins sur le serveur.`

    },
    antiraidConfig: {
        limitQ: `Quelle est la limite pour cet évènement ?`,
        sanctionQ: `Quelle est la sanction pour cet événement ? (ban/unrank/kick)`,
        antiDcError: `Vous devez entrer uniquement un temps valide (1d, 1w)`,
        limitError: `Vous devez entrer une limite valide`,
        antiDcUnrank: `Vous ne pouvez pas mettre cette sanction`,
        noVote: `<a:image0:789413382591348738> Pour débloquer cette fonctionnalitée vous devez voter sur notre page **top.gg** ! (https://top.gg/bot/780019344511336518/vote)`,
        allOn: `Tous les évênements ont été activés`,
        allOff: `Tous les évênements ont été désactivé`,
        opti: `L'antiraid est configuré avec les paramètres optimisés`,
        antiSpamOn: `L'antispam a été activé !`,
        antiSpamOff: `L'antispam a été désactivé !`,
        antilinkOn: `L'antilink a été activé !`,
        antilinkOff: `L'antilink a été désactivé !`,
        p1Title: `<a:3770_this_animated_right:783432503854759936>__Configuration des évènements__ (__15__)`,
        p2Title: `<a:3770_this_animated_right:783432503854759936>__Configuration des évènements__ (__15__)`,
        p3Title: `<a:3770_this_animated_right:783432503854759936>__Configuration des évènements__ (__15__)`,
        timeoutmsg: `Temps écoulé vos paramètres ne sont donc pas sauvegardés.`,
        savedmsg: `Les paramètres de l'antiraid ont été sauvegardés`,
        reactsave: `Pour sauvegarder vos paramètres veuiller **réagir à ce message avec ✅**`,
        anulee: `L'opération a été annulée`,
        active: `L'évènement a été activé`,
        deactive: `L'évènement a été desactivé`,
    },


    music: {
        requestedBy: `Demandé par:`,
        playing: `<a:music:822494244434214982> Entrain de jouer`,
        nothingInQueue: `<a:music:822494244434214982> Il n'y a rien dans la queue pour le moment`,
        play: {
            noMusic: `<a:music:822494244434214982> \`ERREUR\` Vous devez entrer une url ou une music à chercher !`
        },
        pause: {
            unPause: `<a:music:822494244434214982> La music n'est plus en pause`,
            pause: `<a:music:822494244434214982> La music est maintenant en pause`,
        },
        queue: `<a:music:822494244434214982> **Serveur Queue**`,
        skip: `<a:music:822494244434214982> Skipped! Je joue maintenant:`,
        repeatMode: (mode) => `<a:music:822494244434214982> Le mode boucle est maintenant définie sur \`${mode}\``,
        stop: `<a:music:822494244434214982> La music est maintenant arrêté`,
        volume: {
            notNumber: `<a:music:822494244434214982> \`ERREUR\` Veuillez entrer un nombre valide`,
            changed: (volume) => `<a:music:822494244434214982> Le volume est maintenant défini pour \`${volume}%\``
        },
        noAvgRate: `Aucune information disponible`,
        lyrics: {
            notFound: `<a:music:822494244434214982> \`ERREUR\` Aucun parole trouvé pour: `
        },
        currentPlaying: {
            timeLeft: `Temps restant:`,
        },
        autoplay: {
            missingArgs: `<a:music:822494244434214982> \`ERREUR\` Veuillez entrer \`on\` ou \`off\`.`,
            on: `<a:music:822494244434214982> L'autoplay est maintenant activé`,
            off: `<a:music:822494244434214982> L'autoplay est maintenant désactivé`,
            alreadyOn: `<a:music:822494244434214982> \`ERREUR\` L'autoplay est déjà activé`,
            alreadyOff: `<a:music:822494244434214982> \`ERREUR\`L'autoplay est déjà désactivé`,
        },
        events: {
            addToQueue: {
                add: (songName, time, url) => `<a:music:822494244434214982> J'ai ajouté [${songName} - \`${time}\`](${url}) à la queue`
            },
            playlist: {
                play: (playlistName, songs) => `<a:music:822494244434214982> La playlist ${playlistName} a démarré`,
                addToQueue: (playlistName) => `<a:music:822494244434214982> La playlist ${playlistName} a été ajouté à la queue`
            },
            empty: `Personne n'est dans le channel. Je le quitte`,


        },
        importPlaylist: {
            description: `Voulez-vous importer cette playlist dans vos playlist personnelle ?`,
            nameQ: `Quel doit être le nom de cette playlist ?`,
            success: `La playlist a été sauvegardé`,
            toManySongs: `Votre playlist comporte trop de music veuilez en prendre un autre avec moins de music (35 max)`
        },
        search: {
            searching: `<a:music:822494244434214982> Browsing the web ...`,
            title: `Liste des musics trouvé:`,
            noArgs: `<a:music:822494244434214982> \`ERREUR\` Veuillez entrer quelque chose à chercher`,
            nothingFound: `<a:music:822494244434214982> \`ERREUR\` Rien n'a été trouvé`,
            end: `<a:music:822494244434214982> La recherche est terminé`
        },
        playlist: {
            noPlaylist: `<a:music:822494244434214982> \`ERREUR\` Vous n'avez pas de playlist sauvegarder pour en sauvegarder faites \`!play <playlistUrl>\``,
            noPlaylistName: `<a:music:822494244434214982> \`ERREUR\` Vous devez entrer le nom d'un de vos playlist.`,
            notFound: `<a:music:822494244434214982> \`ERREUR\` Cette playlist ne fait pas partie de vos playlist.`,
            urlQ: (name) => `<a:music:822494244434214982> Quel est l'url de la music à ajouter à la playlist ${name} ?`,
            urlPlaylistQ: `<a:music:822494244434214982> Quel est l'url de la playlist à importer ?`,
            provideOnlyValidUrl: `<a:music:822494244434214982> \`ERREUR\` Merci d'entrer uniquement des url valides \`(youtube)\``,
            successAdd: (name) => `<a:music:822494244434214982> La music a bien été ajouté a la playlist ${name}`,
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
        filter: {
            noArgs: `<a:music:822494244434214982> \`ERREUR\` Vous devez choisir une option d'effet a appliqué \`3d, bassboost, echo, karaoke, nightcore, vaporwave, flanger, gate,haas, reverse, surround, mcompand, phaser, tremolo, earwax\``,
            success: (addedFilter, filter) => `<a:music:822494244434214982> Succès le filtre ${addedFilter} a été ajouté a la liste des filtres (${filter || "Off"}) `,
            successOff: `<a:music:822494244434214982> Le filtre est désactivé`,

        },

        shuffle: `<a:music:822494244434214982> Les musics seront joué aléatoirement`
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
        noPermEnough: `Vous n'avez pas assez de permissions`,
        permNotFound: `La nom de la perm est invalide (1,2,3,4,everyone)`,
        commandNotFound: `La nom de la commande est introuvable`,
        noRoleConfig: `Aucun role n'est spécifié pour cette perm`,
        noRole: `Aucun rôle`,
        noCommand: `Aucune commandes`,
        noSetup: (prefix) => `Les perm ne sont pas configuré veuillez faire la commande ${prefix}permconfig`,
        successCommand: (name, perm) => `La commande **${name}** est maintenant en perm __${perm}__`,
        setupPerm: (role, perm) => `Le role **${role}** est maintenant en perm **${perm}**`,
        enable: (type) => `Les perm sont maintenant ${type}`
    }
}
