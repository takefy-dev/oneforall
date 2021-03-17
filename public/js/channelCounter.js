const fs = require('fs')
function channelCount() {
    let chCounter = fs.readFileSync('./public/counter/channelCounter.txt', {encoding:'utf8'});
    setInterval(async () => {
        chCounter = fs.readFileSync('./public/counter/channelCounter.txt', {encoding:'utf8'});
    }, 1000)
    return chCounter;
}

module.exports = channelCount;