const StateManager = require('../utils/StateManager');

module.exports = function embedsColor(map){
    StateManager.on('colorUpdate', (guildId, color) =>{
        map.set(guildId, color);
    });
    StateManager.on('colorFetched', (guildId, color) =>{
        map.set(guildId, color);
    });
}