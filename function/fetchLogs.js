const StateManager = require('../utils/StateManager');

module.exports = function log(map, type) {
    if(type == 'raid'){
        StateManager.on('raidLogFetch', (guildId, logs) => {
          if(logs == 'Non définie') return map.set(guildId, undefined);

            map.set(guildId, logs);
        });
        StateManager.on('raidLogUp', (guildId, logs) => {
          if(logs == 'Non définie') return map.set(guildId, undefined);
            map.set(guildId, logs);
        });
    }
    if(type == 'mod'){
        StateManager.on('modLogFetch', (guildId, logs) => {
          if(logs == 'Non définie') return map.set(guildId, undefined);

            map.set(guildId, logs);
        });
        StateManager.on('modLogUp', (guildId, logs) => {

          if(logs == 'Non définie') return map.set(guildId, undefined);

            map.set(guildId, logs);
        });
    }
    if(type == 'voice'){
        StateManager.on('voiceLogFetch', (guildId, logs) => {
          if(logs == 'Non définie') return map.set(guildId, undefined);

            map.set(guildId, logs);
        });
        StateManager.on('voiceLogUp', (guildId, logs) => {
          if(logs == 'Non définie') return map.set(guildId, undefined);

            map.set(guildId, logs);
        });
    }
    if(type == 'msg'){
        StateManager.on('msgLogFetch', (guildId, logs) => {
          if(logs == 'Non définie') return map.set(guildId, undefined);

            map.set(guildId, logs);
        });
        StateManager.on('msgLogUp', (guildId, logs) => {
          if(logs == 'Non définie') return map.set(guildId, undefined);

            map.set(guildId, logs);
        });
    }
   
   
    
   
   
}