var app = require("express")(); 
var bodyParser = require("body-parser"); 
var express = require('express');
const StateManager = require('./utils/StateManager.js')
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/action', require('./routes/action'));

//Use body-parser



//Set view engine to ejs
app.set("view engine", "ejs");

app.listen(8080, () => { console.log("Server online on http://localhost:8080"); });