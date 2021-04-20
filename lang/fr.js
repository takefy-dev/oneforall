module.exports = {
    error: {
        ownerOnly : `Cette commande est uniquement réservé au propriétaire du bot`,
        guildOwnerOnly : `Vous n'êtes pas dans la liste des owners`,
        userPermissions : (perm) => `Vous n'avez pas la permission requise \`${perm}\``,
        clientPermissions : (perm) => `Je n'ai pas la permission requise \`${perm}\``
    },
    setprefix: {
        errorNoValid : "Veuillez utiliser les prefixes suivants: ``!‎``, ``@``, ``#‎``, ``$‎``, ``%‎``, ``^‎``, ``&‎``, ``*‎``, ``(‎``, ``)‎``, ``_‎``, ``+‎``, ``\\‎``, ``-‎``, ``=‎``, ``{‎``, ``}‎``, ``;‎``, ``'‎``, ``:‎``, ``\"‎``, ``|‎``, ``,‎``, ``.‎``, ``<‎``, ``>‎``, ``\/‎``, ``?``",
        success : (newPrefix) => `<:720681705219817534:780540043033837622> \`SUCCÈS\` Le prefix a été mise à jour en **${newPrefix}** `,
    }
}