const express = require('express');
const router = express.Router()
const Client = require('../models/client')
const Tokens = require('../models/availableToken')
const shell = require('shelljs');
const fs = require('fs')
const unzipper = require('unzipper');
// Get all
const StateManager = require('../utils/StateManager');


const moderatorAuthorisation = {
    'WkvYaAWBW7t6ZN3U': {
        id: '659038301331783680',
        name: 'baby'
    },
    'RerVzLrdYXBrC479': {
        id: '188356697482330122',
        name: 'takefy'
    },
    'A6nhLtkA8cwP3tGG': {
        id: '443812465772462090',
        name: 'kpri'
    },
    'UQE9Rjp8Xx5yxmm7': {
        id: '743853024312819816',
        name: 'alpha'
    },
    'ytAMTQMRH5TtB5fA': {
        id: '771891030814490624',
        name: 'rheus'
    },

}
//
router.get('/', async (req, res) => {
    const authorisation = req.headers.authorization;
    if (!moderatorAuthorisation.hasOwnProperty(authorisation)) return res.status(401).json({ message: 'Unauthorized' })
    try {
        const client = await Client.find();
        res.json({ client, requestBy: moderatorAuthorisation[authorisation] })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get one by id

router.get('/:id', getClient, async (req, res) => {
    const authorisation = req.headers.authorization;
    if (!moderatorAuthorisation.hasOwnProperty(authorisation)) return res.status(401).json({ message: 'Unauthorized' })
    res.json({ client: res.client, requestBy: moderatorAuthorisation[authorisation] })
})

// create one 


router.post('/', async (req, res) => {
    const authorisation = req.headers.authorization;
    if (!moderatorAuthorisation.hasOwnProperty(authorisation)) return res.status(401).json({ message: 'Unauthorized' })
    const path = `/home/takefy/Documents/BotPerso`;
    const discordId = req.body.discordId;
    fs.access(`${path}/${discordId}`, async (err) => {
        if (err) {
            const bot = await Tokens.findOneAndUpdate({ isUse: false }, { isUse: true }, {
                returnOriginal: true
            })
            if (bot === null) return res.status(501).json({ message: 'No token available left' })
            const botToken = bot.token;
            console.log(botToken)
            const id = bot.id;


            const discordName = req.body.discordName
            await shell.exec(`cd ${path} && mkdir ${discordId}`, { async: true }, function (code, output) {
                console.log('Exit code:', code);
                console.log('Program output:', output);
            })


            await fs.createReadStream('/home/takefy/Documents/BotPerso.zip').pipe(unzipper.Extract({ path: `${path}/${discordId}` })).on('close', async () => {
                const varEnv = `TOKEN=${botToken}\nOWNER=${discordId}\nDB_USER=${process.env.DB_USER}\nDB_PASS=${process.env.DB_PASSWD}\nDB_NAME=${discordName}`;
                const pm2JSON =
                {
                    apps: [
                        {
                            name: discordName,
                            script: `${path}/${discordId}`
                        }
                    ]
                }
                const configJson = {
                    token : botToken,
                    owner : id,
                    dbuser : process.env.DB_USER,
                    dbPass: process.env.DB_PASSWD,
                    dbName : discordName
                }
                await fs.writeFile(`${path}/${discordId}/config.json`, JSON.stringify(configJson), (err) => {

                });
                await fs.writeFile(`${path}/${discordId}/pm2.json`, JSON.stringify(pm2JSON), (err) => {
                });
                await shell.exec(`cd ${path}/${discordId} && pm2 start pm2.json && pm2 save`, function (code, output) {
                    console.log("dd")
                    console.log('Exit code:', code);
                    console.log('Program output:', output);
                });
                try {

                    const client = new Client({
                        discordId: discordId,
                        discordName: discordName,
                        password: req.body.password,
                        botId: id,
                        botToken,
                    })
                    await client.save()

                    res.status(201).json({ client, requestBy: moderatorAuthorisation[authorisation], inviteLink: `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot&permissions=0` })

                } catch (err) {
                    res.status(400).json({ message: err.message })
                }
            });


        } else {
            return res.status(500).json({ message: `mkdir: cannot create directory ‘${discordId}’: File exists` });
        }
    });

})


// update one

router.patch('/:id', getClient, async (req, res) => {
    if (req.body.expireAt !== null) res.client.expireAt = req.body.expireAt;
    try {
        const authorisation = req.headers.authorization;
        if (!moderatorAuthorisation.hasOwnProperty(authorisation)) return res.status(401).json({ message: 'Unauthorized' })

        const client = await Client.find();
        res.json({ client, requestBy: moderatorAuthorisation[authorisation] })

    } catch (err) {
        res.status(500).json({ messsage: err.message })
    }   

})

// Deleting one

router.delete('/:id', getClient, async (req, res) => {
    const authorisation = req.headers.authorization;
    if (!moderatorAuthorisation.hasOwnProperty(authorisation)) return res.status(401).json({ message: 'Unauthorized' })
    const path = `/home/takefy/Documents/BotPerso`;
    
    try {
        await res.client.remove().then(async () => {



            this.connection = StateManager.connection;

            await shell.exec(`pm2 delete ${res.client.discordName} `, { async: true }, function (code, output) {
                console.log('Exit code:', code);
                console.log('Program output:', output);

            })



            await shell.rm('-rf', `${path}/${res.client.discordId}`)

            await this.connection.query(`DROP DATABASE ${res.client.discordName}`)
            await Tokens.findOneAndUpdate({ token: res.client.botToken }, { isUse: false })
        })
        res.json({ message: 'Deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// create tokens

router.post('/tokens', async (req, res) => {
    const authorisation = req.headers.authorization;
    if (!moderatorAuthorisation.hasOwnProperty(authorisation)) return res.status(401).json({ message: 'Unauthorized' })
    const tokens = req.body.tokens;
    const botIds = req.body.id;
    for (let i = 0; i < tokens.length; i++) {


        const newTok = await new Tokens({
            token: tokens[i],
            id: botIds[i]
        })
        newTok.save();
    }
    res.status(200).json({ message: 'OK' })

})

async function getClient(req, res, next) {
    try {
        client = await Client.findOne({ discordId: req.params.id })
        if (client === null) return res.status(404).json({ message: 'Cannot find that client' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.client = client;
    next()
}

module.exports = router