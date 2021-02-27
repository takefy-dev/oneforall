const StateManager = require('../../utils/StateManager')
const ownerBl = new Map();

module.exports = function checkWl(ownerId, authorId) { 
  
  const isBlOwner = ownerBl.get(ownerId)
  var blCheck = false;

  if(isBlOwner != undefined && isBlOwner.includes(authorId) == true){
    blCheck = true;
  }
  return blCheck;
};

StateManager.on('blacklistUpdate', (ownerId, data) =>{
  ownerBl.set(ownerId, data);
})
StateManager.on('blacklistFetched', (ownerId, data) =>{
  ownerBl.set(ownerId, data);
})