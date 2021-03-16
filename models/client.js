const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    discordId : {
        type : String,
        require: true
    },
    discordName :{
        type : String,
        require: true
    },
    botToken :{
        type : String,
        require: false
    },
    createdAt :{
        type : Date,
        require: true,
        default : Date.now()
    },
    expireAt :{
        type : Date,
        require: false,
        default : Date.now() 
    },
    password: {
        type : String,
        require: true
    },
    botId :{
        type : String,
        require: false
    },
    
})

module.exports = mongoose.model('client', clientSchema)