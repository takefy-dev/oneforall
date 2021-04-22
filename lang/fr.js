module.exports = {
    cancel : "Opération annulé",
    loading : `Chargement... <a:2366_Loading_Pixels:784472554328555571>`,
    error: {
        ownerOnly : `Cette commande est uniquement réservé au propriétaire du bot`,
        guildOwnerOnly : `Vous n'êtes pas dans la liste des owners`,
        guildCrownOnly : `Vous n'êtes pas le propriétaire du serveur`,
        userPermissions : (perm) => `Vous n'avez pas la permission requise \`${perm}\``,
        clientPermissions : (perm) => `Je n'ai pas la permission requise \`${perm}\``
    },
    setprefix: {
        errorNoValid : "Veuillez utiliser les prefixes suivants: ``!‎``, ``@``, ``#‎``, ``$‎``, ``%‎``, ``^‎``, ``&‎``, ``*‎``, ``(‎``, ``)‎``, ``_‎``, ``+‎``, ``\\‎``, ``-‎``, ``=‎``, ``{‎``, ``}‎``, ``;‎``, ``'‎``, ``:‎``, ``\"‎``, ``|‎``, ``,‎``, ``.‎``, ``<‎``, ``>‎``, ``\/‎``, ``?``",
        success : (newPrefix) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Le prefix a été mise à jour en **${newPrefix}** `,
    },
    coins :{
        description : (coins) => `__${coins}__ coins`,
    },
    pay :{
        noMember : `Veuillez spécifier un membre à payer`,
        noCoins : `Veuillez spécifier un nombre de coins à payer`,
        coinsInf0 : `Veuillez spécifier un nombre de coins à payer supérieur a 0`,
        coinsDec2 : `Le nombre de coins à trop de décimal 2 maximum`,
        noGoinsToGive : `Vous n'avez pas de coins`,
        notEnoughtCoins : (coins) => `Vous n'avez pas assé de coins pour donné ${coins}`,
        giveCoins : (coins, member) => `Vous avez payé \`${coins}\` coins à ${member}`,
        logs : (coins, giver, receiver) => `${giver} a donné \`${coins}\` coins à ${receiver}`
    },
    logs :{
        noChannel : `Veuillez spécifier un channel valide et de type text`,
        success : (channel) => `Vous avez définie le salon des logs pour ${channel}`
    },
    owner :{
        noMember : `Je ne trouve pas ce membre`,
        alreadyOwner : (tag) => `**${tag}** est déjà dans la owners liste`,
        successAdd : (tag) => `**${tag}** est maintenant dans la liste des owners`,
        titleList : `Liste des owners`
    }
}