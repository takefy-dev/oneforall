const StateManager = require('../utils/StateManager');

module.exports = function embedsColor(map){
    StateManager.on('langUpdate', (guildId, lang) =>{
        map.set(guildId, lang);
    });
    StateManager.on('langFetched', (guildId, lang) =>{
        map.set(guildId, lang);
    });
}