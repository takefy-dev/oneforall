const StateManager = require('../utils/StateManager');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const jwt_decode = require('jwt-decode');
require('dotenv').config();
const fs = require('fs');
const { exec } = require('child_process');
let processList;
const startMap = new Map();
const restartMap = new Map();
const stopMap = new Map();
const fetch = require('node-fetch');
exports.start = async (req, res) => {
    this.connection = StateManager.connection;
    try {
        const jwtCookie = req.cookies.jwt;
        var decoded = await jwt_decode(jwtCookie);
        const clientId = decoded.id;
        if (!startMap.has(clientId)) {
            startMap.set(clientId, '1')
        } else if (startMap.has(clientId)) {
            return res.status(200).end("errToManyTimes");
        }


        const path = `D:\\Github\\DiscordBot\\${decoded.id}\\`
        const pm2Json = require(path + 'pm2.json');
        const pm2ProcessName = pm2Json.apps[0].name;
        console.log(pm2Json.apps[0].name)
        await exec('pm2 save --force')
        await exec(`pm2 l`, async function (error, stdout, stderr) {
            processList = stdout
            // console.log(processList)
            // console.log("done")
            // console.log('stdout: ' + stdout);
            // console.log('stderr: ' + stderr);

            if (processList.includes(pm2ProcessName)) {

                return res.status(200).end("errStart")

            } else {
                exec(`pm2 start pm2.json`, { cwd: path }, function (error, stdout, stderr) {
                    // console.log('stdout: ' + stdout);
                    // console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                    return res.status(200).end("start")

                })
            }
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        })


        setTimeout(() => {
            startMap.delete(clientId)
        }, 10 * 60000)
        console.log(startMap)


    } catch (err) {
        console.log(err)
    }

};

exports.restart = async (req, res) => {
    this.connection = StateManager.connection;
    try {
        const jwtCookie = req.cookies.jwt;
        var decoded = await jwt_decode(jwtCookie);
        const clientId = decoded.id;
        if (!restartMap.has(clientId)) {
            restartMap.set(clientId, '1')
        } else if (restartMap.has(clientId)) {
            return res.status(200).end("errToManyTimes");
        }
        const path = `D:\\Github\\DiscordBot\\${decoded.id}\\`
        const pm2Json = require(path + 'pm2.json');
        const pm2ProcessName = pm2Json.apps[0].name;
        console.log(pm2Json.apps[0].name)

        exec(`pm2 restart ${pm2ProcessName}`, { cwd: path }, function (error, stdout, stderr) {
            if (error == null) {
                res.status(200).end("restart")

                console.log('stdout: ' + stdout);

            }

            if (error != null && error.toString().includes('not found')) {
                res.status(200).end("errRestart")

                console.log('exec error: ' + error);
            }
        })
        setTimeout(() => {
            restartMap.delete(clientId)
        }, 10 * 60000);
    } catch (err) {
        console.log(err)
    }

};

exports.stop = async (req, res) => {
    this.connection = StateManager.connection;
    try {
        const jwtCookie = req.cookies.jwt;
        var decoded = await jwt_decode(jwtCookie);
        const clientId = decoded.id;
        if (!stopMap.has(clientId)) {
            stopMap.set(clientId, '1')
        } else if (stopMap.has(clientId)) {
            return res.status(200).end("errToManyTimes");
        }
        const path = `D:\\Github\\DiscordBot\\${decoded.id}\\`
        const pm2Json = require(path + 'pm2.json');
        const pm2ProcessName = pm2Json.apps[0].name;
        console.log(pm2Json.apps[0].name)

        exec(`pm2 stop ${pm2ProcessName}`, { cwd: path }, function (error, stdout, stderr) {
            if (stdout) {
                res.status(200).end("stop")
                // console.log('stdout: ' + stdout);

            }
            if (stderr) {
                // console.log('stderr: ' + stderr);

            }

            if (error != null && error.toString().includes('not found')) {
                res.status(200).end("errStop")

                // console.log('exec error: ' + error);
            }
        })
        setTimeout(() => {
            stopMap.delete(clientId)
        }, 10 * 60000);
    } catch (err) {
        console.log(err)
    }

};

exports.changeName = async (req, res) => {
    this.connection = StateManager.connection;
    try {
        const jwtCookie = req.cookies.jwt2;
        var decoded = await jwt_decode(jwtCookie);
        const token = decoded.botToken;
        const name = req.body.name;
        fetch(`https://discord.com/api/v7/users/@me`, {
            "headers": {
                "authorization": "Bot " + token,
                "content-type": "application/json",
            },
            "body": JSON.stringify({
                "username": name
            }),
            "method": "PATCH",
            "mode": "cors"
        })
            .then(
                function (u) { return u.json(); }
            ).then(
                function (json) {
                    if (json.errors == undefined) return res.status(200).end("changeNameOk")
                    if (json.errors.username._errors[0].code === "USERNAME_RATE_LIMIT") return res.status(200).end("USERNAME_RATE_LIMIT");
                    if (json.errors.username._errors[0].code === "USERNAME_TOO_MANY_USERS") return res.status(200).end("USERNAME_TOO_MANY_USERS");
                }
            )


    } catch (err) {
        console.log(err)
    }
}

// exports.changeActivity = async (req, res) => {


//     this.connection = StateManager.connection;
//     try {
//         const link = req.body.link;
//         // const imageToBase64 = require('image-to-base64');
//         // imageToBase64(link) // Path to the image
//         //     .then(
//         //         (response) => {
//         //             console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
//         //         }
//         //     )
//         //     .catch(
//         //         (error) => {
//         //             console.log(error); // Logs an error if there was one
//         //         }
//         //     )
//         // fetch(`https://discord.com/api/v7/users/@me`, {
//         //     "headers": {
//         //         "authorization": "Bot " + token,
//         //         "content-type": "application/json",
//         //     },
//         //     "body": JSON.stringify({
//         //         "username": name
//         //     }),
//         //     "method": "PATCH",
//         //     "mode": "cors"
//         // })
//         // .then(
//         //     function(u){ return u.json();}
//         //   ).then(
//         //     function(json){
//         //         if(json.errors == undefined) return res.status(200).end("changeNameOk")
//         //         if(json.errors.username._errors[0].code === "USERNAME_RATE_LIMIT") return res.status(200).end("USERNAME_RATE_LIMIT");
//         //         if(json.errors.username._errors[0].code === "USERNAME_TOO_MANY_USERS") return res.status(200).end("USERNAME_TOO_MANY_USERS");
//         //     }
//         //   )

//     } catch (err) {
//         console.log(err)
//     }
// }