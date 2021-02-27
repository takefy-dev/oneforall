const StateManager = require('../utils/StateManager');

module.exports = function log(map, type) {
        StateManager.on('counterFetched', (guildId, count) => {
            const counter = count.filter(counter => counter.name != 'Non définie')
            if(counter.length == 0) return
            map.set(guildId, counter);
        });
        StateManager.on('counterUp', (guildId, count) => {
            const counter = count.filter(counter => counter.name != 'Non définie')
            if(counter.length == 0) return
            

            map.set(guildId, counter);
        });
    // }
   
   
    
   
   
}