const StateManager = require('../../utils/StateManager')
const guilWl = new Map();

module.exports = function checkWl(guildId, authorId) { 
  
  const isGuildWl = guilWl.get(guildId)
  var wlCheck = false;

  if(isGuildWl != undefined && isGuildWl.includes(authorId) == true){
    wlCheck = true;
  }
  return wlCheck;
  
};

StateManager.on('wlUpdate', (guildId, data) =>{
  guilWl.set(guildId, data);
})
StateManager.on('wlFetched', (guildId, data) =>{
  guilWl.set(guildId, data);

})