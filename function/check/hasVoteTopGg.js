const DBL = require("dblapi.js");
const { CommandHandler } = require('advanced-command-handler');
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4MDAxOTM0NDUxMTMzNjUxOCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjExMTgxMTkzfQ.IxONXaGvEVe5PtJV9Ci0Xwobbu4Z3qVPF0hXqXUUo00', CommandHandler.client);


module.exports = async function topgg (authorId) {
    let hasVoted
    if(CommandHandler.client.isOwner(authorId)) return hasVoted = true
    await dbl.hasVoted(authorId).then(voted => {
        if(voted == true) hasVoted = true;
        if(voted == false) hasVoted = false;
    });
    return hasVoted
}