const StateManager = require('../../utils/StateManager')
const guildByPassId= new Map();


module.exports = function checkByPass(guild, author) { 
  const byPassRoleId = guildByPassId.get(guild);
  var byPassChecked = false;
  if(author.has(byPassRoleId)){
    byPassChecked = true;
  }
  return byPassChecked;
  
};


StateManager.on('addByPassRole', (guildId, byPassId) =>{
  guildByPassId.set(guildId, byPassId)
})

StateManager.on('byPassIdFetched', (guildId, byPassId) =>{
  guildByPassId.set(guildId, byPassId)
})