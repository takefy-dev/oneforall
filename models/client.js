const mongoose = require('mongoose');
const todayDate = new Date();
const now = new Date()
const days = 30;
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
        default : now.setDate(now.getDate() + days)
    },
    password: {
        type : String,
        require: true
    },
    botId :{
        type : String,
        require: false
    },
    deleteBotAt :{
        type: Date,
        require: true,
        default : todayDate.setDate(todayDate.getDate() + days + 1)
    }
    
})

module.exports = mongoose.model('client', clientSchema)