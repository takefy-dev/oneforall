const fs = require('fs')
setInterval(async () => {
    fs.readFileSync('./counter/serverCounter.txt', {encoding:'utf8'});
}, 1000)

