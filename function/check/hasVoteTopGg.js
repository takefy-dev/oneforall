const DBL = require("dblapi.js");
const { CommandHandler } = require('advanced-command-handler');
const dbl = new DBL('', Commandclient
);


module.exports = async function topgg (authorId) {
    let hasVoted
    if(Commandclient
    .isOwner(authorId)) return hasVoted = true
    await dbl.hasVoted(authorId).then(voted => {
        if(voted == true) hasVoted = true;
        if(voted == false) hasVoted = false;
    });
    return hasVoted
}