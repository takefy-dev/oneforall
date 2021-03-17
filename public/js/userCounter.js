const fs = require('fs')
setInterval(async () => {
    fs.readFileSync('./counter/userCounter.txt', {encoding:'utf8'});
}, 20000)

