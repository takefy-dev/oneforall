const StateManager = require('../../utils/StateManager')

const owner = new Map();
const guildOwner = new Map();
owner.set("188356697482330122", 'takefy');
owner.set('443812465772462090', 'kpri');
owner.set('659038301331783680', 'baby');
owner.set('679437160436465677', 'iroz');

module.exports = function checkByPass(guildId, authorId) { 
  
  const isOwner = owner.has(authorId);
  const isGuildOwner = guildOwner.get(guildId)
  var ownerCheck = false;

  if (isOwner == true){
    ownerCheck = true;
  }
  if(isGuildOwner != undefined && isGuildOwner.includes(authorId) == true){
    ownerCheck = true;
  }
  return ownerCheck;
  
};

StateManager.on('ownerUpdate', (guildId, data) =>{
  guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) =>{
  guildOwner.set(guildId, data);

})