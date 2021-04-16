
module.exports = function checkWl(whitelisted, authorId) {
  
  let wlCheck = false;

  if(whitelisted.includes(authorId) === true){
    wlCheck = true;
  }
  return wlCheck;
  
};

