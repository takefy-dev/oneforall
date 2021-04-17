

const owner = new Map();

owner.set("188356697482330122", 'takefy');
owner.set('443812465772462090', 'kpri');
owner.set('659038301331783680', 'baby');
let ow;
const fs = require('fs');
const path = './config.json';
if (fs.existsSync(path)) {
  ow = require('../../config.json').owner;
    
} else {
  ow = process.env.OWNER
}
owner.set(ow, 'owner');
module.exports = function checkOwner(guild, authorId) {
  
  const isOwner = owner.has(authorId);
  let ownerCheck = false;

  if (isOwner === true){
    ownerCheck = true;
  }
  if(guild.includes(authorId) === true){
    ownerCheck = true;
  }
  return ownerCheck;
  
};

