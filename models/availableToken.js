const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
   token : {
       type: String,
       unique: true,
       require : true
   },
   id :{
        type: String,
        unique: true,
        require: true,
   },
   isUse : {
       type : Boolean,
       default : false
   }
   
    
})

module.exports = mongoose.model('availableToken', tokenSchema)