const {Collection, Client} = require('discord.js');
const {Sequelize, DataTypes} = require('sequelize');
const {Managers} = require('../Managers')
const config = require('../../config')
const logs = require('discord-logs')
const fs = require('fs')
const {Logger} = require('advanced-command-handler')
let user = config.database.user;
let name = config.database.name;
let pass = config.database.password;
let token = config.token;
const io = require('socket.io-client')
const Cluster = require("discord-hybrid-sharding");
const {XpSystem} = require('../../utils/Classes/discord-xp')
const Discord = require("discord.js");
let owner = [...config.owners];
if (config.botperso) {
    const path = './config.json';
    if (fs.existsSync(path)) {
        const configs = require('../../config.json')
        owner.push(configs.owner);
        user = configs.dbuser;
        name = configs.dbName;
        pass = configs.dbPass
        token = configs.token
    } else {
        owner.push(process.env.OWNER)
        user = process.env.DB_USER
        token = process.env.TOKEN
        pass = process.env.DB_PASS
        name = process.env.DB_NAME
    }
}

class OneForAll extends Client {
    constructor(options) {
        super(options);
        if (!config.botperso && !config.dev) {
            this.cluster = new Cluster.Client(this)
            this.shardWebhook = new Discord.WebhookClient({
                id: '801060243785383936',
                token: 'foWpfz4X8OEwrZ4SQfOR1khPOH0YdF1AsHzjfIqFW_iRpTSqtPfDwFJYUOx91Y4xv5oq',
                url: 'https://discord.com/api/webhooks/801060243785383936/foWpfz4X8OEwrZ4SQfOR1khPOH0YdF1AsHzjfIqFW_iRpTSqtPfDwFJYUOx91Y4xv5oq'
            });

        }
        this.login(token);

        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.config = config;
        this.functions = require('../../utils/functions');
        this.DataTypes = DataTypes;
        this.owners = owner;
        this.cooldown = new Collection();
        this.unavailableGuilds = 0;
        this.botperso = config.botperso;
        // this.oneforallSocket = io("http://localhost:3000", {
        //     extraHeaders: {
        //         "provenance": 'shards'
        //     }
        // })
        this.Logger = Logger
        this.database = new Sequelize(name, user, pass, {
            dialect: 'mysql',
            define: {
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
                timestamps: false,
                freezeTableName: true,

            },
            dialectOptions: {

                connectTimeout: 60000

            },
            logging: false
        })
        logs(this)

        this.loadEvents();
        this.loadCommands();

        // this.loadWebsocket();
        this.managers = new Managers(this);
        this.levels = new XpSystem(this)
        this.initDatabase()
    }

    lang(translate) {
        return require(`../../lang/${translate}`);
    }


    loadCommands() {
        const commmandsFolder = fs.readdirSync('./commands/').filter(name => name !== 'stats');
        Logger.info(`Loading ${commmandsFolder.length} category`, `Starting`)

        for (const category of commmandsFolder) {

            const commandFiles = fs.readdirSync(`./commands/${category}/`).filter(file => file.endsWith('.js'));
            Logger.comment(`${Logger.setColor('red', `Loading: ${commandFiles.length} commands in ${category}`)}`, `Loading commands`)

            for (const file of commandFiles) {
                const CommandFile = require(`../../commands/${category}/${file}`)
                const Command = new CommandFile();
                this.commands.set(Command.name, Command);
                for (const alias of Command.aliases) {
                    this.aliases.set(alias, Command)
                }
                delete require.cache[require.resolve(`../../commands/${category}/${file}`)]
                Logger.comment(`${Logger.setColor('green', `Loaded: ${Command.name}`)}`, `Loading commands`)
            }
        }
    }

    loadEvents() {
        const eventsFolder = fs.readdirSync('./events/')
        Logger.info(`Loading ${eventsFolder.length} events category`, `Starting`)
        for (const category of eventsFolder) {
            const eventsFile = fs.readdirSync(`./events/${category}/`).filter(file => file.endsWith('.js'))
            Logger.comment(`${Logger.setColor('red', `Loading: ${eventsFile.length} events in ${category}`)}`, `Loading events`)

            for (const event of eventsFile) {
                const EventFile = require(`../../events/${category}/${event}`);
                delete require.cache[require.resolve(`../../events/${category}/${event}`)]

                const Event = new EventFile(this);
                this.on(Event.name, (...args) => Event.run(this, ...args))
                this.events.set(Event.name, Event);
                Logger.comment(`${Logger.setColor('green', `Bind: ${event.split('.js')[0]}`)}`, `Binding events`)
            }
        }

    }

    loadWebsocket() {
        const eventsFile = fs.readdirSync('./events/websocket').filter(file => file.endsWith('.js'))
        Logger.info(`Loading ${eventsFile.length} websocket events`, `Starting`)

        for (const event of eventsFile) {
            const EventFile = require(`../../events/websocket/${event}`);
            const Event = new EventFile(this);
            this.oneforallSocket.on(Event.name, (...args) => Event.run(this.oneforallSocket, this, ...args))
            Logger.comment(`${Logger.setColor('green', `Bind: ${event.split('.js')[0]}`)}`, `Binding websocket events`)
        }
    }

    initDatabase() {
        this.database.authenticate().then(async () => {
            console.log("login");


            const modelsFile = fs.readdirSync('./structures/Models');
            for await (const model of modelsFile) {
                await require(`../Models/${model}`)(Sequelize, this)
                Logger.log(`${Logger.setColor(`red`, `${model.split('.')[0]}`)}`, 'LOADED DATABASE')
            }
            await this.database.sync({
                alter: true,
                force: false
            })
            this.GiveawayManagerWithOwnDatabase = require('../../utils/Classes/GiveawayWithDb')(this);
            this.giveawaysManager = new this.GiveawayManagerWithOwnDatabase(this, {
                updateCountdownEvery: 5000,
                hasGuildMembersIntent: true,
                default: {
                    botsCanWin: false,
                    // exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
                    embedColor: this.config.color,
                    embedColorEnd: this.config.color,
                    reaction: '🎉',
                    lastChance: {
                        enabled: true,
                        content: ' **LAST CHANCE TO ENTER !**️',
                        threshold: 5000,
                        embedColor: '#FF0000'
                    }
                }
            })
            // setTimeout(async () => {
            //     await this.database.models.maintenance.findOrCreate({where: {client: this.user.id}}).then(res => {
            //         this.maintenance = res[0].get().enable;
            //     })
            // }, 10000)


        })
    }

    isOwner(checkId) {
        return !!this.owners.includes(checkId)
    }
}

exports.OneForAll = OneForAll