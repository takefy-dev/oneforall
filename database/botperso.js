require('dotenv').config();
const mysql = require('mysql2/promise');


const fs = require('fs');
const path = './config.json';
let user;
let name;
let pass;
if (fs.existsSync(path)) {
    const config = require('../config.json')
   
        user = config.dbuser
        pass= config.dbPass

} else {
    user =process.env.DB_USER
    pass=process.env.DB_PASS
}



module.exports = mysql.createConnection({
    user: user,
    password: pass,
});