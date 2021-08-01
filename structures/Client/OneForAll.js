const {Collection, Client, WebhookClient} = require('discord.js'),
    {CommandHandler, EventHandler, SlashCommandHandler} = require('../Handler'),
    {Sequelize, DataTypes} = require('sequelize'),
    {Managers} = require('../Managers'),
    config = require('../../config'),
    logs = require('discord-logs'),
    fs = require('fs'),
    {Logger} = require('advanced-command-handler'),
    user = config.database.user,
    name = config.database.name,
    pass = config.database.password,
    token = config.token,
    io = require('socket.io-client'),
    Cluster = require("discord-hybrid-sharding"),
    {XpSystem} = require('../../utils/Classes/discord-xp'),
    owner = [...config.owners]

class OneForAll extends Client {
    constructor(options) {
        super(options);
        if (!config.botperso && !config.dev) {
            this.cluster = new Cluster.Client(this)
            this.shardWebhook = new WebhookClient({
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
        this.DataTypes = DataTypes;
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
        // this.loadWebsocket();
        this.managers = new Managers(this);
        this.initDatabase()

        this.levels = new XpSystem(this)
    }

    lang(translate) {
        return require(`../../lang/${translate}`);
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
            // new SlashCommandHandler(this);
            new EventHandler(this);
            new CommandHandler(this);
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