require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.URL, { useNewUrlParser : true, useFindAndModify: false,useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', (err) =>  console.error(err));
db.once('open', () => console.log('connected to db '))

app.use(express.json())

const clientRouter = require('./routes/client.js');
app.use('/api/client', clientRouter);


app.listen(3000, () => console.log("Server start on http://localhost:3000/api"))