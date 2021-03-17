const express = require('express');
const fs = require('fs')
const StateManager = require('../utils/StateManager');
const router = express.Router();
const jwt_decode = require('jwt-decode')


let chCounter = fs.readFileSync('./public/counter/channelCounter.txt', { encoding: 'utf8' });
let userCounter = fs.readFileSync('./public/counter/userCounter.txt', { encoding: 'utf8' });
let serverCounter = fs.readFileSync('./public/counter/serverCounter.txt', { encoding: 'utf8' });

setInterval(async () => {
    chCounter = fs.readFileSync('./public/counter/channelCounter.txt', { encoding: 'utf8' });
    userCounter = fs.readFileSync('./public/counter/userCounter.txt', { encoding: 'utf8' });
    serverCounter = fs.readFileSync('./public/counter/serverCounter.txt', { encoding: 'utf8' });

}, 20000)



router.get('/', (req, res) => {

    if (req.cookies.jwt != undefined) {
        res.render('indexLog', { chCounter: chCounter.toString(), userCounter: userCounter.toString(), serverCounter: serverCounter.toString() })
    } else {
        res.render('index', { chCounter: chCounter.toString(), userCounter: userCounter.toString(), serverCounter: serverCounter.toString() })

    }

});
router.get('/login', (req, res) => {
    res.render('login', { message: ' ' })

});
router.get('/logout', (req, res) => {
    res.render('logout')

});
router.get('/mybots', async (req, res) => {
    this.connection = StateManager.connection;
    const dateFormater = require('pm-date-formater');
    const ms = require('ms')
    const jwtCookie = req.cookies.jwt;
    const gdate = require('gdate')
    const prettyMilliseconds = require('pretty-ms');

    if (jwtCookie != undefined) {
        var decoded = await jwt_decode(req.cookies.jwt);
        const clientId = decoded.id
        console.log(decoded)
        const clientInfoFetched = await this.connection.query(`SELECT * FROM client WHERE discordId = ${clientId}`);
        const botId = clientInfoFetched[0][0].botId;
        const discordName = clientInfoFetched[0][0].discordName;
        let expireAt = clientInfoFetched[0][0].expireAt;
        let now = Date.now();
        now = new Date(now)
        expireAt = new Date(expireAt)
        const timeLeft = prettyMilliseconds(expireAt.getTime() - now.getTime())
        const discordInv = `https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot&permissions=8`
        res.render('mybots', { discordInv, discordName, timeLeft })
    } else {
        res.render('index', { chCounter: chCounter.toString(), userCounter: userCounter.toString(), serverCounter: serverCounter.toString() })

    }

});


router.get('/dashboard', async (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", '*');
    this.connection = StateManager.connection;
    const jwtCookie = req.cookies.jwt;
    if (jwtCookie != undefined) {
        // res.setHeader("Access-Control-Allow-Origin", '*');

        this.connection = StateManager.connection;
        const jwtCookie = req.cookies.jwt;
        var decoded = await jwt_decode(jwtCookie);
        const clientId = decoded.id
   
        res.render('dashboard')




    } else {
        res.render('index', { chCounter: chCounter.toString(), userCounter: userCounter.toString(), serverCounter: serverCounter.toString() })

    }

});

router.get('/commands', async (req, res) => {
    res.render('commands')
})

router.get('/botperso', async (req, res) => {
    if (req.cookies.jwt != undefined) {
        res.render('botPersoLog')
    } else {
        res.render('botperso')

    }
})

router.get('/about', async (req, res) => {
   res.render('about')
})






module.exports = router;