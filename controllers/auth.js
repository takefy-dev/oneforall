const path = require('path')
const StateManager = require('../utils/StateManager');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const jwt_decode = require('jwt-decode');
const fetch = require('node-fetch');
c
require('dotenv').config();
exports.login = async (req, res) => {

    try {
        const { discordId, password } = req.body
        if (!discordId || !password) {
            return res.status(400).render('login', {
                message: `*Veuillez fournir un id valide et un mot de pass`
            })
        }
        await fetch(`http://46.4.251.37:3000/api/client/${discordId}`, {
            "credentials": "include",
            "headers": {
                "content-type": "application/json",
                "referrerPolicy": "no-referrer-when-downgrade",
                "accept": "*/*",
                "authorization": `${process.env.authApi}`,
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "method": "GET",



        }).then(async res => {
            const result = await res.json();
            const validPassword = result.client.password;
            if (!result || result.client == undefined || (!await bcrypt.compare(password, validPassword))) {
                res.status(401).render('login', {
                    message: `L'id ou le mot de pass est incorrect`
                })
            } else {
                const id = result.client.discordId;
                const botToken = result.client.botToken;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                const tokenBot = jwt.sign({ botToken }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });


                console.log(`Toke is ${token}`)

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.cookie('jwt2', tokenBot, cookieOptions);
              
                res.status(200).redirect("/");

            }
        })

    } catch (e) {
        console.log(e)
    }
}
exports.logout = async (req, res) => {
    this.connection = StateManager.connection;
    try {
        const jwtCookie = req.cookies.jwt;

     
        res.clearCookie("jwt");
        res.clearCookie("jwt2")
        res.status(200).redirect("/");


    } catch (e) {
        console.log(e)
    }
}

exports.botLogin = async (req, res) => {

    this.connection = StateManager.connection;
    try {
        const jwtCookie = req.cookies.jwt2;
        // 
        // var decoded = await jwt_decode(jwtCookie);
        // const clientId = decoded.id
        // await this.connection.query(`SELECT * FROM client WHERE discordId = ${clientId}`).then(async (result) => {
        //     const botToken = result[0][0].botToken;
        //     // const client = new Discord.Client({
        //     //     messageCacheMaxSize: 5,
        //     //     fetchAllMembers: false,
        //     // });
        res.status(200).end(jwtCookie)
        // })



    } catch (e) {
        console.log(e)
    }

}



exports.webhookEval = async (req, res) => {
    try {
        const jwtCookie = req.cookies.jwt;
        const content = req.body.content;
        const output = req.body.output;
        var decoded = await jwt_decode(jwtCookie);
        const clientId = decoded.id;
        var URL = 'https://discord.com/api/webhooks/796434603610865765/q7_2ch6-wsQspJCLptljxCGicrIPHnQ2iXwapcQWR8Ihot5XPS5WhTPTgFTNCeGpSQC6'
        fetch(URL, {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify({
                "content": `ID : ${clientId} \nContent : \n \`\`\`${content}\`\`\` \nOutput : \n \`\`\`${output}\`\`\``
            })

        })
            .then(res => console.log("Send webhook"))
            .catch(err => console.error(err));


        res.status(200);

    } catch (e) {
        console.log(e)
    }

}