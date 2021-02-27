const StateManager = require('../../utils/StateManager')
const guildSetupDone= new Map();


module.exports = function checkSetup(guild) { 
  const checkSetup = guildSetupDone.get(guild);
  var setupChecked = false;
  if (checkSetup == true){
      setupChecked = true;
  }
  return setupChecked;
  
};


StateManager.on('setupDone', (guildId, setup) =>{
    guildSetupDone.set(guildId, setup)
})

StateManager.on('setupDoneFetched', (guildId, setup) =>{
    guildSetupDone.set(guildId, setup)
})