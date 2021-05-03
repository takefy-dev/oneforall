const {Collection, Client} = require('discord.js');
const {Sequelize} = require('sequelize');
const config = require('../../config')
const logs = require('discord-logs')
const fs = require('fs')
const {Logger} = require('advanced-command-handler')
const Distube = require('distube');
let user =  config.database.user;
let name = config.database.name;
let pass = config.database.password;
let token = config.token;
let owner = [...config.owners];
if(config.botperso){
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

module.exports = class OneForAll extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.config = config;
        this.owners = owner;
        this.cooldown = new Collection();
        this.database = new Sequelize(name, user,pass, {
            dialect: 'mysql',
            define: {
                charset: "utf8",
                collate: "utf8_general_ci",
                timestamps: false,
                freezeTableName: true,

            },
          
            logging: false
        })
        logs(this)
        this.login(config.token);
        this.loadCommands();
        this.loadEvents();
        this.initDatabase()
        this.botperso = config.botperso;
        this.maintenance = false;
        this.music = new Distube(this, {searchSongs: false, leaveOnEmpty: true});

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
                const Event = new EventFile(this);
                this.on(Event.name, (...args) => Event.run(this, ...args))
                this.events.set(Event.name, Event);

                Logger.comment(`${Logger.setColor('green', `Bind: ${event.split('.js')[0]}`)}`, `Binding events`)
            }
        }

    }

    initDatabase() {
        this.database.authenticate().then(async () => {
              await this.database.sync({
                alter: true,
                force: false
            })
            const modelsFile = fs.readdirSync('./structures/models');
            for await (const model of modelsFile) {
                await require(`../models/${model}`)(Sequelize, this)
                Logger.log(`${Logger.setColor(`red`, `${model.split('.')[0]}`)}`, 'LOADED DATABASE')
            }
          
            await this.database.models.maintenance.findOrCreate({where: {client: this.user.id}}).then(res => {
                this.maintenance = res[0].dataValues.enable;
            })


        })
    }

    isOwner(checkId) {
        return !!this.owners.includes(checkId)
    }
}
